import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Example of a protected route: Get user profile
// This route will only be accessible if a valid JWT is provided
router.get('/profile', protect, (req, res) => {
  // req.user is available here because of the 'protect' middleware
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  });
});

export default router;
