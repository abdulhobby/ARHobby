// routes/orderRoutes.js

import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  downloadInvoice,
  getAllOrders,
  updateOrderStatus,
  getNewOrders,
  markOrderViewed,
  markAllOrdersViewed,
  getStoreInfo
} from '../controllers/orderController.js';

import { protectUser, protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ====================

router.get('/store-info', getStoreInfo);

// ==================== ADMIN ROUTES (TOP) ====================

router.get('/admin/all', protectAdmin, getAllOrders);
router.get('/admin/new', protectAdmin, getNewOrders);
router.get('/admin/:id', protectAdmin, getOrderById);

router.put('/admin/mark-all-viewed', protectAdmin, markAllOrdersViewed);
router.put('/admin/:id/status', protectAdmin, updateOrderStatus);
router.put('/admin/:id/viewed', protectAdmin, markOrderViewed);

// ==================== USER ROUTES ====================

router.post('/', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);

// ⚠️ ALWAYS KEEP THESE LAST
router.get('/:id', protectUser, getOrderById);
router.get('/:id/track', protectUser, trackOrder);
router.get('/:id/invoice', protectUser, downloadInvoice);

export default router;