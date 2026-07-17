import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  getSettings,
  updateSettings,
  getCMSPages,
  getCMSPageBySlug,
  saveCMSPage
} from '../controllers/settingsController';

const router = express.Router();

// Public routes
router.route('/').get(getSettings);
router.route('/cms').get(getCMSPages);
router.route('/cms/:slug').get(getCMSPageBySlug);

// Admin only routes
router.route('/')
  .put(protect, authorize('admin', 'superadmin'), updateSettings);

router.route('/cms')
  .post(protect, authorize('admin', 'superadmin'), saveCMSPage);

export default router;
