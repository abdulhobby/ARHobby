// routes/contactRoutes.js

import express from 'express';
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';

// ✅ NEW AUTH
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==================== PUBLIC ====================

// Submit contact form
router.post('/', submitContact);

// ==================== ADMIN ====================

// Get all contacts
router.get('/', protectAdmin, getAllContacts);

// Update contact status
router.put('/:id', protectAdmin, updateContactStatus);

// Delete contact
router.delete('/:id', protectAdmin, deleteContact);

export default router;