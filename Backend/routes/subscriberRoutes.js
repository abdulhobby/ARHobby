// routes/subscriberRoutes.js

import express from 'express';
import {
  subscribe,
  unsubscribe,
  updatePreferences,
  getAllSubscribers,
  bulkImportSubscribers,
  addSingleSubscriber,
  deleteSubscriber,
  exportSubscribers,
  getSubscriberStats
} from '../controllers/subscriberController.js';

// ✅ NEW AUTH MIDDLEWARE
import { protectUser, protectAdmin } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// Subscribe
router.post('/subscribe', subscribe);

// Unsubscribe
router.post('/unsubscribe', unsubscribe);

// Update preferences (user must be logged in)
router.put('/preferences', protectUser, updatePreferences);

// ==================== ADMIN ROUTES ====================

// Get all subscribers
router.get('/', protectAdmin, getAllSubscribers);

// Add single subscriber
router.post('/', protectAdmin, addSingleSubscriber);

// Bulk import (CSV)
router.post(
  '/import',
  protectAdmin,
  upload.single('file'),
  bulkImportSubscribers
);

// Delete subscriber
router.delete('/:id', protectAdmin, deleteSubscriber);

// Export CSV
router.get('/export/csv', protectAdmin, exportSubscribers);

// Stats
router.get('/stats', protectAdmin, getSubscriberStats);

export default router;