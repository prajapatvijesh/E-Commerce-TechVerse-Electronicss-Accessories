import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { HomepageSettings } from '../models/HomepageSettings';

// @desc    Get homepage settings
// @route   GET /api/homepage-settings
// @access  Public
export const getHomepageSettings = async (req: AuthRequest, res: Response) => {
  try {
    let settings = await HomepageSettings.findOne().populate('featuredCategories', 'name slug image');
    
    if (!settings) {
      settings = await HomepageSettings.create({
        heroBanners: [
          {
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
            title: 'Welcome to TechVerse',
            subtitle: 'The best marketplace',
            link: '/shop'
          }
        ],
        faqs: [],
        footerText: '© 2026 TechVerse Marketplace'
      });
    }

    res.json({ status: 'success', data: settings });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update homepage settings
// @route   PUT /api/homepage-settings
// @access  Private/Admin
export const updateHomepageSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { heroBanners, featuredCategories, faqs, footerText } = req.body;

    let settings = await HomepageSettings.findOne();

    if (!settings) {
      settings = new HomepageSettings();
    }

    if (heroBanners) settings.heroBanners = heroBanners;
    if (featuredCategories) settings.featuredCategories = featuredCategories;
    if (faqs) settings.faqs = faqs;
    if (footerText) settings.footerText = footerText;
    
    settings.updatedBy = req.user?._id;

    const updatedSettings = await settings.save();

    res.json({ status: 'success', data: updatedSettings });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
