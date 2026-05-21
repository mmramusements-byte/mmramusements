import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be exactly 6 characters')
});
