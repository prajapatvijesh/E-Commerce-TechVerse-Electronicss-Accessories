import express from 'express';
import { getVendorProfile, updateVendorProfile, getVendors, updateVendorStatus } from '../controllers/vendorController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, authorize('vendor'), getVendorProfile);
router.put('/profile', protect, authorize('vendor'), updateVendorProfile);

router.get('/', protect, authorize('admin', 'superadmin'), getVendors);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateVendorStatus);

export default router;
