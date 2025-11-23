import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Transaction routes (READ-ONLY - transactions cannot be edited or deleted)
router.get('/', transactionController.getTransactions);
router.get('/summary', transactionController.getTransactionSummary);
router.get('/:id', transactionController.getTransactionById);

export default router;
