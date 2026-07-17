import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getConversations,
  getMessages,
  createConversation,
  sendMessage
} from '../controllers/chatController';

const router = express.Router();

router.use(protect);

router.route('/conversations')
  .get(getConversations)
  .post(createConversation);

router.route('/conversations/:id/messages')
  .get(getMessages);

router.route('/messages')
  .post(sendMessage);

export default router;
