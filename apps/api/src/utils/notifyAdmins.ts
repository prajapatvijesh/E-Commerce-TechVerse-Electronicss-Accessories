import { User } from '../models/User';
import { Notification } from '../models/Notification';

export const notifyAdmins = async (
  title: string,
  message: string,
  type: 'order' | 'system' | 'vendor' = 'system',
  link?: string
) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title,
      message,
      type,
      link,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Failed to notify admins:', error);
  }
};
