import { pool } from '../config/db.js';
import { sendOtpEmail } from '../config/nodemailer.js';
import { hashData, compareData } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mmramusements@gmail.com';

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Whitelist Check
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access denied. Only the registered admin can login.' });
    }

    // 1.5 Check 30s Cooldown
    const recentResult = await pool.query(
      `SELECT created_at FROM otp_codes WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email]
    );
    if (recentResult.rows.length > 0) {
      const lastSentAt = new Date(recentResult.rows[0].created_at).getTime();
      const now = Date.now();
      const timeDiff = (now - lastSentAt) / 1000;
      if (timeDiff < 30) {
        return res.status(429).json({ error: `Please wait ${Math.ceil(30 - timeDiff)} seconds before requesting a new OTP.` });
      }
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Hash OTP
    const otpHash = await hashData(otp);
    
    // 4. Set expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 5. Store in DB
    await pool.query(
      `INSERT INTO otp_codes (email, otp_hash, expires_at) VALUES ($1, $2, $3)`,
      [email, otpHash, expiresAt]
    );

    // 6. Send Email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // 1. Retrieve the latest OTP for this email
    const result = await pool.query(
      `SELECT * FROM otp_codes WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'No OTP found for this email.' });
    }

    const otpRecord = result.rows[0];

    // 2. Check Expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // 2.5 Check Attempts
    if (otpRecord.attempts >= 5) {
      return res.status(400).json({ error: 'Too many invalid attempts. OTP has been invalidated. Please request a new one.' });
    }

    // 3. Verify Hash
    const isValid = await compareData(otp, otpRecord.otp_hash);
    if (!isValid) {
      // Increment attempts
      await pool.query(
        `UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`,
        [otpRecord.id]
      );
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    // 4. Ensure admin exists in admins table
    let adminResult = await pool.query(`SELECT * FROM admins WHERE email = $1`, [email]);
    if (adminResult.rows.length === 0) {
      // Create admin if somehow missing but whitelisted
      adminResult = await pool.query(
        `INSERT INTO admins (email) VALUES ($1) RETURNING *`,
        [email]
      );
    }
    const adminUser = adminResult.rows[0];

    // 5. Generate JWT
    const token = generateToken({ id: adminUser.id, email: adminUser.email });

    // 6. Delete used OTP (and older ones for this email to clean up)
    await pool.query(`DELETE FROM otp_codes WHERE email = $1`, [email]);

    // 7. Send Response
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP.' });
  }
};
