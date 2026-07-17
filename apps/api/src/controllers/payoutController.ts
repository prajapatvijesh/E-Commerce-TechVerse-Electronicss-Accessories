import { Response } from 'express';
import { Payout } from '../models/Payout';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import { ActivityLog } from '../models/ActivityLog';
import { Notification } from '../models/Notification';

// @desc    Request a payout
// @route   POST /api/payouts
// @access  Private/Vendor
export const requestPayout = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, paymentMethod, accountDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid payout amount' });
    }

    const payout = await Payout.create({
      vendor: req.user?._id,
      amount,
      paymentMethod,
      accountDetails,
      status: 'pending'
    });

    await ActivityLog.create({
      user: req.user?._id,
      action: 'PAYOUT_REQUESTED',
      resource: `Payout Request: ₹${amount}`,
      ipAddress: req.ip
    });

    res.status(201).json({ status: 'success', data: payout });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get payouts
// @route   GET /api/payouts
// @access  Private/Vendor or Admin
export const getPayouts = async (req: AuthRequest, res: Response) => {
  try {
    let query = {};
    if (req.user?.role === 'vendor') {
      query = { vendor: req.user._id };
    }

    const payouts = await Payout.find(query)
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ status: 'success', data: payouts });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update payout status
// @route   PUT /api/payouts/:id/status
// @access  Private/Admin
export const updatePayoutStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const payout = await Payout.findById(req.params.id);

    if (payout) {
      payout.status = status || payout.status;
      if (notes) payout.notes = notes;
      
      const updatedPayout = await payout.save();

      await ActivityLog.create({
        user: req.user?._id,
        action: 'PAYOUT_STATUS_UPDATED',
        resource: `Payout ID: ${payout._id} set to ${status}`,
        ipAddress: req.ip
      });

      // Send notification to the vendor
      await Notification.create({
        user: payout.vendor,
        title: `Payout ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your payout request for ₹${payout.amount} has been marked as ${status}.`,
        link: '/payouts'
      });

      res.json({ status: 'success', data: updatedPayout });
    } else {
      res.status(404).json({ status: 'error', message: 'Payout not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get vendor balance details
// @route   GET /api/payouts/balance
// @access  Private/Vendor
export const getVendorBalance = async (req: AuthRequest, res: Response) => {
  try {
    const vendorId = req.user?._id;

    // Calculate total sales from paid orders
    const salesResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.vendor': vendorId } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
        }
      }
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
    
    // Assume 10% platform commission
    const platformCommission = totalSales * 0.10;
    const netEarnings = totalSales - platformCommission;

    // Calculate already requested/paid payouts
    const payoutsResult = await Payout.aggregate([
      { $match: { vendor: vendorId, status: { $in: ['pending', 'approved', 'paid'] } } },
      {
        $group: {
          _id: null,
          totalPayouts: { $sum: '$amount' }
        }
      }
    ]);

    const totalPayouts = payoutsResult.length > 0 ? payoutsResult[0].totalPayouts : 0;

    const availableBalance = netEarnings - totalPayouts;

    res.json({
      status: 'success',
      data: {
        totalSales,
        platformCommission,
        netEarnings,
        totalPayouts,
        availableBalance: Math.max(availableBalance, 0)
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
