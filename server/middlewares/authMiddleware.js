import { verifyToken } from '../utils/jwt.js';
import { pool } from '../config/db.js';

export const protectAdminRoute = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Not authorized, invalid or expired token' });
    }

    // Verify admin still exists
    const adminResult = await pool.query('SELECT id, email FROM admins WHERE id = $1', [decoded.id]);
    if (adminResult.rows.length === 0) {
      return res.status(401).json({ error: 'Not authorized, admin not found' });
    }

    req.admin = adminResult.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error in auth middleware' });
  }
};
