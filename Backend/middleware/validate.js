// middleware/validate.js
import { validationResult, body, param, query } from 'express-validator';

// ==================== ERROR HANDLER ====================

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

// ==================== AUTHENTICATION VALIDATORS ====================

export const validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .isLength({ max: 50 }).withMessage('Password must not exceed 50 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please enter a valid phone number'),

  handleValidationErrors
];

export const validateEmailVerification = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
    .matches(/^\d+$/).withMessage('OTP must contain only numbers'),
  handleValidationErrors
];

export const validateResendOtp = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors
];

export const validatePasswordReset = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .isLength({ max: 50 }).withMessage('Password must not exceed 50 characters'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  handleValidationErrors
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .isLength({ max: 50 }).withMessage('New password must not exceed 50 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  handleValidationErrors
];

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please enter a valid phone number'),

  handleValidationErrors
];

export const validateDeactivateAccount = [
  body('password')
    .notEmpty().withMessage('Password is required to deactivate account'),

  handleValidationErrors
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  handleValidationErrors
];

export const validateResendVerification = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  handleValidationErrors
];

// ==================== PRODUCT VALIDATORS ====================

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Product name must not exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative number'),

  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  body('sku')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('SKU must be at least 3 characters'),

  handleValidationErrors
];

export const validateUpdateProduct = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Product name must not exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),

  body('category')
    .optional()
    .trim()
    .isMongoId().withMessage('Invalid category ID'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative number'),

  handleValidationErrors
];

// ==================== CATEGORY VALIDATORS ====================

export const validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Category name must not exceed 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('image')
    .optional()
    .isURL().withMessage('Invalid image URL'),

  handleValidationErrors
];

export const validateUpdateCategory = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Category name must not exceed 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('image')
    .optional()
    .isURL().withMessage('Invalid image URL'),

  handleValidationErrors
];

// ==================== ADDRESS VALIDATORS ====================

export const validateAddress = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isMobilePhone().withMessage('Please enter a valid phone number'),

  body('addressLine1')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),

  body('addressLine2')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Address line 2 must not exceed 100 characters'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('City must contain only letters'),

  body('state')
    .trim()
    .notEmpty().withMessage('State is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('State must contain only letters'),

  body('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .isLength({ min: 5, max: 6 }).withMessage('Pincode must be 5-6 characters')
    .matches(/^[0-9]+$/).withMessage('Pincode must contain only numbers'),

  body('country')
    .optional()
    .trim()
    .matches(/^[a-zA-Z\s]+$/).withMessage('Country must contain only letters'),

  handleValidationErrors
];

export const validateUpdateAddress = [
  param('id')
    .isMongoId().withMessage('Invalid address ID'),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please enter a valid phone number'),

  body('addressLine1')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),

  body('city')
    .optional()
    .trim()
    .matches(/^[a-zA-Z\s]+$/).withMessage('City must contain only letters'),

  body('state')
    .optional()
    .trim()
    .matches(/^[a-zA-Z\s]+$/).withMessage('State must contain only letters'),

  body('pincode')
    .optional()
    .trim()
    .isLength({ min: 5, max: 6 }).withMessage('Pincode must be 5-6 characters')
    .matches(/^[0-9]+$/).withMessage('Pincode must contain only numbers'),

  handleValidationErrors
];

// ==================== COUPON VALIDATORS ====================

export const validateCoupon = [
  body('code')
    .trim()
    .notEmpty().withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 }).withMessage('Coupon code must be 3-20 characters')
    .matches(/^[A-Z0-9]+$/).withMessage('Coupon code must contain only uppercase letters and numbers'),

  body('type')
    .notEmpty().withMessage('Coupon type is required')
    .isIn(['percentage', 'fixed']).withMessage('Coupon type must be either "percentage" or "fixed"'),

  body('value')
    .notEmpty().withMessage('Coupon value is required')
    .isFloat({ min: 0.01 }).withMessage('Coupon value must be greater than 0'),

  body('maxUses')
    .optional()
    .isInt({ min: 1 }).withMessage('Max uses must be at least 1'),

  body('maxUsesPerUser')
    .optional()
    .isInt({ min: 1 }).withMessage('Max uses per user must be at least 1'),

  body('minOrderValue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum order value must be non-negative'),

  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),

  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  handleValidationErrors
];

export const validateUpdateCoupon = [
  param('id')
    .isMongoId().withMessage('Invalid coupon ID'),

  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Coupon code must be 3-20 characters')
    .matches(/^[A-Z0-9]+$/).withMessage('Coupon code must contain only uppercase letters and numbers'),

  body('type')
    .optional()
    .isIn(['percentage', 'fixed']).withMessage('Coupon type must be either "percentage" or "fixed"'),

  body('value')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Coupon value must be greater than 0'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),

  body('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),

  handleValidationErrors
];

// ==================== ORDER VALIDATORS ====================

export const validateCreateOrder = [
  body('shippingAddress')
    .notEmpty().withMessage('Shipping address is required'),

  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isMobilePhone().withMessage('Please enter a valid phone number'),

  body('shippingAddress.addressLine1')
    .trim()
    .notEmpty().withMessage('Address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('State is required'),

  body('shippingAddress.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^[0-9]{5,6}$/).withMessage('Pincode must be 5-6 digits'),

  body('termsAccepted')
    .notEmpty().withMessage('You must accept terms and conditions')
    .isBoolean().withMessage('Terms acceptance must be true'),

  body('couponCode')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Invalid coupon code'),

  handleValidationErrors
];

export const validateUpdateOrderStatus = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),

  body('orderStatus')
    .optional()
    .isIn(['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status'),

  body('paymentStatus')
    .optional()
    .isIn(['Pending', 'Completed', 'Failed', 'Refunded'])
    .withMessage('Invalid payment status'),

  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Invalid tracking number'),

  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Admin notes must not exceed 500 characters'),

  handleValidationErrors
];

// ==================== REVIEW VALIDATORS ====================

export const validateReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('title')
    .trim()
    .notEmpty().withMessage('Review title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),

  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters'),

  body('verified')
    .optional()
    .isBoolean().withMessage('Verified must be a boolean'),

  handleValidationErrors
];

// ==================== CONTACT FORM VALIDATOR ====================

export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please enter a valid phone number'),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 100 }).withMessage('Subject must be 5-100 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),

  handleValidationErrors
];

// ==================== SEARCH & FILTER VALIDATORS ====================

export const validateProductSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Search term must be at least 2 characters'),

  query('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be non-negative'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be non-negative'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['newest', 'priceAsc', 'priceDesc', 'popular'])
    .withMessage('Invalid sort option'),

  handleValidationErrors
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

export const validateCampaign = [
  body('title')
    .trim()
    .notEmpty().withMessage('Campaign title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),

  body('subject')
    .trim()
    .notEmpty().withMessage('Email subject is required')
    .isLength({ max: 200 }).withMessage('Subject must not exceed 200 characters'),

  body('type')
    .optional()
    .isIn(['promotional', 'announcement', 'newsletter', 'product-showcase'])
    .withMessage('Invalid campaign type'),

  body('targetSegment')
    .optional()
    .isIn(['all', 'active', 'inactive', 'custom'])
    .withMessage('Invalid target segment'),

  // Skip validation for products since it comes as JSON string from FormData
  // Will be parsed in controller
  
  handleValidationErrors
];