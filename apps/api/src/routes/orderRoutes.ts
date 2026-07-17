import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  updateOrderTracking,
  createStripeCheckoutSession
} from '../controllers/orderController';
import { downloadInvoice } from '../controllers/invoiceController';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin', 'superadmin', 'vendor'), getOrders);

router.route('/checkout-session').post(protect, createStripeCheckoutSession);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/invoice').get(protect, downloadInvoice);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/deliver').put(protect, authorize('admin', 'superadmin', 'vendor'), updateOrderToDelivered);

router.route('/:id/status').put(protect, authorize('admin', 'superadmin', 'vendor'), updateOrderStatus);

router.route('/:id/tracking').put(protect, authorize('admin', 'superadmin', 'vendor'), updateOrderTracking);

export default router;
