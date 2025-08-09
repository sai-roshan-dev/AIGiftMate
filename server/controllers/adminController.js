import User from '../models/User.js';
import Gift from '../models/Gift.js'; // Import the Gift model

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Fetch all users, exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users (admin):', error);
    res.status(500).json({ message: 'Server error: Could not fetch users' });
  }
};

// @desc    Get platform statistics (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    const totalSavedGifts = await Gift.countDocuments({}); // Get total saved gifts

    res.json({
      userCount,
      totalSavedGifts, // Include total saved gifts in stats
      message: 'Platform statistics retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching platform stats (admin):', error);
    res.status(500).json({ message: 'Server error: Could not fetch statistics' });
  }
};

// @desc    Get all saved gifts from all users (Admin only)
// @route   GET /api/admin/gifts
// @access  Private/Admin
const getAllSavedGifts = async (req, res) => {
  try {
    // Populate the 'user' field to show who saved the gift
    const gifts = await Gift.find({}).populate('user', 'username email');
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching all saved gifts (admin):', error);
    res.status(500).json({ message: 'Server error: Could not fetch all saved gifts' });
  }
};

// @desc    Delete any gift (Admin only)
// @route   DELETE /api/admin/gifts/:id
// @access  Private/Admin
const deleteAnyGift = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }

    await Gift.deleteOne({ _id: req.params.id });
    res.json({ message: 'Gift removed by admin' });
  } catch (error) {
    console.error('Error deleting gift by admin:', error);
    res.status(500).json({ message: 'Server error: Could not delete gift' });
  }
};


export { getAllUsers, getPlatformStats, getAllSavedGifts, deleteAnyGift };
