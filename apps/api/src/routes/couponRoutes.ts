import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  createCoupon,
  getCoupons,
  validateCoupon
} from '../controllers/couponController';

const router = express.Router();

router.route('/')
  .post(protect, authorize('vendor', 'admin', 'superadmin'), createCoupon)
  .get(protect, authorize('vendor', 'admin', 'superadmin'), getCoupons);

router.route('/validate')
  .post(protect, validateCoupon);

export default router;
