import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Enquiry } from '../models/Enquiry';

// @desc    Create an enquiry
// @route   POST /api/enquiries
// @access  Private/Customer
export const createEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { product, vendor, quantity, message } = req.body;

    const enquiry = new Enquiry({
      user: req.user?._id,
      product,
      vendor,
      quantity,
      message
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json({ status: 'success', data: createdEnquiry });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get user's enquiries
// @route   GET /api/enquiries/my-enquiries
// @access  Private/Customer
export const getMyEnquiries = async (req: AuthRequest, res: Response) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user?._id })
      .populate('product', 'name images')
      .populate('vendor', 'name');
    res.json({ status: 'success', data: enquiries });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all enquiries for vendor/admin
// @route   GET /api/enquiries
// @access  Private/Vendor/Admin
export const getEnquiries = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user?.role === 'vendor' ? { vendor: req.user._id } : {};
    const enquiries = await Enquiry.find(query)
      .populate('product', 'name images')
      .populate('user', 'name email')
      .populate('vendor', 'name');
    res.json({ status: 'success', data: enquiries });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Reply to an enquiry
// @route   PUT /api/enquiries/:id/reply
// @access  Private/Vendor/Admin
export const replyEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { quotedPrice, reply, adminNote } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      if (req.user?.role === 'vendor' && enquiry.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized' });
      }

      enquiry.quotedPrice = quotedPrice !== undefined ? quotedPrice : enquiry.quotedPrice;
      enquiry.reply = reply !== undefined ? reply : enquiry.reply;
      if (adminNote !== undefined) enquiry.adminNote = adminNote;
      enquiry.status = 'replied';

      const updatedEnquiry = await enquiry.save();
      res.json({ status: 'success', data: updatedEnquiry });
    } else {
      res.status(404).json({ status: 'error', message: 'Enquiry not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
// @access  Private/Customer/Vendor/Admin
export const updateEnquiryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = status;
      const updatedEnquiry = await enquiry.save();
      res.json({ status: 'success', data: updatedEnquiry });
    } else {
      res.status(404).json({ status: 'error', message: 'Enquiry not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
