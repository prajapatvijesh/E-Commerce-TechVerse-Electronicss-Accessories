import { Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Customer
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { product, rating, comment } = req.body;

    const alreadyReviewed = await Review.findOne({ user: req.user?._id, product });
    if (alreadyReviewed) {
      return res.status(400).json({ status: 'error', message: 'Product already reviewed' });
    }

    const productObj = await Product.findById(product);
    if (!productObj) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    const review = await Review.create({
      user: req.user?._id,
      product,
      vendor: productObj.vendor,
      rating: Number(rating),
      comment
    });

    // Update product rating
    const reviews = await Review.find({ product });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await Product.findByIdAndUpdate(product, {
      rating: avgRating,
      numReviews
    });

    res.status(201).json({ status: 'success', data: review });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json({ status: 'success', data: reviews });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all reviews (Admin) or vendor reviews
// @route   GET /api/reviews/admin
// @access  Private/Admin/Vendor
export const getAdminReviews = async (req: AuthRequest, res: Response) => {
  try {
    const filter = req.user?.role === 'vendor' ? { vendor: req.user._id } : {};
    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name thumbnail');
    res.json({ status: 'success', data: reviews });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin/Vendor
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }

    if (req.user?.role === 'vendor' && review.vendor.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating = numReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews
    });

    res.json({ status: 'success', message: 'Review removed' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
