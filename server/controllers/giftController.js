import Gift from '../models/Gift.js';

// @desc    Save a new gift recommendation for a user
// @route   POST /api/gifts
// @access  Private
const saveGift = async (req, res) => {
  try {
    const { name, category, reason, imageUrl, price, description } = req.body; // ← add price & description
    const userId = req.user._id;

    // Ensure all required fields are present (optional but helpful)
    if (!name || !category || !reason || !imageUrl || !price || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newGift = new Gift({
      name,
      category,
      reason,
      imageUrl,
      price,
      description,
      user: userId,
    });

    await newGift.save();

    res.status(201).json({ message: 'Gift saved successfully', gift: newGift });
  } catch (error) {
    console.error('Error saving gift:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Get all saved gifts for the logged-in user
// @route   GET /api/gifts
// @access  Private
const getSavedGifts = async (req, res) => {
  try {
    // Find gifts associated with the logged-in user
    const gifts = await Gift.find({ user: req.user._id });
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching saved gifts:', error);
    res.status(500).json({ message: 'Server error: Could not fetch saved gifts' });
  }
};

// @desc    Delete a saved gift
// @route   DELETE /api/gifts/:id
// @access  Private
const deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }

    // Ensure the logged-in user owns the gift
    if (gift.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this gift' });
    }

    await Gift.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
    res.json({ message: 'Gift removed' });
  } catch (error) {
    console.error('Error deleting gift:', error);
    res.status(500).json({ message: 'Server error: Could not delete gift' });
  }
};

export { saveGift, getSavedGifts, deleteGift };
