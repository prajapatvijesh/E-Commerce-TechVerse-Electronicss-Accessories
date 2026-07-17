import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { subscribeNewsletter, getSubscribers } from '../controllers/newsletterController';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/', protect, authorize('admin', 'superadmin'), getSubscribers);

export default router;
