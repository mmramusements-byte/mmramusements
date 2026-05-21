import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/authRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import settingsRoutes from '../server/routes/settingsRoutes.js';
import { initializeDatabase } from '../server/config/db.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true })); // Vercel handles CORS gracefully this way, or we can configure it specifically
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Initialize database on startup
// Note: In serverless, this might be called per cold start. Our db init logic should use IF NOT EXISTS.
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (err) {
      console.error('Database initialization failed:', err);
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running successfully.' });
});

export default app;
