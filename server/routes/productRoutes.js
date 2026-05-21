import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public route for storefront to fetch products
router.get('/', getProducts);

// Protected routes for admin to manage products
router.post('/', protectAdminRoute, upload.single('image'), createProduct);
router.put('/:id', protectAdminRoute, upload.single('image'), updateProduct);
router.delete('/:id', protectAdminRoute, deleteProduct);

export default router;
