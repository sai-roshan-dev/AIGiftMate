import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
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
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  reviews: {
    type: Number,
    required: false,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
