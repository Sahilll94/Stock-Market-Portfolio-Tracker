import Holding from '../models/Holding.js';
import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import StockPriceService from '../services/StockPriceService.js';
import axios from 'axios';

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

  const oldQuantity = holding.quantity;
  let quantityDifference = 0;

  // Check if quantity is being changed
  if (quantity !== undefined && quantity !== oldQuantity) {
    if (isNaN(quantity) || quantity < 1) {
      return next(new AppError('Quantity must be a positive number', 400));
    }

    quantityDifference = quantity - oldQuantity;
    holding.quantity = quantity;

    // Create transaction for quantity change
    // If positive difference = BUY, if negative = SELL
    const transactionType = quantityDifference > 0 ? 'BUY' : 'SELL';
    const transactionQuantity = Math.abs(quantityDifference);
    const transactionPrice = purchasePrice !== undefined ? purchasePrice : holding.purchasePrice;

    // Use today's date for the transaction (when the action happens)
    const transactionDate = new Date();

    await Transaction.create({
      userId: req.user.id,
      symbol: holding.symbol,
      type: transactionType,
      quantity: transactionQuantity,
      pricePerShare: transactionPrice,
      totalValue: transactionQuantity * transactionPrice,
      date: transactionDate
    });
  }

  // Update price only if provided and no quantity change (correcting mistake)
  if (purchasePrice !== undefined) {
    if (isNaN(purchasePrice) || purchasePrice < 0) {
      return next(new AppError('Purchase price must be a positive number', 400));
    }
    holding.purchasePrice = purchasePrice;
  }

  // Only update purchaseDate if it's explicitly changed AND quantity is NOT being changed
  // This prevents changing purchase date when selling
  if (purchaseDate !== undefined && quantityDifference === 0) {
    holding.purchaseDate = new Date(purchaseDate);
  }

  await holding.save();

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

  // Get current live price for the SELL transaction
  const currentPrice = await StockPriceService.getStockPrice(holding.symbol);

  // Create SELL transaction for all shares at current price
  await Transaction.create({
    userId: req.user.id,
    symbol: holding.symbol,
    type: 'SELL',
    quantity: holding.quantity,
    pricePerShare: currentPrice,
    totalValue: holding.quantity * currentPrice,
    date: new Date()
  });

  // Delete holding
  await Holding.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Holding deleted successfully'
  });
});

/**
 * Bulk create holdings
 * POST /api/holdings/bulk
 */
export const bulkCreateHoldings = catchAsync(async (req, res, next) => {
  const { holdings } = req.body;

  // Validate input
  if (!Array.isArray(holdings) || holdings.length === 0) {
    return next(new AppError('Please provide an array of holdings to import', 400));
  }

  if (holdings.length > 100) {
    return next(new AppError('Cannot import more than 100 holdings at once', 400));
  }

  const createdHoldings = [];
  const errors = [];
  const duplicates = [];
  let successCount = 0;

  // Check for duplicates and create holdings
  for (let i = 0; i < holdings.length; i++) {
    const holding = holdings[i];
    const rowIndex = i + 1;

    try {
      // Validate required fields
      if (!holding.symbol || !holding.purchasePrice || !holding.quantity || !holding.purchaseDate) {
        errors.push(`Row ${rowIndex}: Missing required fields (symbol, quantity, purchasePrice, purchaseDate)`);
        continue;
      }

      // Validate data types
      if (isNaN(holding.quantity) || holding.quantity < 1) {
        errors.push(`Row ${rowIndex}: Quantity must be a positive number`);
        continue;
      }

      if (isNaN(holding.purchasePrice) || holding.purchasePrice <= 0) {
        errors.push(`Row ${rowIndex}: Purchase price must be a positive number`);
        continue;
      }

      const symbol = holding.symbol.toString().trim().toUpperCase();
      const quantity = parseInt(holding.quantity);
      const purchasePrice = parseFloat(holding.purchasePrice);
      const purchaseDate = new Date(holding.purchaseDate);

      // Validate date
      if (isNaN(purchaseDate.getTime())) {
        errors.push(`Row ${rowIndex}: Invalid date format`);
        continue;
      }

      // Check if holding already exists for this user and symbol
      const existingHolding = await Holding.findOne({
        userId: req.user.id,
        symbol
      });

      if (existingHolding) {
        duplicates.push(symbol);
        continue;
      }

      // Create holding
      const newHolding = await Holding.create({
        userId: req.user.id,
        symbol,
        purchasePrice,
        quantity,
        purchaseDate
      });

      // Create corresponding BUY transaction
      await Transaction.create({
        userId: req.user.id,
        symbol,
        type: 'BUY',
        quantity,
        pricePerShare: purchasePrice,
        totalValue: quantity * purchasePrice,
        date: purchaseDate
      });

      createdHoldings.push(newHolding);
      successCount++;
    } catch (error) {
      errors.push(`Row ${rowIndex}: ${error.message}`);
    }
  }

  res.status(201).json({
    success: true,
    message: `Imported ${successCount} holdings successfully`,
    data: {
      holdings: createdHoldings,
      summary: {
        imported: successCount,
        duplicates: duplicates.length,
        errors: errors.length,
        skipped: duplicates.concat(errors.map(e => e.split(':')[0])).length,
        details: {
          duplicateSymbols: duplicates,
          errorMessages: errors
        }
      }
    }
  });
});

/**
 * Import holdings from Google Sheets
 * GET /api/holdings/import/sheets?sheetId=SHEET_ID
 */
export const importFromGoogleSheets = catchAsync(async (req, res, next) => {
  const { sheetId } = req.query;

  if (!sheetId) {
    return next(new AppError('Sheet ID is required', 400));
  }

  try {
    // Construct Google Sheets CSV export URL (public sheet)
    // gid=0 specifies the first sheet tab
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

    // Fetch the CSV data with proper headers
    const response = await axios.get(csvUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const csvData = response.data;

    // Parse CSV manually (simple parser for basic CSV)
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return next(new AppError('Sheet is empty or has no data rows', 400));
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const symbolIndex = header.findIndex(h => h.includes('symbol') || h === 's');
    const quantityIndex = header.findIndex(h => h.includes('quantity') || h === 'qty' || h === 'q');
    const priceIndex = header.findIndex(h => h.includes('price') || h.includes('cost') || h === 'p');
    const dateIndex = header.findIndex(h => h.includes('date') || h === 'd');

    if (symbolIndex === -1 || quantityIndex === -1 || priceIndex === -1 || dateIndex === -1) {
      return next(new AppError('Sheet must contain columns: symbol, quantity, purchasePrice, purchaseDate', 400));
    }

    // Parse data rows
    const holdings = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',').map(cell => cell.trim());
      if (!cells[symbolIndex] || !cells[quantityIndex] || !cells[priceIndex] || !cells[dateIndex]) {
        continue; // Skip incomplete rows
      }

      holdings.push({
        symbol: cells[symbolIndex],
        quantity: parseInt(cells[quantityIndex]),
        purchasePrice: parseFloat(cells[priceIndex]),
        purchaseDate: cells[dateIndex]
      });
    }

    if (holdings.length === 0) {
      return next(new AppError('No valid data found in sheet', 400));
    }

    res.status(200).json({
      success: true,
      message: `Loaded ${holdings.length} holdings from Google Sheet`,
      data: {
        holdings
      }
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return next(new AppError('Sheet not found. Make sure it\'s publicly shared.', 404));
    }
    return next(new AppError('Failed to fetch Google Sheet. Make sure it\'s publicly shared.', 400));
  }
});
