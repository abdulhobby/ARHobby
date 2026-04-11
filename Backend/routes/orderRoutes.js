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

// ✅ NEW AUTH MIDDLEWARE
import { protectUser, protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ====================

// Store info (public)
router.get('/store-info', getStoreInfo);

// ==================== USER ROUTES ====================

// Create order
router.post('/', protectUser, createOrder);

// Get my orders
router.get('/my-orders', protectUser, getMyOrders);

// Get single order
router.get('/:id', protectUser, getOrderById);

// Track order
router.get('/:id/track', protectUser, trackOrder);

// Download invoice
router.get('/:id/invoice', protectUser, downloadInvoice);

// ==================== ADMIN ROUTES ====================

// Get all orders
router.get('/admin/all', protectAdmin, getAllOrders);

// Get new orders
router.get('/admin/new', protectAdmin, getNewOrders);

// Mark all viewed
router.put('/admin/mark-all-viewed', protectAdmin, markAllOrdersViewed);

// Update order status
router.put('/admin/:id/status', protectAdmin, updateOrderStatus);

// Mark order viewed
router.put('/admin/:id/viewed', protectAdmin, markOrderViewed);

export default router;
