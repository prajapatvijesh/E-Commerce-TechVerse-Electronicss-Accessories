import { Request, Response } from 'express';
import { Vendor } from '../models/Vendor';
import { AuthRequest } from '../middleware/authMiddleware';

export const getVendorProfile = async (req: AuthRequest, res: Response) => {
  try {
    let vendor = await Vendor.findOne({ user: req.user?._id });
    if (!vendor) {
      try {
        // Auto-create an empty vendor profile for onboarding if they are role=vendor but have no profile
        vendor = await Vendor.create({
          user: req.user?._id,
          storeName: `${req.user?.name || 'My'}'s Store ${Date.now()}`,
          storeDescription: 'Welcome to my store!',
          businessAddress: { street: ' ', city: ' ', state: ' ', country: ' ', zipCode: ' ' },
          contactEmail: req.user?.email || 'vendor@example.com',
          contactPhone: ' '
        });
      } catch (createError: any) {
        return res.status(500).json({ status: 'error', message: `Vendor Creation Error: ${createError.message}` });
      }
    }
    res.json({ status: 'success', data: vendor });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: `Vendor Find Error: ${error.message}` });
  }
};

export const updateVendorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user?._id });
    if (vendor) {
      vendor.storeName = req.body.storeName || vendor.storeName;
      vendor.storeDescription = req.body.storeDescription || vendor.storeDescription;
      vendor.logo = req.body.logo || vendor.logo;
      vendor.banner = req.body.banner || vendor.banner;
      if (req.body.gstNumber !== undefined) {
        vendor.gstNumber = req.body.gstNumber;
      }
      
      // Update business address if provided
      if (req.body.businessDetails) {
         // for simplicity in this task, mapping a single businessDetails text field to street
         vendor.businessAddress.street = req.body.businessDetails;
      }

      const updatedVendor = await vendor.save();
      res.json({ status: 'success', data: updatedVendor });
    } else {
      res.status(404).json({ status: 'error', message: 'Vendor not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getVendors = async (req: AuthRequest, res: Response) => {
  try {
    const vendors = await Vendor.find().populate('user', 'name email role');
    res.json({ status: 'success', data: vendors });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateVendorStatus = async (req: AuthRequest, res: Response) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ status: 'error', message: 'Vendor not found' });
    }
    vendor.status = req.body.status || vendor.status;
    const updatedVendor = await vendor.save();
    res.json({ status: 'success', data: updatedVendor });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
