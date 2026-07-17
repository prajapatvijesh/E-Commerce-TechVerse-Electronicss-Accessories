import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Enquiry } from '../models/Enquiry';
import { Vendor } from '../models/Vendor';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin/Vendor
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const isVendor = req.user?.role === 'vendor';
    
    const totalOrders = await Order.countDocuments(isVendor ? { 'orderItems.vendor': req.user?._id } : {});
    const totalProducts = await Product.countDocuments(isVendor ? { vendor: req.user?._id } : {});
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await Vendor.countDocuments();
    
    const pendingEnquiries = await Enquiry.countDocuments(isVendor ? { vendor: req.user?._id, status: 'new' } : { status: 'new' });
    const lowStock = await Product.countDocuments(isVendor ? { vendor: req.user?._id, countInStock: { $lt: 10 } } : { countInStock: { $lt: 10 } });

    const orders = isVendor ? await Order.find({ 'orderItems.vendor': req.user?._id }) : await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Sales over the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentOrders = isVendor 
      ? await Order.find({ 'orderItems.vendor': req.user?._id, createdAt: { $gte: sixMonthsAgo } }) 
      : await Order.find({ createdAt: { $gte: sixMonthsAgo } });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize sales data array for the last 6 months
    const salesDataMap = new Map();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      salesDataMap.set(months[d.getMonth()], 0);
    }

    recentOrders.forEach(order => {
      const monthStr = months[order.createdAt.getMonth()];
      if (salesDataMap.has(monthStr)) {
        salesDataMap.set(monthStr, salesDataMap.get(monthStr) + order.totalPrice);
      }
    });

    const salesData = Array.from(salesDataMap, ([name, revenue]) => ({ name, revenue }));

    res.json({
      status: 'success',
      data: {
        totalOrders,
        totalProducts,
        totalUsers: isVendor ? 0 : totalUsers,
        totalVendors: isVendor ? 0 : totalVendors,
        totalRevenue,
        pendingEnquiries,
        lowStock,
        salesData
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
