import { Request, Response } from 'express';
import { Newsletter } from '../models/Newsletter';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email is required' });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return res.json({ status: 'success', message: 'Subscribed successfully' });
    }

    const sub = new Newsletter({ email });
    await sub.save();

    res.status(201).json({ status: 'success', message: 'Subscribed successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req: Request, res: Response) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ status: 'success', data: subs });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
