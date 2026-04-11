// routes/cartRoutes.js

import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

// ✅ NEW AUTH
import { protectUser } from '../middleware/auth.js';

const router = express.Router();

// ==================== USER CART ====================

// Get cart
router.get('/', protectUser, getCart);

// Add to cart
router.post('/add', protectUser, addToCart);

// Update cart item
router.put('/update', protectUser, updateCartItem);

// Remove item
router.delete('/remove/:productId', protectUser, removeFromCart);

// Clear cart
router.delete('/clear', protectUser, clearCart);

export default router;