import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadImage } from '../controllers/uploadController';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/', protect, authorize('admin', 'superadmin', 'vendor'), upload.single('image'), uploadImage);

export default router;
