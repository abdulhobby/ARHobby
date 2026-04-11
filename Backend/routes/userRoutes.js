import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatar,
  getAllUsers
} from '../controllers/userController.js';

// ✅ NEW MIDDLEWARES
import {
  protectUser,
  protectAdmin
} from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// ==================== USER ROUTES ====================

// Get logged-in user profile
router.get('/profile', protectUser, getProfile);

// Update profile
router.put('/profile', protectUser, updateProfile);

// Update password
router.put('/password', protectUser, updatePassword);

// Update avatar
router.put(
  '/avatar',
  protectUser,
  upload.single('avatar'),
  updateAvatar
);

// ==================== ADMIN ROUTES ====================

// Get all users (admin only)
router.get('/all', protectAdmin, getAllUsers);

export default router;
