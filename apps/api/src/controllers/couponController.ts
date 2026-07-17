import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Vendor/Admin
export const createCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, discountType, discountValue, minPurchase, expiryDate, usageLimit, vendor } = req.body;
    
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ status: 'error', message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      expiryDate,
      usageLimit,
      vendor: req.user?.role === 'vendor' ? req.user._id : vendor,
      isActive: true
    });

    res.status(201).json({ status: 'success', data: coupon });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Vendor/Admin
export const getCoupons = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user?.role === 'vendor' ? { vendor: req.user._id } : {};
    const coupons = await Coupon.find(query);
    res.json({ status: 'success', data: coupons });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Private/Customer
export const validateCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, purchaseAmount } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Invalid or expired coupon' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ status: 'error', message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ status: 'error', message: 'Coupon usage limit reached' });
    }

    if (purchaseAmount < coupon.minPurchase) {
      return res.status(400).json({ status: 'error', message: `Minimum purchase amount is ${coupon.minPurchase}` });
    }

    res.json({ status: 'success', data: coupon });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
