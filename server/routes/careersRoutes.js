import express from 'express';
import multer from 'multer';
import { submitApplication, getApplications, updateApplicationStatus, deleteApplication, getJobs, addJob, updateJob, deleteJob } from '../controllers/careersController.js';
import { protectAdminRoute, protectAdminRoute as authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('resume'), submitApplication);
router.get('/', protectAdminRoute, getApplications);
router.patch('/:id/status', protectAdminRoute, updateApplicationStatus);
router.delete('/:id', protectAdminRoute, deleteApplication);

// Career Jobs Routes
router.get('/careers/jobs', getJobs);
router.post('/careers/jobs', authMiddleware, addJob);
router.put('/careers/jobs/:id', authMiddleware, updateJob);
router.delete('/careers/jobs/:id', authMiddleware, deleteJob);

export default router;
