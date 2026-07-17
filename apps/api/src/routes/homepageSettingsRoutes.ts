import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  getHomepageSettings,
  updateHomepageSettings
} from '../controllers/homepageSettingsController';

const router = express.Router();

router.route('/')
  .get(getHomepageSettings)
  .put(protect, authorize('admin', 'superadmin'), updateHomepageSettings);

export default router;
