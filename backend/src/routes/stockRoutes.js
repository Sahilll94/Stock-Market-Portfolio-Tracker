import express from 'express';
import * as stockController from '../controllers/stockController.js';

const router = express.Router();

// Public routes - no authentication required for landing page
router.get('/realtime/:symbol', stockController.getRealtimeStockData);
router.get('/multiple', stockController.getMultipleStocksData);

export default router;
