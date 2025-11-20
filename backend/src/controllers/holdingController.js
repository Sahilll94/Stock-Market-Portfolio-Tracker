import Holding from '../models/Holding.js';
import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import StockPriceService from '../services/StockPriceService.js';

/**
 * Add a new holding
 * POST /api/holdings
 */
export const addHolding = catchAsync(async (req, res, next) => {
  const { symbol, purchasePrice, quantity, purchaseDate } = req.body;

  // Validate input
  if (!symbol || purchasePrice === undefined || !quantity || !purchaseDate) {
    return next(
      new AppError('Please provide symbol, purchasePrice, quantity, and purchaseDate', 400)
    );
  }

  // Validate data types and values
  if (isNaN(purchasePrice) || purchasePrice < 0) {
    return next(new AppError('Purchase price must be a positive number', 400));
  }

  if (isNaN(quantity) || quantity < 1) {
    return next(new AppError('Quantity must be a positive number', 400));
  }

  // Create holding
  const holding = await Holding.create({
    userId: req.user.id,
    symbol: symbol.toUpperCase(),
    purchasePrice,
    quantity,
    purchaseDate: new Date(purchaseDate)
  });

  // Create corresponding BUY transaction
  await Transaction.create({
    userId: req.user.id,
    symbol: symbol.toUpperCase(),
    type: 'BUY',
    quantity,
    pricePerShare: purchasePrice,
    totalValue: quantity * purchasePrice,
    date: new Date(purchaseDate)
  });

  res.status(201).json({
    success: true,
    message: 'Holding added successfully',
    data: {
      holding
    }
  });
});

/**
 * Get all holdings for logged-in user with current prices and P&L
 * GET /api/holdings
 */
export const getHoldings = catchAsync(async (req, res, next) => {
  const holdings = await Holding.find({ userId: req.user.id });

  if (!holdings || holdings.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No holdings found',
      data: {
        holdings: [],
        summary: {
          totalInvested: 0,
          currentValue: 0,
          totalProfitLoss: 0,
          totalProfitLossPercentage: 0
        }
      }
    });
  }

  // Get unique symbols
  const symbols = [...new Set(holdings.map((h) => h.symbol))];

  // Fetch current prices for all symbols
  const prices = await StockPriceService.getMultiplePrices(symbols);

  // Calculate P&L for each holding
  let totalInvested = 0;
  let currentValue = 0;

  const holdingsWithPnL = holdings.map((holding) => {
    const currentPrice = prices[holding.symbol];
    const investedAmount = holding.purchasePrice * holding.quantity;
    const currentHoldingValue = currentPrice * holding.quantity;
    const profitLoss = currentHoldingValue - investedAmount;
    const profitLossPercentage = ((profitLoss / investedAmount) * 100).toFixed(2);

    totalInvested += investedAmount;
    currentValue += currentHoldingValue;

    return {
      _id: holding._id,
      userId: holding.userId,
      symbol: holding.symbol,
      purchasePrice: holding.purchasePrice,
      quantity: holding.quantity,
      purchaseDate: holding.purchaseDate,
      currentPrice,
      investedAmount,
      currentHoldingValue,
      profitLoss: parseFloat(profitLoss.toFixed(2)),
      profitLossPercentage: parseFloat(profitLossPercentage),
      createdAt: holding.createdAt,
      updatedAt: holding.updatedAt
    };
  });

  const totalProfitLoss = currentValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    data: {
      holdings: holdingsWithPnL,
      summary: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
        totalProfitLossPercentage: parseFloat(totalProfitLossPercentage),
        numberOfHoldings: holdings.length
      }
    }
  });
});

/**
 * Get single holding by ID
 * GET /api/holdings/:id
 */
export const getHoldingById = catchAsync(async (req, res, next) => {
  const holding = await Holding.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!holding) {
    return next(new AppError('Holding not found', 404));
  }

  // Get current price
  const currentPrice = await StockPriceService.getStockPrice(holding.symbol);

  const investedAmount = holding.purchasePrice * holding.quantity;
  const currentHoldingValue = currentPrice * holding.quantity;
  const profitLoss = currentHoldingValue - investedAmount;
  const profitLossPercentage = ((profitLoss / investedAmount) * 100).toFixed(2);

  res.status(200).json({
    success: true,
    data: {
      holding: {
        ...holding.toObject(),
        currentPrice,
        investedAmount,
        currentHoldingValue,
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercentage: parseFloat(profitLossPercentage)
      }
    }
  });
});

/**
 * Update holding
 * PUT /api/holdings/:id
 */
export const updateHolding = catchAsync(async (req, res, next) => {
  const { purchasePrice, quantity, purchaseDate } = req.body;

  const holding = await Holding.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!holding) {
    return next(new AppError('Holding not found', 404));
  }

  // Update fields
  if (purchasePrice !== undefined) {
    if (isNaN(purchasePrice) || purchasePrice < 0) {
      return next(new AppError('Purchase price must be a positive number', 400));
    }
    holding.purchasePrice = purchasePrice;
  }

  if (quantity !== undefined) {
    if (isNaN(quantity) || quantity < 1) {
      return next(new AppError('Quantity must be a positive number', 400));
    }
    holding.quantity = quantity;
  }

  if (purchaseDate !== undefined) {
    holding.purchaseDate = new Date(purchaseDate);
  }

  await holding.save();

  // Create transaction log for update (as a SELL + BUY)
  // We'll log this as an UPDATE transaction
  await Transaction.create({
    userId: req.user.id,
    symbol: holding.symbol,
    type: 'BUY', // Log updates as BUY (for simplicity)
    quantity: holding.quantity,
    pricePerShare: holding.purchasePrice,
    totalValue: holding.quantity * holding.purchasePrice,
    date: new Date()
  });

  res.status(200).json({
    success: true,
    message: 'Holding updated successfully',
    data: {
      holding
    }
  });
});

/**
 * Delete holding
 * DELETE /api/holdings/:id
 */
export const deleteHolding = catchAsync(async (req, res, next) => {
  const holding = await Holding.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!holding) {
    return next(new AppError('Holding not found', 404));
  }

  // Create SELL transaction before deleting
  await Transaction.create({
    userId: req.user.id,
    symbol: holding.symbol,
    type: 'SELL',
    quantity: holding.quantity,
    pricePerShare: holding.purchasePrice,
    totalValue: holding.quantity * holding.purchasePrice,
    date: new Date()
  });

  // Delete holding
  await Holding.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Holding deleted successfully'
  });
});
