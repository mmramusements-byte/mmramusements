import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"MMR Amusements Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your Admin Login OTP - MMR Amusements',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #333; border-radius: 10px; background-color: #000; color: #fff;">
        <h2 style="color: #fbbf24; text-align: center;">MMR Amusements Admin Access</h2>
        <p>You requested access to the admin panel. Your One-Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background: #222; border-radius: 5px; color: #fbbf24;">${otp}</span>
        </div>
        <p>This code will expire in 5 minutes. Do not share this code with anyone.</p>
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 40px;">If you didn't request this, please secure your account immediately.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
