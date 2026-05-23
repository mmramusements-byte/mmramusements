import { pool } from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';

// Upload resume/file to Cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype === 'application/pdf' ? 'raw' : 'raw';
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'mmr_careers_resumes', resource_type: 'raw' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const submitApplication = async (req, res) => {
  try {
    const { full_name, email, phone, position, experience, portfolio_url, cover_letter, notes } = req.body;
    if (!full_name || !email || !position) {
      return res.status(400).json({ error: 'Full name, email, and position are required.' });
    }

    let resume_url = null;
    if (req.file) {
      resume_url = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    }

    const result = await pool.query(
      `INSERT INTO careers_applications (full_name, email, phone, position, experience, portfolio_url, resume_url, cover_letter, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [full_name, email, phone || null, position, experience || null, portfolio_url || null, resume_url, cover_letter || null, notes || null]
    );

    // Send notification email to admin
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"MMR Amusements Careers" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `New Career Application: ${position} - ${full_name}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px">
          <h2 style="color:#ef4444">New Career Application Received</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Name:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${full_name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Email:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Phone:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Position:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${position}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Experience:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${experience || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Portfolio:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${portfolio_url || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Resume:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${resume_url ? `<a href="${resume_url}">Download Resume</a>` : 'Not provided'}</td></tr>
          </table>
          <div style="margin-top:16px"><b>Cover Letter:</b><p style="color:#555">${cover_letter || 'Not provided'}</p></div>
          <p style="color:#888;font-size:12px">View all applications at the admin panel.</p>
        </div>`,
      });

      // Send confirmation to applicant
      await transporter.sendMail({
        from: `"MMR Amusements" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Application Received — ${position} at MMR Amusements`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px">
          <h2 style="color:#ef4444">Thank You for Applying, ${full_name}!</h2>
          <p>We have received your application for the <strong>${position}</strong> position at MMR Amusements.</p>
          <p>Our team will review your application and reach out within 3-5 business days.</p>
          <hr/>
          <p style="color:#888;font-size:12px">MMR Amusements — 2543 Boardwalk St, San Antonio, TX 78240</p>
        </div>`,
      });
    } catch (emailErr) {
      console.error('Email send error (careers):', emailErr);
    }

    res.status(201).json({ message: 'Application submitted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('submitApplication error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { search, position, status } = req.query;
    let query = 'SELECT * FROM careers_applications WHERE 1=1';
    const params = [];
    let idx = 1;
    if (search) { query += ` AND (full_name ILIKE $${idx} OR email ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (position) { query += ` AND position ILIKE $${idx}`; params.push(`%${position}%`); idx++; }
    if (status) { query += ` AND status = $${idx}`; params.push(status); idx++; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getApplications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const result = await pool.query('UPDATE careers_applications SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM careers_applications WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    console.error('deleteApplication error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

export const getJobs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM careers_jobs ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const addJob = async (req, res) => {
  try {
    const { title, dept, type, level, location } = req.body;
    const result = await pool.query(
      'INSERT INTO careers_jobs (title, dept, type, level, location) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, dept, type, level, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('addJob error:', error);
    res.status(500).json({ error: 'Failed to add job' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dept, type, level, location } = req.body;
    const result = await pool.query(
      'UPDATE careers_jobs SET title=$1, dept=$2, type=$3, level=$4, location=$5 WHERE id=$6 RETURNING *',
      [title, dept, type, level, location, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('updateJob error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM careers_jobs WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json({ message: 'Job deleted' });
  } catch (error) {
    console.error('deleteJob error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
