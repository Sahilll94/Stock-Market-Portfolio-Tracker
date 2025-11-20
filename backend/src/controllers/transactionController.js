import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Get all transactions for logged-in user
 * GET /api/transactions
 */
export const getTransactions = catchAsync(async (req, res, next) => {
  const { symbol, type, sortBy = 'date' } = req.query;

  // Build filter
  const filter = { userId: req.user.id };

  if (symbol) {
    filter.symbol = symbol.toUpperCase();
  }

  if (type) {
    if (!['BUY', 'SELL'].includes(type.toUpperCase())) {
      return next(new AppError('Invalid transaction type', 400));
    }
    filter.type = type.toUpperCase();
  }

  // Determine sort order
  let sortObj = {};
  if (sortBy === 'date') {
    sortObj = { date: -1 }; // Newest first
  } else if (sortBy === 'symbol') {
    sortObj = { symbol: 1, date: -1 };
  } else if (sortBy === 'type') {
    sortObj = { type: 1, date: -1 };
  }

  const transactions = await Transaction.find(filter).sort(sortObj);

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: {
      transactions
    }
  });
});

/**
 * Get transaction by ID
 * GET /api/transactions/:id
 */
export const getTransactionById = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      transaction
    }
  });
});

/**
 * Get transaction summary statistics
 * GET /api/transactions/summary
 */
export const getTransactionSummary = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find({ userId: req.user.id });

  // Calculate summary stats
  const buyTransactions = transactions.filter((t) => t.type === 'BUY');
  const sellTransactions = transactions.filter((t) => t.type === 'SELL');

  const totalBought = buyTransactions.reduce((sum, t) => sum + t.totalValue, 0);
  const totalSold = sellTransactions.reduce((sum, t) => sum + t.totalValue, 0);

  // Group by symbol
  const symbolStats = {};
  transactions.forEach((t) => {
    if (!symbolStats[t.symbol]) {
      symbolStats[t.symbol] = {
        symbol: t.symbol,
        buyCount: 0,
        sellCount: 0,
        totalBought: 0,
        totalSold: 0,
        netQuantity: 0
      };
    }

    if (t.type === 'BUY') {
      symbolStats[t.symbol].buyCount += 1;
      symbolStats[t.symbol].totalBought += t.totalValue;
      symbolStats[t.symbol].netQuantity += t.quantity;
    } else {
      symbolStats[t.symbol].sellCount += 1;
      symbolStats[t.symbol].totalSold += t.totalValue;
      symbolStats[t.symbol].netQuantity -= t.quantity;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalTransactions: transactions.length,
        buyTransactions: buyTransactions.length,
        sellTransactions: sellTransactions.length,
        totalBought: parseFloat(totalBought.toFixed(2)),
        totalSold: parseFloat(totalSold.toFixed(2)),
        netInvestment: parseFloat((totalBought - totalSold).toFixed(2))
      },
      symbolStats: Object.values(symbolStats)
    }
  });
});
