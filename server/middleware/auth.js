import { protectAdminRoute } from '../middlewares/authMiddleware.js';

// Alias protectAdminRoute as authenticate for standardizing naming
export const authenticate = protectAdminRoute;
