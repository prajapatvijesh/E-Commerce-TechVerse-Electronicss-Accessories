import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createReview,
  getProductReviews,
  getAdminReviews,
  deleteReview
} from '../controllers/reviewController';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/admin')
  .get(protect, getAdminReviews);

router.route('/:productId')
  .get(getProductReviews);

router.route('/:id')
  .delete(protect, deleteReview);

export default router;
