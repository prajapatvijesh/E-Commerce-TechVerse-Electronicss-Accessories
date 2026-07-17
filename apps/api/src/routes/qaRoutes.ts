import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { askQuestion, getProductQuestions, answerQuestion } from '../controllers/qaController';

const router = express.Router();

router.route('/')
  .post(protect, askQuestion);

router.route('/:productId')
  .get(getProductQuestions);

router.route('/:id/answer')
  .put(protect, authorize('vendor', 'admin', 'superadmin'), answerQuestion);

export default router;
