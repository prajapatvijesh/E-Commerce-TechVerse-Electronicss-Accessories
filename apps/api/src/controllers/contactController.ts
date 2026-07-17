import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      message,
    });

    await contactMessage.save();
    res.status(201).json({ status: 'success', message: 'Message sent successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
