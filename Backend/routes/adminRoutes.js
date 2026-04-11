// routes/adminRoutes.js

import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';

// ✅ NEW AUTH
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==================== ADMIN ====================

router.get('/dashboard', protectAdmin, getDashboardStats);

export default router;