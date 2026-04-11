// routes/couponRoutes.js

import express from 'express';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  applyCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';

// ✅ NEW AUTH MIDDLEWARE
import { protectUser, protectAdmin } from '../middleware/auth.js';

import { validateCoupon } from '../middleware/validate.js';

const router = express.Router();

// ==================== USER ROUTES ====================

// Apply coupon (user)
router.post('/apply', protectUser, applyCoupon);

// ==================== ADMIN ROUTES ====================

// Get all coupons
router.get('/', protectAdmin, getAllCoupons);

// Get single coupon
router.get('/:id', protectAdmin, getCouponById);

// Create coupon
router.post('/', protectAdmin, validateCoupon, createCoupon);

// Update coupon
router.put('/:id', protectAdmin, updateCoupon);

// Delete coupon
router.delete('/:id', protectAdmin, deleteCoupon);

export default router;