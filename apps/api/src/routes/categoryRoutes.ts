import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin', 'superadmin'), createCategory);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateCategory)
  .delete(protect, authorize('admin', 'superadmin'), deleteCategory);

export default router;
