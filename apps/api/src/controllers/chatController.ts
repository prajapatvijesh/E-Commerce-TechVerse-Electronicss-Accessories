import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { User } from '../models/User';

// @desc    Get all conversations for user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const conversations = await Conversation.find({ participants: { $in: [userId] } })
      .populate('participants', 'name email avatar role')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json({ status: 'success', data: conversations });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversationId: id })
      .populate('sender', 'name email avatar role')
      .sort({ createdAt: 1 });

    res.json({ status: 'success', data: messages });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Start or get conversation with a user
// @route   POST /api/chat/conversations
// @access  Private
export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user?._id;

    if (!receiverId) {
      return res.status(400).json({ status: 'error', message: 'Receiver ID is required' });
    }

    let finalReceiverId = receiverId;
    if (receiverId === 'admin') {
      const adminUser = await User.findOne({ role: { $in: ['admin', 'superadmin'] } });
      if (!adminUser) {
        return res.status(404).json({ status: 'error', message: 'Admin not found' });
      }
      finalReceiverId = adminUser._id;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, finalReceiverId] }
    }).populate('participants', 'name email avatar role');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, finalReceiverId]
      });
      conversation = await conversation.populate('participants', 'name email avatar role');
    }

    res.status(201).json({ status: 'success', data: conversation });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user?._id;

    if (!conversationId || !text) {
      return res.status(400).json({ status: 'error', message: 'Conversation ID and text are required' });
    }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      text
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now()
    });

    const populatedMessage = await message.populate('sender', 'name email avatar role');

    res.status(201).json({ status: 'success', data: populatedMessage });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
