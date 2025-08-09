import fs from 'fs/promises';
import path from 'path';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedProducts = async () => {
  try {
    // Read the db.json file
    const dataPath = path.join(__dirname, '..', 'db.json');
    const data = await fs.readFile(dataPath, 'utf8');
    const { products } = JSON.parse(data);

    // Clear existing products to prevent duplicates
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully from db.json!');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
