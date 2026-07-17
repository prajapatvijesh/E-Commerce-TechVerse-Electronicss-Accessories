import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getActivityLogs } from '../controllers/activityLogController';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'superadmin'), getActivityLogs);

export default router;
