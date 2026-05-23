import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public route for customers to place orders
router.post('/', createOrder);

// Protected routes for admin management
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, updateOrderStatus);
router.delete('/:id', authenticate, deleteOrder);

export default router;
