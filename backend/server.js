import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './src/config/database.js';
import { initializeFirebaseAdmin } from './src/services/firebaseAdmin.js';
import errorHandler from './src/middleware/errorHandler.js';
import requestLogger from './src/middleware/requestLogger.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import holdingRoutes from './src/routes/holdingRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import stockRoutes from './src/routes/stockRoutes.js';

const app = express();

// Connect to database
connectDB();

// Initialize Firebase Admin SDK (only if Firebase credentials are available)
try {
  if (process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    initializeFirebaseAdmin();
    console.log('Firebase Admin SDK initialized');
  } else {
    console.log('Firebase credentials not found. Google OAuth will be disabled.');
  }
} catch (error) {
  console.warn('Firebase initialization skipped:', error.message);
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stocks', stockRoutes);

// Root endpoint with API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PortfolioTrack Backend API is running',
    'frontend-url': 'https://portfoliotrack.sahilfolio.live',
    docs: 'https://www.postman.com/sahillll94/workspace/portfolio-tracker/collection/36283559-aad8529b-5ff9-4b2c-a785-533e5f464107?action=share&creator=36283559&active-environment=36283559-334dc1ba-8b38-47f4-ba47-3bebf0d78a98',
    'GitHub-Repository': 'https://github.com/Sahilll94/Stock-Market-Portfolio-Tracker',
    'contact-on-email': 'sahilk64555@gmail.com'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
