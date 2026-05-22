import express from 'express';
import multer from 'multer';
import { submitApplication, getApplications, updateApplicationStatus, deleteApplication } from '../controllers/careersController.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('resume'), submitApplication);
router.get('/', protectAdminRoute, getApplications);
router.patch('/:id/status', protectAdminRoute, updateApplicationStatus);
router.delete('/:id', protectAdminRoute, deleteApplication);

export default router;
