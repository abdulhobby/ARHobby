// routes/addressRoutes.js

import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';

// ✅ NEW AUTH
import { protectUser } from '../middleware/auth.js';

import { validateAddress } from '../middleware/validate.js';

const router = express.Router();

// ==================== USER ADDRESS ====================

router.get('/', protectUser, getAddresses);

router.post('/', protectUser, validateAddress, addAddress);

router.put('/:id', protectUser, updateAddress);

router.delete('/:id', protectUser, deleteAddress);

router.put('/:id/default', protectUser, setDefaultAddress);

export default router;