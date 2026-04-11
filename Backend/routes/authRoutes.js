// routes/authRoutes.js

import express from 'express';
import {
  register,
  login,
  adminLogin,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  deactivateAccount,
  resendVerificationEmail
} from '../controllers/authController.js';

// ✅ UPDATED MIDDLEWARE IMPORTS
import {
  protectUser,
  protectAdmin,
  optionalAuth,
  rateLimit,
  logRequest,
  asyncHandler
} from '../middleware/auth.js';

import {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateChangePassword,
  validateUpdateProfile,
  validateDeactivateAccount,
  validateForgotPassword,
  validateResendVerification
} from '../middleware/validate.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// User Registration
router.post(
  '/register',
  rateLimit(50, 30 * 60 * 1000), // ✅ 50 per hour
  validateRegistration,
  asyncHandler(register)
);

// User Login
router.post(
  '/login',
  rateLimit(50, 15 * 60 * 1000), // ✅ 50 per 15 min
  validateLogin,
  asyncHandler(login)
);

// Admin Login (more strict but still usable)
router.post(
  '/admin/login',
  rateLimit(30, 15 * 60 * 1000), // ✅ 30 per 15 min
  validateLogin,
  asyncHandler(adminLogin)
);

// Forgot Password
router.post(
  '/forgot-password',
  rateLimit(3, 60 * 60 * 1000),
  validateForgotPassword,
  asyncHandler(forgotPassword)
);

// Reset Password
router.put(
  '/reset-password/:token',
  rateLimit(5, 60 * 60 * 1000),
  validatePasswordReset,
  asyncHandler(resetPassword)
);

// Resend Verification Email
router.post(
  '/resend-verification',
  rateLimit(3, 60 * 60 * 1000),
  validateResendVerification,
  asyncHandler(resendVerificationEmail)
);

// ==================== USER PROTECTED ROUTES ====================

// Logout (User)
router.post(
  '/logout',
  protectUser,
  logRequest,
  asyncHandler(logout)
);

// Get Current User
router.get(
  '/me',
  protectUser,
  logRequest,
  asyncHandler(getMe)
);

// Change Password
router.put(
  '/change-password',
  protectUser,
  logRequest,
  validateChangePassword,
  rateLimit(5, 60 * 60 * 1000),
  asyncHandler(changePassword)
);

// Update Profile
router.put(
  '/update-profile',
  protectUser,
  logRequest,
  validateUpdateProfile,
  asyncHandler(updateProfile)
);

// Deactivate Account
router.put(
  '/deactivate-account',
  protectUser,
  logRequest,
  validateDeactivateAccount,
  asyncHandler(deactivateAccount)
);

// ==================== ADMIN PROTECTED ROUTES ====================

// Admin Logout (optional but recommended)
router.post(
  '/admin/logout',
  protectAdmin,
  logRequest,
  asyncHandler(logout)
);

// Admin Self Info (optional)
router.get(
  '/admin/me',
  protectAdmin,
  logRequest,
  asyncHandler(getMe)
);

export default router;
