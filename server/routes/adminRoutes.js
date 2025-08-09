import express from 'express';
import { getAllUsers, getPlatformStats, getAllSavedGifts, deleteAnyGift } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file will require both authentication and admin role
router.route('/users').get(protect, admin, getAllUsers);
router.route('/stats').get(protect, admin, getPlatformStats);
router.route('/gifts').get(protect, admin, getAllSavedGifts); // New route to get all gifts
router.route('/gifts/:id').delete(protect, admin, deleteAnyGift); // New route to delete any gift

export default router;
