import express from 'express';
import { getHomepageSettings, updateHomepageSettings } from '../controllers/settingsController.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route for storefront to fetch settings
router.get('/homepage', getHomepageSettings);

// Protected route for admin to update settings
router.put('/homepage', protectAdminRoute, updateHomepageSettings);

export default router;
