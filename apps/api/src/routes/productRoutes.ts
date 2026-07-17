import express from 'express';
import { getProducts, getProductBySlug, createProduct, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, authorize } from '../middleware/authMiddleware';
import { logActivity } from '../middleware/logMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin', 'superadmin'), logActivity('PRODUCT'), createProduct);

router.route('/:id([0-9a-fA-F]{24})')
  .get(getProductById)
  .put(protect, authorize('vendor', 'admin', 'superadmin'), logActivity('PRODUCT'), updateProduct)
  .delete(protect, authorize('vendor', 'admin', 'superadmin'), logActivity('PRODUCT'), deleteProduct);

router.route('/:slug').get(getProductBySlug);

export default router;
