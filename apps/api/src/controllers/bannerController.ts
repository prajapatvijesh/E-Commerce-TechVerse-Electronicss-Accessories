import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Banner } from '../models/Banner';

// @desc    Get all banners (Admin or Active only for Web)
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = isAdmin ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single banner
// @route   GET /api/banners/:id
// @access  Private/Admin
export const getBannerById = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      res.json(banner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = new Banner(req.body);
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(400).json({ message: 'Invalid banner data' });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = req.body.title || banner.title;
      banner.image = req.body.image || banner.image;
      banner.link = req.body.link || banner.link;
      banner.position = req.body.position || banner.position;
      banner.isActive =
        req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
      banner.order =
        req.body.order !== undefined ? req.body.order : banner.order;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid banner data' });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (banner) {
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
