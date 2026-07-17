import { Request, Response } from 'express';
import { Settings } from '../models/Settings';
import { CMS } from '../models/CMS';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    res.json({ status: 'success', data: settings });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings.siteName = req.body.siteName || settings.siteName;
      settings.siteLogo = req.body.siteLogo || settings.siteLogo;
      settings.contactEmail = req.body.contactEmail || settings.contactEmail;
      settings.contactPhone = req.body.contactPhone || settings.contactPhone;
      settings.socialLinks = req.body.socialLinks || settings.socialLinks;
      settings.currency = req.body.currency || settings.currency;
      settings.taxRate = req.body.taxRate !== undefined ? req.body.taxRate : settings.taxRate;
      settings.flatShippingRate = req.body.flatShippingRate !== undefined ? req.body.flatShippingRate : settings.flatShippingRate;
      settings.favicon = req.body.favicon !== undefined ? req.body.favicon : settings.favicon;
      settings.maintenanceMode = req.body.maintenanceMode !== undefined ? req.body.maintenanceMode : settings.maintenanceMode;
      settings.adminCommission = req.body.adminCommission !== undefined ? req.body.adminCommission : settings.adminCommission;
    }

    const updatedSettings = await settings.save();
    res.json({ status: 'success', data: updatedSettings });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all CMS pages
// @route   GET /api/settings/cms
// @access  Public
export const getCMSPages = async (req: Request, res: Response) => {
  try {
    const pages = await CMS.find({ isActive: true });
    res.json({ status: 'success', data: pages });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get CMS page by slug
// @route   GET /api/settings/cms/:slug
// @access  Public
export const getCMSPageBySlug = async (req: Request, res: Response) => {
  try {
    const page = await CMS.findOne({ slug: req.params.slug, isActive: true });
    if (page) {
      res.json({ status: 'success', data: page });
    } else {
      res.status(404).json({ status: 'error', message: 'Page not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Create/Update CMS page
// @route   POST /api/settings/cms
// @access  Private/Admin
export const saveCMSPage = async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, isActive } = req.body;

    let page = await CMS.findOne({ slug });
    
    if (page) {
      page.title = title;
      page.content = content;
      page.metaTitle = metaTitle;
      page.metaDescription = metaDescription;
      page.isActive = isActive;
      page.updatedBy = req.user?._id;
    } else {
      page = new CMS({
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        isActive,
        createdBy: req.user?._id,
      });
    }

    const savedPage = await page.save();
    res.json({ status: 'success', data: savedPage });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
