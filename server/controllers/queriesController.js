import { pool } from '../config/db.js';
import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const QUERIES_EMAIL = 'info@mmramusements.com';

export const submitQuery = async (req, res) => {
  try {
    const { full_name, email, phone, company, subject, message } = req.body;
    if (!full_name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }

    // Save to DB — non-blocking: if DB is unavailable we still process the request
    let savedId = null;
    try {
      const result = await pool.query(
        `INSERT INTO customer_queries (full_name, email, phone, company, subject, message)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [full_name, email, phone || null, company || null, subject, message]
      );
      savedId = result.rows[0]?.id;
    } catch (dbErr) {
      console.error('submitQuery DB error (non-fatal):', dbErr.message);
    }

    try {
      const transporter = createTransporter();
      // Notify info@mmramusements.com (routed through SMTP as sender)
      await transporter.sendMail({
        from: `"MMR Amusements Queries" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // real deliverable address; note: ideally forward from info@ to this
        replyTo: email,
        subject: `New Customer Query: ${subject}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px">
          <h2 style="color:#ef4444">New Customer Query</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Name:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${full_name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Email:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Phone:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Company:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${company || 'N/A'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><b>Subject:</b></td><td style="padding:8px;border-bottom:1px solid #eee">${subject}</td></tr>
          </table>
          <div style="margin-top:16px"><b>Message:</b><p style="color:#555;white-space:pre-wrap">${message}</p></div>
          <p style="color:#888;font-size:12px">Reply-To: ${email} | View all queries at the admin panel.</p>
        </div>`,
      });

      // Confirmation to customer
      await transporter.sendMail({
        from: `"MMR Amusements" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `We received your query — MMR Amusements`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px">
          <h2 style="color:#ef4444">Thank You, ${full_name}!</h2>
          <p>We've received your query: <strong>${subject}</strong></p>
          <p>Our team will respond within 1-2 business days at <strong>${email}</strong>.</p>
          <p>For urgent matters, call us at <strong>+1 (210) 388-8416</strong>.</p>
          <hr/>
          <p style="color:#888;font-size:12px">MMR Amusements — info@mmramusements.com | 2543 Boardwalk St, San Antonio, TX 78240</p>
        </div>`,
      });
    } catch (emailErr) {
      console.error('Email send error (queries):', emailErr);
    }

    res.status(201).json({ message: 'Query submitted successfully', id: savedId });
  } catch (error) {
    console.error('submitQuery error:', error);
    res.status(500).json({ error: 'Failed to submit query' });
  }
};

export const getQueries = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT * FROM customer_queries WHERE 1=1';
    const params = [];
    let idx = 1;
    if (search) { query += ` AND (full_name ILIKE $${idx} OR email ILIKE $${idx} OR subject ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (status) { query += ` AND status = $${idx}`; params.push(status); idx++; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getQueries error:', error);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
};

export const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['new', 'in_progress', 'resolved', 'closed'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const result = await pool.query('UPDATE customer_queries SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Query not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM customer_queries WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Query not found' });
    res.status(200).json({ message: 'Query deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete query' });
  }
};
