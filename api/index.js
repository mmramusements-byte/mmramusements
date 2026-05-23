import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/authRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import settingsRoutes from '../server/routes/settingsRoutes.js';
import uploadRoutes from '../server/routes/uploadRoutes.js';
import careersRoutes from '../server/routes/careersRoutes.js';
import queriesRoutes from '../server/routes/queriesRoutes.js';
import categoryRoutes from '../server/routes/categoryRoutes.js';
import orderRoutes from '../server/routes/orderRoutes.js';
import { initializeDatabase } from '../server/config/db.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true })); // Vercel handles CORS gracefully this way, or we can configure it specifically
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Initialize database on startup
let dbInitialized = false;
let dbInitPromise = null;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    if (!dbInitPromise) {
      dbInitPromise = initializeDatabase()
        .then(() => { dbInitialized = true; })
        .catch(err => {
          console.error('Database initialization failed:', err);
          dbInitPromise = null; // allow retry on next request
        });
    }
    try {
      await dbInitPromise;
    } catch (err) {
      // DB init failed — still allow request through but log it
      console.error('DB init error on request:', err);
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/queries', queriesRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running successfully.' });
});

// Global error handler — catches unhandled errors from all routes
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message || 'Something went wrong' });
});

export default app;
