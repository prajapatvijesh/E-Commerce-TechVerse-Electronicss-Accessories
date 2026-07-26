import express from 'express';
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/')
  .get(getBanners)
  .post(protect, authorize('admin', 'superadmin'), createBanner);

router
  .route('/:id')
  .get(protect, authorize('admin', 'superadmin'), getBannerById)
  .put(protect, authorize('admin', 'superadmin'), updateBanner)
  .delete(protect, authorize('admin', 'superadmin'), deleteBanner);

export default router;
