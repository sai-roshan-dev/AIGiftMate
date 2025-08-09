import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { generateGiftRecommendations } from './lib/gemini.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import giftRoutes from './routes/giftRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000; // Keep port consistent with your setup

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/recommendations', async (req, res) => {
  const { surveyData } = req.body;
  
  if (!surveyData) {
    return res.status(400).json({ error: 'Survey data is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in .env file.");
      return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    const recommendations = await generateGiftRecommendations(surveyData);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
