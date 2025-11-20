import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard routes
router.get('/summary', dashboardController.getDashboardSummary);
router.get('/distribution', dashboardController.getPortfolioDistribution);
router.get('/performance', dashboardController.getPortfolioPerformance);

export default router;
