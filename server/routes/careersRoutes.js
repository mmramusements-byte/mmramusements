import express from 'express';
import multer from 'multer';
import { submitApplication, getApplications, updateApplicationStatus, deleteApplication, getJobs, addJob, updateJob, deleteJob } from '../controllers/careersController.js';
import { protectAdminRoute, protectAdminRoute as authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Career Applications Routes
router.post('/', upload.single('resume'), submitApplication);
router.get('/applications', protectAdminRoute, getApplications);
router.put('/applications/:id/status', protectAdminRoute, updateApplicationStatus);
router.delete('/applications/:id', protectAdminRoute, deleteApplication);

// Career Jobs Routes
router.get('/jobs', getJobs);
router.post('/jobs', authMiddleware, addJob);
router.put('/jobs/:id', authMiddleware, updateJob);
router.delete('/jobs/:id', authMiddleware, deleteJob);

export default router;
