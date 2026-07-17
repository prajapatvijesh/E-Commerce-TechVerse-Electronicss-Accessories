import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController';

const router = express.Router();

router.route('/')
  .get(protect, getWishlist);

router.route('/add')
  .post(protect, addToWishlist);

router.route('/:productId')
  .delete(protect, removeFromWishlist);

export default router;
