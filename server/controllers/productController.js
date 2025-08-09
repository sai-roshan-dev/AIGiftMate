import Product from '../models/Product.js';

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ id: id });

    if (product) {
      console.log(`Product found in MongoDB with ID: ${id}`);
      return res.json(product);
    }

    res.status(404).json({ message: 'Product not found' });

  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ message: 'Server error: Could not fetch product details' });
  }
};

export { getProductById };
