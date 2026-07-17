import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  requestPayout,
  getPayouts,
  updatePayoutStatus,
  getVendorBalance
} from '../controllers/payoutController';

const router = express.Router();

router.route('/')
  .post(protect, authorize('vendor'), requestPayout)
  .get(protect, authorize('admin', 'superadmin', 'vendor'), getPayouts);

router.route('/balance')
  .get(protect, authorize('vendor'), getVendorBalance);

router.route('/:id/status')
  .put(protect, authorize('admin', 'superadmin'), updatePayoutStatus);

export default router;
