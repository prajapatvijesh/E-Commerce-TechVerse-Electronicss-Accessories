import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, authorize('admin', 'superadmin'), getUsers);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateUser);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteUser);

export default router;
