import { Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import PDFDocument from 'pdfkit';

// @desc    Download order invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
export const downloadInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    // Ensure user requesting is the order owner or an admin/vendor
    if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role === 'customer') {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=TechVerse-Invoice-${order._id}.pdf`);
    
    doc.pipe(res);

    // Colors
    const primaryColor = '#4F46E5'; // Indigo 600
    const textColor = '#1F2937'; // Gray 800
    const lightText = '#6B7280'; // Gray 500
    const lineColor = '#E5E7EB'; // Gray 200

    // Header Background
    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);

    // Company Logo / Title
    doc.fillColor('#FFFFFF')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('TECHVERSE', 50, 45);
       
    doc.fontSize(10)
       .font('Helvetica')
       .text('The Premium Tech Marketplace', 50, 75);

    // Invoice Label
    doc.fontSize(30)
       .text('INVOICE', doc.page.width - 200, 45, { align: 'right' });

    doc.moveDown();

    // Reset Color
    doc.fillColor(textColor);

    // Invoice Details
    doc.fontSize(10).font('Helvetica-Bold').text('Invoice To:', 50, 150);
    doc.font('Helvetica').fillColor(lightText);
    doc.text(`Name: ${(order.user as any).name}`, 50, 165);
    doc.text(`Email: ${(order.user as any).email}`, 50, 180);
    doc.text(`Phone: ${order.shippingAddress?.phone || 'N/A'}`, 50, 195);

    doc.fillColor(textColor).font('Helvetica-Bold').text('Invoice Details:', doc.page.width - 250, 150, { align: 'right' });
    doc.font('Helvetica').fillColor(lightText);
    doc.text(`Order ID: ${order._id}`, doc.page.width - 250, 165, { align: 'right' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, doc.page.width - 250, 180, { align: 'right' });
    doc.text(`Status: ${order.status.toUpperCase()}`, doc.page.width - 250, 195, { align: 'right' });

    // Shipping Address
    doc.fillColor(textColor).font('Helvetica-Bold').text('Shipping Address:', 50, 230);
    doc.font('Helvetica').fillColor(lightText);
    const addr = order.shippingAddress;
    if (addr) {
      doc.text(`${addr.fullName}`, 50, 245);
      doc.text(`${addr.street}, ${addr.city}`, 50, 260);
      doc.text(`${addr.state} ${addr.zipCode}, ${addr.country}`, 50, 275);
    } else {
      doc.text(`N/A`, 50, 245);
    }

    doc.moveDown(3);

    // Table Header
    const tableTop = 330;
    doc.rect(50, tableTop, doc.page.width - 100, 30).fill(primaryColor);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10);
    doc.text('Item Description', 60, tableTop + 10);
    doc.text('Price', 350, tableTop + 10, { width: 60, align: 'right' });
    doc.text('Qty', 420, tableTop + 10, { width: 40, align: 'right' });
    doc.text('Total', 470, tableTop + 10, { width: 70, align: 'right' });

    // Table Rows
    doc.fillColor(textColor).font('Helvetica');
    let y = tableTop + 40;
    
    order.orderItems.forEach((item: any, i: number) => {
      // Draw alternating row background
      if (i % 2 === 1) {
        doc.rect(50, y - 5, doc.page.width - 100, 25).fill('#F9FAFB');
        doc.fillColor(textColor);
      }

      doc.text(item.name || 'Product', 60, y, { width: 270, height: 15, lineBreak: false });
      doc.text(`₹${item.price.toFixed(2)}`, 350, y, { width: 60, align: 'right' });
      doc.text(item.qty.toString(), 420, y, { width: 40, align: 'right' });
      doc.text(`₹${(item.qty * item.price).toFixed(2)}`, 470, y, { width: 70, align: 'right' });
      y += 25;
    });

    // Separator
    doc.moveTo(50, y).lineTo(doc.page.width - 50, y).strokeColor(lineColor).stroke();
    
    // Totals
    y += 15;
    doc.font('Helvetica').fillColor(lightText);
    doc.text('Subtotal:', 350, y, { width: 100, align: 'right' });
    doc.fillColor(textColor).text(`₹${order.itemsPrice.toFixed(2)}`, 470, y, { width: 70, align: 'right' });
    
    y += 20;
    doc.fillColor(lightText).text('Shipping:', 350, y, { width: 100, align: 'right' });
    doc.fillColor(textColor).text(`₹${order.shippingPrice.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

    y += 20;
    doc.fillColor(lightText).text('Tax:', 350, y, { width: 100, align: 'right' });
    doc.fillColor(textColor).text(`₹${order.taxPrice.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

    y += 25;
    doc.rect(350, y - 5, 200, 25).fill('#F3F4F6');
    doc.fillColor(primaryColor).font('Helvetica-Bold');
    doc.text('Grand Total:', 360, y, { width: 90, align: 'right' });
    doc.text(`₹${order.totalPrice.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

    // Footer
    doc.fillColor(lightText).font('Helvetica').fontSize(9);
    doc.text('Thank you for shopping with TechVerse!', 50, doc.page.height - 100, { align: 'center' });
    doc.text('If you have any questions, contact us at support@techverse.com', 50, doc.page.height - 85, { align: 'center' });

    doc.end();

  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
