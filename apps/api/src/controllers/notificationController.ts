import { Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: notifications });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { isRead: true },
      { new: true }
    );

    if (notification) {
      res.json({ status: 'success', data: notification });
    } else {
      res.status(404).json({ status: 'error', message: 'Notification not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { user: req.user?._id, isRead: false },
      { isRead: true }
    );
    res.json({ status: 'success', message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
