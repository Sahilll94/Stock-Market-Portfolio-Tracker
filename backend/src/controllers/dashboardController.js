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

  // Get all transactions for this user
  const allTransactions = await Transaction.find({
    userId: req.user.id
  }).sort({ date: 1 });

  if (!allTransactions || allTransactions.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        performance: []
      }
    });
  }

  // Calculate the cutoff date
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Filter transactions within the last N days
  const relevantTransactions = allTransactions.filter(t => t.date >= cutoffDate);

  if (relevantTransactions.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        performance: []
      }
    });
  }

  // Calculate portfolio state BEFORE the cutoff (from all previous transactions)
  const portfolioStateBeforeCutoff = {};
  const costBasisBeforeCutoff = {};

  allTransactions.forEach((t) => {
    if (t.date < cutoffDate) {
      if (t.type === 'BUY') {
        portfolioStateBeforeCutoff[t.symbol] = (portfolioStateBeforeCutoff[t.symbol] || 0) + t.quantity;
        costBasisBeforeCutoff[t.symbol] = (costBasisBeforeCutoff[t.symbol] || 0) + t.totalValue;
      } else {
        portfolioStateBeforeCutoff[t.symbol] = (portfolioStateBeforeCutoff[t.symbol] || 0) - t.quantity;
        costBasisBeforeCutoff[t.symbol] = (costBasisBeforeCutoff[t.symbol] || 0) - t.totalValue;
      }
    }
  });

  // Calculate total investment BEFORE cutoff
  const investmentBeforeCutoff = Object.values(costBasisBeforeCutoff).reduce((sum, val) => sum + val, 0);

  // Now build the performance timeline for the last N days
  const performanceByDate = {};
  
  // Start with the portfolio state from before cutoff
  let currentPortfolioState = { ...portfolioStateBeforeCutoff };
  let currentCostBasis = { ...costBasisBeforeCutoff };
  let currentInvestment = investmentBeforeCutoff;

  // Process each transaction in the relevant period
  relevantTransactions.forEach((t) => {
    // Format date using local time (not UTC) to preserve the date as entered by user
    const year = t.date.getFullYear();
    const month = String(t.date.getMonth() + 1).padStart(2, '0');
    const day = String(t.date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    // Update portfolio state with this transaction
    if (t.type === 'BUY') {
      currentPortfolioState[t.symbol] = (currentPortfolioState[t.symbol] || 0) + t.quantity;
      currentCostBasis[t.symbol] = (currentCostBasis[t.symbol] || 0) + t.totalValue;
      currentInvestment += t.totalValue;
    } else {
      currentPortfolioState[t.symbol] = (currentPortfolioState[t.symbol] || 0) - t.quantity;
      currentCostBasis[t.symbol] = (currentCostBasis[t.symbol] || 0) - t.totalValue;
      currentInvestment -= t.totalValue;
    }

    // Calculate portfolio value at this point
    let totalValue = 0;
    Object.keys(currentPortfolioState).forEach((symbol) => {
      const quantity = currentPortfolioState[symbol];
      const totalCost = currentCostBasis[symbol] || 0;
      
      if (quantity > 0 && totalCost > 0) {
        const avgCostPerShare = totalCost / quantity;
        totalValue += quantity * avgCostPerShare;
      }
    });

    // Store the data point for this transaction date
    performanceByDate[dateKey] = {
      date: dateKey,
      totalInvested: currentInvestment,
      totalValue: totalValue
    };
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
