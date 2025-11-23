import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// Cache for storing stock data to minimize API calls
const stockCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// Simple rate limiter for API calls
let lastRequestTime = 0;
const REQUEST_DELAY = 500; // 500ms between requests to stay within rate limits

/**
 * Wait for rate limit delay
 */
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
};

/**
 * Get cached stock data if available and not expired
 */
const getCachedData = (symbol) => {
  const cached = stockCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  stockCache.delete(symbol);
  return null;
};

/**
 * Cache stock data
 */
const setCachedData = (symbol, data) => {
  stockCache.set(symbol, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Get real-time stock data from TwelveData API
 * GET /api/stocks/realtime/:symbol
 */
export const getRealtimeStockData = catchAsync(async (req, res, next) => {
  const { symbol } = req.params;

  if (!symbol) {
    return next(new AppError('Stock symbol is required', 400));
  }

  const upperSymbol = symbol.toUpperCase();

  // Check cache first
  const cachedData = getCachedData(upperSymbol);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      data: cachedData,
      cached: true
    });
  }

  try {
    // Wait for rate limit
    await waitForRateLimit();

    const response = await axios.get(`${process.env.TWELVEDATA_BASE_URL}/time_series`, {
      params: {
        symbol: upperSymbol,
        interval: '1min',
        timezone: 'Asia/Kolkata',
        apikey: process.env.TWELVEDATA_API_KEY
      },
      timeout: 10000
    });

    if (response.data.status !== 'ok' || !response.data.values || response.data.values.length === 0) {
      return next(new AppError(`No data found for symbol ${symbol}`, 404));
    }

    const latestData = response.data.values[0];
    const stockData = {
      symbol: response.data.meta.symbol,
      interval: response.data.meta.interval,
      currency: response.data.meta.currency,
      exchange: response.data.meta.exchange,
      datetime: latestData.datetime,
      open: parseFloat(latestData.open),
      high: parseFloat(latestData.high),
      low: parseFloat(latestData.low),
      close: parseFloat(latestData.close),
      volume: parseInt(latestData.volume)
    };

    // Cache the data
    setCachedData(upperSymbol, stockData);

    res.status(200).json({
      success: true,
      data: stockData,
      cached: false
    });
  } catch (error) {
    console.error(`Error fetching stock data for ${upperSymbol}:`, error.message);
    if (error.response?.data?.status === 'error') {
      return next(new AppError(`TwelveData API Error: ${error.response.data.message}`, 400));
    }
    return next(new AppError(`Failed to fetch stock data: ${error.message}`, 500));
  }
});

/**
 * Get real-time data for multiple stocks
 * GET /api/stocks/multiple?symbols=AAPL,GOOGL,MSFT
 */
export const getMultipleStocksData = catchAsync(async (req, res, next) => {
  const { symbols } = req.query;

  if (!symbols) {
    return next(new AppError('Symbols parameter is required (comma-separated)', 400));
  }

  const symbolArray = symbols.split(',').map((s) => s.trim().toUpperCase()).filter((s) => s.length > 0);

  if (symbolArray.length === 0) {
    return next(new AppError('At least one symbol is required', 400));
  }

  // Limit to 2 symbols per request to stay within API rate limits (8 credits/minute)
  const MAX_SYMBOLS_PER_REQUEST = 2;
  if (symbolArray.length > MAX_SYMBOLS_PER_REQUEST) {
    return res.status(200).json({
      success: true,
      data: [],
      message: `Maximum ${MAX_SYMBOLS_PER_REQUEST} symbols allowed per request to stay within API rate limits. Please make separate requests.`,
      maxSymbolsPerRequest: MAX_SYMBOLS_PER_REQUEST
    });
  }

  try {
    const results = [];
    const failedSymbols = [];

    // Process symbols sequentially with rate limiting to avoid exceeding API quota
    for (const symbol of symbolArray) {
      // Check cache first
      const cachedData = getCachedData(symbol);
      if (cachedData) {
        console.log(`Retrieved ${symbol} from cache`);
        results.push({
          ...cachedData,
          cached: true
        });
        continue;
      }

      try {
        // Wait for rate limit before API call
        await waitForRateLimit();

        console.log(`Fetching fresh data for ${symbol}...`);
        const response = await axios.get(`${process.env.TWELVEDATA_BASE_URL}/time_series`, {
          params: {
            symbol: symbol,
            interval: '1min',
            timezone: 'Asia/Kolkata',
            apikey: process.env.TWELVEDATA_API_KEY
          },
          timeout: 10000
        });

        if (response.data.status !== 'ok') {
          console.warn(`TwelveData API error for ${symbol}:`, response.data.message || 'Unknown error');
          failedSymbols.push(symbol);
          continue;
        }

        if (!response.data.values || response.data.values.length === 0) {
          console.warn(`No data values for ${symbol}`);
          failedSymbols.push(symbol);
          continue;
        }

        const latestData = response.data.values[0];
        const stockData = {
          symbol: response.data.meta.symbol,
          currency: response.data.meta.currency,
          exchange: response.data.meta.exchange,
          datetime: latestData.datetime,
          open: parseFloat(latestData.open),
          high: parseFloat(latestData.high),
          low: parseFloat(latestData.low),
          close: parseFloat(latestData.close),
          volume: parseInt(latestData.volume),
          cached: false
        };

        // Cache the data
        setCachedData(symbol, stockData);
        results.push(stockData);
      } catch (error) {
        console.error(`Failed to fetch data for ${symbol}:`, error.response?.data?.message || error.message);
        failedSymbols.push(symbol);
      }
    }

    // Return results with partial data if some symbols succeeded
    res.status(200).json({
      success: true,
      data: results,
      failedSymbols: failedSymbols.length > 0 ? failedSymbols : undefined,
      cacheStatus: results.filter((r) => r.cached).length > 0 ? 'partial' : 'fresh'
    });
  } catch (error) {
    console.error('Multiple stocks fetch error:', error.message);
    return next(new AppError(`Failed to fetch multiple stocks data: ${error.message}`, 500));
  }
});
