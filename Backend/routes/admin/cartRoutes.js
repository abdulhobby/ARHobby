// routes/admin/cartRoutes.js

import express from 'express';
import {
  getAllCarts,
  getCartByUser,
  getCartAnalytics,
  adminRemoveFromCart,
  adminUpdateCartItem,
  adminClearCart,
  adminDeleteCart,
  exportCarts
} from '../../controllers/admin/cartController.js';

// ✅ NEW AUTH
import { protectAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Apply admin auth to all routes
router.use(protectAdmin);

// ==================== ADMIN CART MANAGEMENT ====================

router.get('/', getAllCarts);

router.get('/analytics', getCartAnalytics);

router.get('/export', exportCarts);

router.get('/user/:userId', getCartByUser);

router.delete('/user/:userId/item/:productId', adminRemoveFromCart);

router.put('/user/:userId/item/:productId', adminUpdateCartItem);

router.delete('/user/:userId/clear', adminClearCart);

router.delete('/user/:userId', adminDeleteCart);

export default router;