// routes/subCategoryRoutes.js
import express from 'express';
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  getSubCategoryBySlug,
  updateSubCategory,
  deleteSubCategory
} from '../controllers/subCategoryController.js';
import { protectAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllSubCategories);
router.get('/slug/:slug', getSubCategoryBySlug);
router.get('/:id', getSubCategoryById);

// Admin routes
router.post('/', protectAdmin, upload.single('image'), createSubCategory);
router.put('/:id', protectAdmin, upload.single('image'), updateSubCategory);
router.delete('/:id', protectAdmin, deleteSubCategory);

export default router;