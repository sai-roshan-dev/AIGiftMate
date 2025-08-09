import express from 'express';
import { saveGift, getSavedGifts, deleteGift } from '../controllers/giftController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the protect middleware

const router = express.Router();

// All routes here will require authentication
router.route('/')
  .post(protect, saveGift) // Save a new gift
  .get(protect, getSavedGifts); // Get all saved gifts for the user

router.route('/:id')
  .delete(protect, deleteGift); // Delete a specific gift

export default router;
