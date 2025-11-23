import Holding from '../models/Holding.js';
import Transaction from '../models/Transaction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import StockPriceService from '../services/StockPriceService.js';

/**
 * Get dashboard summary
 * GET /api/dashboard/summary
 */
export const getDashboardSummary = catchAsync(async (req, res, next) => {
  const holdings = await Holding.find({ userId: req.user.id });

  if (!holdings || holdings.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalInvested: 0,
          currentPortfolioValue: 0,
          totalProfitLoss: 0,
          totalProfitLossPercentage: 0,
          numberOfHoldings: 0
        },
        bestPerformer: null,
        worstPerformer: null,
        topHoldings: []
      }
    });
  }

  // Get unique symbols
  const symbols = [...new Set(holdings.map((h) => h.symbol))];

  // Fetch current prices
  const prices = await StockPriceService.getMultiplePrices(symbols);

  // Calculate P&L for each holding
  let totalInvested = 0;
  let currentValue = 0;
  let bestPerformer = null;
  let worstPerformer = null;
  let bestPerformancePercent = -Infinity;
  let worstPerformancePercent = Infinity;

  const holdingsWithMetrics = holdings.map((holding) => {
    const currentPrice = prices[holding.symbol];
    const investedAmount = holding.purchasePrice * holding.quantity;
    const currentHoldingValue = currentPrice * holding.quantity;
    const profitLoss = currentHoldingValue - investedAmount;
    const profitLossPercentage = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

    totalInvested += investedAmount;
    currentValue += currentHoldingValue;

    // Track best and worst performers
    if (profitLossPercentage > bestPerformancePercent) {
      bestPerformancePercent = profitLossPercentage;
      bestPerformer = {
        symbol: holding.symbol,
        profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2))
      };
    }

    if (profitLossPercentage < worstPerformancePercent) {
      worstPerformancePercent = profitLossPercentage;
      worstPerformer = {
        symbol: holding.symbol,
        profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2))
      };
    }

    return {
      symbol: holding.symbol,
      currentPrice,
      quantity: holding.quantity,
      investedAmount,
      currentHoldingValue,
      profitLoss: parseFloat(profitLoss.toFixed(2)),
      profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)),
      percentageOfPortfolio: 0 // Will calculate below
    };
  });

  // Calculate percentage of portfolio for each holding
  const holdingsWithPercentage = holdingsWithMetrics.map((h) => ({
    ...h,
    percentageOfPortfolio: currentValue > 0 ? parseFloat(((h.currentHoldingValue / currentValue) * 100).toFixed(2)) : 0
  }));

  // Sort by portfolio percentage and get top 5
  const topHoldings = holdingsWithPercentage
    .sort((a, b) => b.currentHoldingValue - a.currentHoldingValue)
    .slice(0, 5);

  const totalProfitLoss = currentValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentPortfolioValue: parseFloat(currentValue.toFixed(2)),
        totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
        totalProfitLossPercentage: parseFloat(totalProfitLossPercentage),
        numberOfHoldings: holdings.length
      },
      lastUpdatedAt: new Date().toISOString(),
      bestPerformer,
      worstPerformer,
      topHoldings
    }
  });
});

/**
 * Get portfolio distribution for charts
 * GET /api/dashboard/distribution
 */
export const getPortfolioDistribution = catchAsync(async (req, res, next) => {
  const holdings = await Holding.find({ userId: req.user.id });

  if (!holdings || holdings.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        distribution: []
      }
    });
  }

  // Get unique symbols
  const symbols = [...new Set(holdings.map((h) => h.symbol))];

  // Fetch current prices
  const prices = await StockPriceService.getMultiplePrices(symbols);

  // Calculate distribution
  let totalValue = 0;
  const distribution = [];

  holdings.forEach((holding) => {
    const currentPrice = prices[holding.symbol];
    const currentHoldingValue = currentPrice * holding.quantity;
    totalValue += currentHoldingValue;

    const existing = distribution.find((d) => d.symbol === holding.symbol);
    if (existing) {
      existing.value += currentHoldingValue;
      existing.quantity += holding.quantity;
    } else {
      distribution.push({
        symbol: holding.symbol,
        value: currentHoldingValue,
        quantity: holding.quantity
      });
    }
  });

  // Calculate percentages
  const distributionWithPercentage = distribution.map((d) => ({
    ...d,
    percentage: totalValue > 0 ? parseFloat(((d.value / totalValue) * 100).toFixed(2)) : 0,
    value: parseFloat(d.value.toFixed(2))
  }));

  res.status(200).json({
    success: true,
    data: {
      distribution: distributionWithPercentage,
      totalValue: parseFloat(totalValue.toFixed(2))
    }
  });
});

/**
 * Get portfolio performance over time
 * GET /api/dashboard/performance
 */
export const getPortfolioPerformance = catchAsync(async (req, res, next) => {
  const { days = 30 } = req.query;

  const transactions = await Transaction.find({
    userId: req.user.id,
    date: {
      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }
  }).sort({ date: 1 });

  if (!transactions || transactions.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        performance: []
      }
    });
  }

  // Get all holdings for current price calculation
  const holdings = await Holding.find({ userId: req.user.id });
  
  // Fetch current prices for all unique symbols
  const symbols = [...new Set(holdings.map((h) => h.symbol))];
  const holdingsMap = await StockPriceService.getMultiplePrices(symbols);

  // Group by date and calculate cumulative investment and value
  const performanceByDate = {};
  const portfolioState = {}; // Track quantity of each stock by date

  transactions.forEach((t) => {
    const dateKey = t.date.toISOString().split('T')[0];

    if (!performanceByDate[dateKey]) {
      performanceByDate[dateKey] = {
        date: dateKey,
        totalInvested: 0,
        totalValue: 0
      };
    }

    if (t.type === 'BUY') {
      performanceByDate[dateKey].totalInvested += t.totalValue;
      portfolioState[t.symbol] = (portfolioState[t.symbol] || 0) + t.quantity;
    } else {
      performanceByDate[dateKey].totalInvested -= t.totalValue;
      portfolioState[t.symbol] = (portfolioState[t.symbol] || 0) - t.quantity;
    }

    // Calculate current value based on portfolio state at this date
    let currentValue = 0;
    Object.keys(portfolioState).forEach((symbol) => {
      const quantity = portfolioState[symbol];
      const currentPrice = holdingsMap[symbol] || 0;
      currentValue += quantity * currentPrice;
    });
    performanceByDate[dateKey].totalValue = currentValue;
  });

  const performance = Object.values(performanceByDate).map((p) => ({
    date: p.date,
    totalInvested: parseFloat(p.totalInvested.toFixed(2)),
    totalValue: parseFloat(p.totalValue.toFixed(2))
  }));

  res.status(200).json({
    success: true,
    data: {
      performance,
      period: `${days} days`
    }
  });
});
