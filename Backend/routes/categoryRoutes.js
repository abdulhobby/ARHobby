// routes/categoryRoutes.js

import express from 'express';
import {
  createCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryBySlug,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

import { protectAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ==================== ADMIN ROUTES (MOVE TO TOP) ====================

router.get('/admin', protectAdmin, getAllCategoriesAdmin);

// ==================== PUBLIC ====================

// Get all categories
router.get('/', getAllCategories);

// Get by slug
router.get('/slug/:slug', getCategoryBySlug);

// ⚠️ KEEP THIS LAST
router.get('/:id', getCategoryById);

// ==================== ADMIN ACTIONS ====================

router.post(
  '/',
  protectAdmin,
  upload.single('image'),
  createCategory
);

router.put(
  '/:id',
  protectAdmin,
  upload.single('image'),
  updateCategory
);

router.delete('/:id', protectAdmin, deleteCategory);

export default router;