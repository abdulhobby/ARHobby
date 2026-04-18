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
  verifyEmail,      // new
  resendOtp         // new
} from '../controllers/authController.js';

import {
  protectUser,
  protectAdmin,
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
  validateEmailVerification,   // new (see next file)
  validateResendOtp            // new
} from '../middleware/validate.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post('/register', rateLimit(50, 30 * 60 * 1000), validateRegistration, asyncHandler(register));
router.post('/login', rateLimit(50, 15 * 60 * 1000), validateLogin, asyncHandler(login));
router.post('/admin/login', rateLimit(30, 15 * 60 * 1000), validateLogin, asyncHandler(adminLogin));
router.post('/forgot-password', rateLimit(3, 60 * 60 * 1000), validateForgotPassword, asyncHandler(forgotPassword));
router.put('/reset-password/:token', rateLimit(5, 60 * 60 * 1000), validatePasswordReset, asyncHandler(resetPassword));

// NEW OTP ROUTES
router.post('/verify-email', rateLimit(10, 60 * 60 * 1000), validateEmailVerification, asyncHandler(verifyEmail));
router.post('/resend-otp', rateLimit(3, 60 * 60 * 1000), validateResendOtp, asyncHandler(resendOtp));

// ==================== USER PROTECTED ROUTES ====================
router.post('/logout', protectUser, logRequest, asyncHandler(logout));
router.get('/me', protectUser, logRequest, asyncHandler(getMe));
router.put('/change-password', protectUser, logRequest, validateChangePassword, rateLimit(5, 60 * 60 * 1000), asyncHandler(changePassword));
router.put('/update-profile', protectUser, logRequest, validateUpdateProfile, asyncHandler(updateProfile));
router.put('/deactivate-account', protectUser, logRequest, validateDeactivateAccount, asyncHandler(deactivateAccount));

// ==================== ADMIN PROTECTED ROUTES ====================
router.post('/admin/logout', protectAdmin, logRequest, asyncHandler(logout));
router.get('/admin/me', protectAdmin, logRequest, asyncHandler(getMe));

export default router;