import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  createEnquiry,
  getMyEnquiries,
  getEnquiries,
  replyEnquiry,
  updateEnquiryStatus
} from '../controllers/enquiryController';

const router = express.Router();

router.route('/')
  .post(protect, createEnquiry)
  .get(protect, authorize('admin', 'superadmin', 'vendor'), getEnquiries);

router.route('/my-enquiries').get(protect, getMyEnquiries);

router.route('/:id/reply').put(protect, authorize('admin', 'superadmin', 'vendor'), replyEnquiry);
router.route('/:id/status').put(protect, updateEnquiryStatus);

export default router;
