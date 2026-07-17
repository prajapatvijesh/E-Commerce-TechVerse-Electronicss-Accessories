import express from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getBrands)
  .post(protect, authorize('admin', 'superadmin'), createBrand);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateBrand)
  .delete(protect, authorize('admin', 'superadmin'), deleteBrand);

export default router;
