import express from 'express';
import {
  createProduct,
  getAllProducts,
  getAllProductsAdmin,
  getProductBySlug,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getLatestProducts,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
  getNewProducts,
  getFilterOptions,
  markProductAsNew,      // ✅ NEW
  removeNewStatus,       // ✅ NEW
  autoExpireNewProducts  // ✅ NEW
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ==================== ADMIN ROUTES ====================
router.get('/admin', protectAdmin, getAllProductsAdmin);
router.put('/admin/:id/mark-new', protectAdmin, markProductAsNew);
router.put('/admin/:id/remove-new', protectAdmin, removeNewStatus);
router.post('/admin/auto-expire-new', protectAdmin, autoExpireNewProducts);

// ==================== PUBLIC ROUTES ====================
router.get('/filter-options', getFilterOptions);
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/latest', getLatestProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/related/:id', getRelatedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// ==================== ADMIN ACTIONS ====================
router.post('/', protectAdmin, upload.array('images', 10), createProduct);
router.put('/:id', protectAdmin, upload.array('images', 10), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;