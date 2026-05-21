import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { sendOtpSchema, verifyOtpSchema } from '../utils/validation.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js';
import { transporter } from '../config/nodemailer.js';

const router = express.Router();

// Validation Middleware Helper
const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors[0].message });
  }
};

router.post('/send-otp', authLimiter, validateRequest(sendOtpSchema), sendOtp);
router.post('/verify-otp', authLimiter, validateRequest(verifyOtpSchema), verifyOtp);

// Testing Routes
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const mailOptions = {
      from: `"MMR Amusements" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Test Email - MMR Amusements Backend',
      text: 'This is a test email to verify SMTP configuration.',
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Test email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

router.get('/protected-test', protectAdminRoute, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route successfully', admin: req.admin });
});

export default router;
