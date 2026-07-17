import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ActivityLog } from '../models/ActivityLog';

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private/Admin
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json({ status: 'success', data: logs });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
