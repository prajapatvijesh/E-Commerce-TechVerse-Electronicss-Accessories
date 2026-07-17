import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Vendor } from '../models/Vendor';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/authMiddleware';
import { ActivityLog } from '../models/ActivityLog';

// @desc    Fetch all products (with filtering, sorting, pagination)
// @route   GET /api/products
// @access  Public or Private/Vendor
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword as string,
            $options: 'i',
          },
        }
      : {};

    let categoryFilter = {};
    if (req.query.category) {
      const slugs = (req.query.category as string).split(',');
      const categories = await Category.find({ slug: { $in: slugs } });
      const categoryIds = categories.map(c => c._id);
      if (categoryIds.length > 0) {
        categoryFilter = { category: { $in: categoryIds } };
      }
    }

    const brandFilter = req.query.brand ? { brand: req.query.brand } : {};
    
    let vendorFilter = {};
    // If the requester is a vendor, only show their products
    if (req.user && req.user.role === 'vendor') {
      const vendorDoc = await Vendor.findOne({ user: req.user._id });
      if (vendorDoc) {
        vendorFilter = { vendor: vendorDoc._id };
      }
    }

    const count = await Product.countDocuments({ ...keyword, ...categoryFilter, ...brandFilter, ...vendorFilter, status: 'published' });
    const products = await Product.find({ ...keyword, ...categoryFilter, ...brandFilter, ...vendorFilter, status: 'published' })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'published' })
      .populate('vendor', 'storeName logo rating')
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (product) {
      res.json({ status: 'success', data: product });
    } else {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const vendorDoc = await Vendor.findOne({ user: req.user?._id });
    if (!vendorDoc) {
      return res.status(400).json({ status: 'error', message: 'Vendor profile not found. Please complete store profile first.' });
    }

    // Auto-generate a slug if not provided
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    // For MVP purposes, if brand/category IDs aren't provided by the frontend, we use dummy ObjectId so it doesn't crash
    const product = new Product({
      ...req.body,
      slug,
      vendor: vendorDoc._id,
      brand: req.body.brand || '60d5ec49f1b2c8b1f8e4b3a1', // fallback
      category: req.body.category || '60d5ec49f1b2c8b1f8e4b3a2', // fallback
      thumbnail: req.body.thumbnail || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // default placeholder
    });

    const createdProduct = await product.save();
    
    await ActivityLog.create({
      user: req.user?._id,
      action: 'CREATE_PRODUCT',
      resource: `Product: ${createdProduct.name}`,
      ipAddress: req.ip
    });

    res.status(201).json({ status: 'success', data: createdProduct });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'storeName logo rating')
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (product) {
      res.json({ status: 'success', data: product });
    } else {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    if (req.user?.role === 'vendor') {
      const vendorDoc = await Vendor.findOne({ user: req.user._id });
      if (!vendorDoc || product.vendor.toString() !== vendorDoc._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to update this product' });
      }
    }

    Object.assign(product, req.body);
    if (req.body.name) {
      product.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    }

    const updatedProduct = await product.save();

    await ActivityLog.create({
      user: req.user?._id,
      action: 'UPDATE_PRODUCT',
      resource: `Product: ${updatedProduct.name}`,
      ipAddress: req.ip
    });

    res.json({ status: 'success', data: updatedProduct });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    if (req.user?.role === 'vendor') {
      const vendorDoc = await Vendor.findOne({ user: req.user._id });
      if (!vendorDoc || product.vendor.toString() !== vendorDoc._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to delete this product' });
      }
    }

    const productName = product.name;
    await Product.deleteOne({ _id: product._id });
    
    await ActivityLog.create({
      user: req.user?._id,
      action: 'DELETE_PRODUCT',
      resource: `Product: ${productName}`,
      ipAddress: req.ip
    });

    res.json({ status: 'success', message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
