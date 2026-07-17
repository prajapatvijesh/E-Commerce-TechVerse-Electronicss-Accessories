import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getAnalytics } from '../controllers/analyticsController';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'superadmin', 'vendor'), getAnalytics);

export default router;
