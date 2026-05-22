import express from 'express';
import { submitQuery, getQueries, updateQueryStatus, deleteQuery } from '../controllers/queriesController.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', submitQuery);
router.get('/', protectAdminRoute, getQueries);
router.patch('/:id/status', protectAdminRoute, updateQueryStatus);
router.delete('/:id', protectAdminRoute, deleteQuery);

export default router;
