import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { getSalesReport, getActivityLogs, downloadSalesReportPDF } from '../controllers/reportController';

const router = express.Router();

router.route('/sales')
  .get(protect, authorize('admin', 'superadmin'), getSalesReport);

router.route('/sales/pdf')
  .get(protect, authorize('admin', 'superadmin'), downloadSalesReportPDF);

router.route('/activity')
  .get(protect, authorize('admin', 'superadmin'), getActivityLogs);

export default router;
