import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import Stripe from 'stripe';
import { Notification } from '../models/Notification';
import { ActivityLog } from '../models/ActivityLog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-06-24.dahlia' as any,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No order items' });
    } else {
      const order = new Order({
        orderItems,
        user: req.user?._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Create notifications for vendors
      const vendorIds = [...new Set(orderItems.map((item: any) => item.vendor.toString()))];
      for (const vendorId of vendorIds) {
        await Notification.create({
          user: vendorId, // vendor ID
          title: 'New Order Received',
          message: `You have received a new order (${createdOrder._id}). Please check your vendor dashboard.`,
          type: 'vendor',
          link: '/orders' // admin/vendor dashboard link
        });
      }

      res.status(201).json({ status: 'success', data: createdOrder });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/checkout-session
// @access  Private/Customer
export const createStripeCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, orderId } = req.body;
    
    const line_items = orderItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image || item.thumbnail || 'https://via.placeholder.com/150'],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        orderId: orderId,
      }
    });

    res.json({ status: 'success', data: { url: session.url } });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json({ status: 'success', data: order });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.json({ status: 'success', data: orders });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Vendor
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    let query = {};
    if (req.user?.role === 'vendor') {
      // Find orders that contain at least one item from this vendor
      query = { 'orderItems.vendor': req.user._id };
    }
    
    const orders = await Order.find(query).populate('user', 'id name');
    res.json({ status: 'success', data: orders });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      
      const updatedOrder = await order.save();
      res.json({ status: 'success', data: updatedOrder });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (req.user?.role === 'vendor') {
        const isVendorOrder = order.orderItems.some((item: any) => item.vendor.toString() === req.user?._id.toString());
        if (!isVendorOrder) {
          return res.status(403).json({ status: 'error', message: 'Not authorized to deliver this order' });
        }
      }
      order.deliveredAt = new Date();
      order.status = 'delivered';
      
      const updatedOrder = await order.save();
      res.json({ status: 'success', data: updatedOrder });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (req.user?.role === 'vendor') {
        const isVendorOrder = order.orderItems.some((item: any) => item.vendor.toString() === req.user?._id.toString());
        if (!isVendorOrder) {
          return res.status(403).json({ status: 'error', message: 'Not authorized to update this order' });
        }
      }
      order.status = req.body.status;
      const updatedOrder = await order.save();
      
      await ActivityLog.create({
        user: req.user?._id,
        action: 'UPDATE_ORDER_STATUS',
        resource: `Order: ${order._id} set to ${order.status}`,
        ipAddress: req.ip
      });

      res.json({ status: 'success', data: updatedOrder });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update order tracking
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
export const updateOrderTracking = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (req.user?.role === 'vendor') {
        const isVendorOrder = order.orderItems.some((item: any) => item.vendor.toString() === req.user?._id.toString());
        if (!isVendorOrder) {
          return res.status(403).json({ status: 'error', message: 'Not authorized to track this order' });
        }
      }
      const { status, description, location, trackingNumber, courierName } = req.body;
      
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (courierName) order.courierName = courierName;
      if (status) order.status = status;

      if (!order.trackingHistory) order.trackingHistory = [];

      order.trackingHistory.push({
        status: status || order.status,
        description: description || `Order status updated to ${status || order.status}`,
        location,
        timestamp: new Date()
      });

      const updatedOrder = await order.save();
      
      await ActivityLog.create({
        user: req.user?._id,
        action: 'UPDATE_ORDER_TRACKING',
        resource: `Order Tracking: ${order._id} updated`,
        ipAddress: req.ip
      });

      res.json({ status: 'success', data: updatedOrder });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
