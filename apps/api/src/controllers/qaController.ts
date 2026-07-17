import { Response } from 'express';
import { QA } from '../models/QA';
import { AuthRequest } from '../middleware/authMiddleware';

export const askQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { product, question } = req.body;
    const qa = await QA.create({
      product,
      user: req.user?._id,
      question
    });
    res.status(201).json({ status: 'success', data: qa });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProductQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const questions = await QA.find({ product: req.params.productId }).populate('user', 'name');
    res.json({ status: 'success', data: questions });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const answerQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { answer } = req.body;
    const qa = await QA.findByIdAndUpdate(
      req.params.id,
      { answer, answeredBy: req.user?._id, status: 'answered' },
      { new: true }
    );
    res.json({ status: 'success', data: qa });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
