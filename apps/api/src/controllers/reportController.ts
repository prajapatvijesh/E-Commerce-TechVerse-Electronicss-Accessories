import { Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import { ActivityLog } from '../models/ActivityLog';
import PDFDocument from 'pdfkit';

// @desc    Get Sales Report
// @route   GET /api/reports/sales
// @access  Private/Admin
export const getSalesReport = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ isPaid: true }).sort({ createdAt: -1 });
    // In a real app, you would aggregate by day, week, month, etc.
    res.json({ status: 'success', data: orders });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get Activity Logs
// @route   GET /api/reports/activity
// @access  Private/Admin
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await ActivityLog.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json({ status: 'success', data: logs });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Download Sales Report as PDF
// @route   GET /api/reports/sales/pdf
// @access  Private/Admin
export const downloadSalesReportPDF = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ isPaid: true })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('TechVerse Sales Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();
    doc.moveDown();

    // Summary
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    doc.fontSize(14).text('Summary');
    doc.fontSize(12).text(`Total Orders: ${orders.length}`);
    doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`);
    doc.moveDown();
    doc.moveDown();

    // Table Header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Order ID', 50, doc.y, { continued: true, width: 100 });
    doc.text('Date', 150, doc.y, { continued: true, width: 150 });
    doc.text('Customer', 300, doc.y, { continued: true, width: 150 });
    doc.text('Amount', 450, doc.y);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Rows
    doc.font('Helvetica');
    orders.forEach(order => {
      const orderId = order._id?.toString().substring(0, 8) || 'N/A';
      const date = new Date(order.createdAt).toLocaleDateString();
      const customer = (order.user as any)?.name || 'Guest';
      const amount = `₹${order.totalPrice.toFixed(2)}`;

      doc.text(orderId, 50, doc.y, { continued: true, width: 100 });
      doc.text(date, 150, doc.y, { continued: true, width: 150 });
      doc.text(customer, 300, doc.y, { continued: true, width: 150 });
      doc.text(amount, 450, doc.y);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
