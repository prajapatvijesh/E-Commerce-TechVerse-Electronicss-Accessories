import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from '../controllers/cartController';

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .delete(protect, clearCart);

router.route('/add')
  .post(protect, addToCart);

router.route('/:productId')
  .delete(protect, removeFromCart);

export default router;
