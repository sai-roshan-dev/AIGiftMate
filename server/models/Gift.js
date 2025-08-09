import mongoose from 'mongoose';

const giftSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: { // NEW: Add the imageUrl field
      type: String,
      required: false, // Image is not required for AI-only suggestions
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gift = mongoose.model('Gift', giftSchema);

export default Gift;
