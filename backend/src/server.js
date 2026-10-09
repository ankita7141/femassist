import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import reportRoutes from './routes/reports.js';
import symptomRoutes from './routes/symptoms.js';
import cycleRoutes from './routes/cycles.js';
import trainingRoutes from './routes/training.js';
import followupRoutes from './routes/followups.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FemAssist API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/followups', followupRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FemAssist API 🌸' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});