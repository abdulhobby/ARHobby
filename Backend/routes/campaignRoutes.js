// routes/campaignRoutes.js

import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
  cancelCampaign
} from '../controllers/campaignController.js';

// ✅ NEW AUTH
import { protectAdmin } from '../middleware/auth.js';

import upload from '../middleware/upload.js';
import { validateCampaign } from '../middleware/validate.js';

const router = express.Router();

// ==================== ADMIN ROUTES ====================

router.get('/', protectAdmin, getAllCampaigns);

router.get('/stats', protectAdmin, getCampaignStats);

router.get('/:id', protectAdmin, getCampaignById);

router.post(
  '/',
  protectAdmin,
  upload.single('bannerImage'),
  validateCampaign,
  createCampaign
);

router.put(
  '/:id',
  protectAdmin,
  upload.single('bannerImage'),
  updateCampaign
);

router.delete('/:id', protectAdmin, deleteCampaign);

router.put('/:id/cancel', protectAdmin, cancelCampaign);

export default router;