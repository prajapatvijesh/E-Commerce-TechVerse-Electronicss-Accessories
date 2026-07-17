import { Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private/Customer
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user?._id }).populate('products', 'name price thumbnail vendor stock');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user?._id, products: [] });
    }

    res.json({ status: 'success', data: wishlist });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private/Customer
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user?._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user?._id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    res.json({ status: 'success', data: wishlist });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private/Customer
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user?._id });

    if (wishlist) {
      (wishlist.products as any).pull(req.params.productId);
      await wishlist.save();
      res.json({ status: 'success', data: wishlist });
    } else {
      res.status(404).json({ status: 'error', message: 'Wishlist not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
