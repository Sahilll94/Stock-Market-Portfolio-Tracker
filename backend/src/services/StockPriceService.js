import axios from 'axios';
import AppError from '../utils/AppError.js';
import PriceCache from '../models/PriceCache.js';

class StockPriceService {
  constructor() {
    this.apiKey = process.env.TWELVEDATA_API_KEY;
    this.baseURL = process.env.TWELVEDATA_BASE_URL || 'https://api.twelvedata.com';
    this.priceCache = new Map(); // In-memory cache for speed
    this.cacheDuration = 2 * 60 * 1000; // 2 minutes - longer cache to avoid rate limits
    this.requestQueue = []; // Queue to throttle API requests
    this.isProcessingQueue = false;
  }

  /**
   * Get current price for a stock symbol (REAL-TIME with Smart Rate-Limit Cache)
   * @param {string} symbol - Stock symbol (e.g., RELIANCE, TCS)
   * @returns {number} Current price
   */
  async getStockPrice(symbol) {
    try {
      symbol = symbol.toUpperCase();

      // Check in-memory cache first (fastest)
      const memCached = this.priceCache.get(symbol);
      if (memCached && Date.now() - memCached.timestamp < this.cacheDuration) {
        console.log(`⚡ Memory cache hit for ${symbol}: ₹${memCached.price}`);
        return memCached.price;
      }

      // Check database cache (persistent)
      const dbCached = await this.getDBCache(symbol);
      if (dbCached && Date.now() - new Date(dbCached.updatedAt).getTime() < this.cacheDuration) {
        console.log(`📦 Database cache hit for ${symbol}: ₹${dbCached.price} (${Math.round((Date.now() - new Date(dbCached.updatedAt).getTime()) / 1000)}s old)`);
        // Update memory cache
        this.priceCache.set(symbol, { price: dbCached.price, timestamp: Date.now() });
        return dbCached.price;
      }

      // Fetch from API with rate limiting
      console.log(`🌐 Fetching REAL-TIME price from API for ${symbol}...`);
      const price = await this.fetchFromAPIWithThrottle(symbol);

      // Update both caches
      this.priceCache.set(symbol, { price, timestamp: Date.now() });
      await this.setDBCache(symbol, price);

      return price;
    } catch (error) {
      console.error(`❌ Failed to fetch price for ${symbol}:`, error.message);
      // Try to return cached value even if old
      const dbCached = await this.getDBCache(symbol);
      if (dbCached) {
        console.log(`⚠️ Using old database cache for ${symbol}: ₹${dbCached.price}`);
        return dbCached.price;
      }
      throw new AppError(`Failed to fetch price for ${symbol}: ${error.message}`, 500);
    }
  }

  /**
   * Get prices for multiple symbols (REAL-TIME, NO CACHE)
   * @param {array} symbols - Array of stock symbols
   * @returns {object} Object with symbol as key and price as value
   */
  async getMultiplePrices(symbols) {
    try {
      // If no symbols, return empty object
      if (!symbols || symbols.length === 0) {
        return {};
      }

      const prices = {};

      // Fetch all prices in parallel with error handling for resilience
      const pricePromises = symbols.map(symbol => 
        this.getStockPrice(symbol)
          .then(price => {
            prices[symbol] = price;
            return { symbol, price, status: 'fulfilled' };
          })
          .catch(error => {
            console.warn(`⚠️ Failed to fetch price for ${symbol}:`, error.message);
            // Set to 0 as last resort if API fails
            prices[symbol] = 0;
            return { symbol, error, status: 'rejected' };
          })
      );

      await Promise.all(pricePromises);

      console.log(`✅ Successfully fetched REAL-TIME prices for ${Object.keys(prices).length} symbols:`, prices);
      return prices;
    } catch (error) {
      console.error(`❌ Error in getMultiplePrices: ${error.message}`);
      // Return empty object instead of throwing
      return {};
    }
  }

  /**
   * Fetch price from API with request throttling to avoid rate limits
   * @private
   * @param {string} symbol - Stock symbol
   * @returns {number} Current price
   */
  async fetchFromAPIWithThrottle(symbol) {
    return new Promise((resolve, reject) => {
      // Add request to queue
      this.requestQueue.push({ symbol, resolve, reject });
      // Process queue
      this.processRequestQueue();
    });
  }

  /**
   * Process queued API requests with throttling
   * @private
   */
  async processRequestQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const { symbol, resolve, reject } = this.requestQueue.shift();

      try {
        const price = await this.fetchFromAPI(symbol);
        resolve(price);
      } catch (error) {
        reject(error);
      }

      // Throttle: Wait 1 second between API requests to stay under rate limit
      if (this.requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Fetch price from API
   * @private
   * @param {string} symbol - Stock symbol
   * @returns {number} Current price
   */
  async fetchFromAPI(symbol) {
    try {
      console.log(`📡 Making API request for ${symbol}...`);
      
      const response = await axios.get(`${this.baseURL}/quote`, {
        params: {
          symbol: symbol,
          apikey: this.apiKey
        },
        timeout: 5000 // 5 second timeout
      });

      console.log(`API Response for ${symbol}:`, response.data);

      // TwelveData API returns data directly
      const data = response.data;
      
      // Handle potential API errors
      if (data.status === 'error' || data.code === 429) {
        throw new Error(`API Error: ${data.message || 'Rate limit or invalid request'}`);
      }

      // Check for valid price data
      let price;
      if (data.last_price !== undefined) {
        price = parseFloat(data.last_price);
      } else if (data.close !== undefined) {
        price = parseFloat(data.close);
      } else {
        throw new Error(`Invalid response from API for symbol ${symbol}: ${JSON.stringify(data)}`);
      }

      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price data for symbol ${symbol}: ${price}`);
      }

      console.log(`✅ Successfully fetched REAL-TIME price for ${symbol}: ₹${price}`);
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error.message);
      
      // If it's an axios timeout or network error, log it appropriately
      if (error.code === 'ECONNABORTED') {
        throw new Error(`API request timeout for ${symbol}`);
      }
      // If it's an axios error or API error, throw it
      throw error;
    }
  }

  /**
   * Get cached price from database
   * @private
   * @param {string} symbol - Stock symbol
   * @returns {object|null} Cached price object or null
   */
  async getDBCache(symbol) {
    try {
      const cached = await PriceCache.findOne({ symbol: symbol.toUpperCase() });
      return cached;
    } catch (error) {
      console.warn(`Failed to fetch cache from DB for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Save price to database cache
   * @private
   * @param {string} symbol - Stock symbol
   * @param {number} price - Stock price
   */
  async setDBCache(symbol, price) {
    try {
      await PriceCache.updateOne(
        { symbol: symbol.toUpperCase() },
        { symbol: symbol.toUpperCase(), price, updatedAt: new Date() },
        { upsert: true }
      );
    } catch (error) {
      console.warn(`Failed to save cache to DB for ${symbol}:`, error.message);
    }
  }

  /**
   * Clear expired cache entries
   * @private
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [symbol, data] of this.priceCache.entries()) {
      if (now - data.timestamp > this.cacheDuration) {
        this.priceCache.delete(symbol);
        console.log(`🗑️ Cleared expired cache for ${symbol}`);
      }
    }
  }

  /**
   * Manually clear cache for a symbol
   * @param {string} symbol - Optional. If provided, clears cache for this symbol
   */
  clearCache(symbol = null) {
    if (symbol) {
      this.priceCache.delete(symbol.toUpperCase());
      console.log(`🗑️ Cleared cache for ${symbol.toUpperCase()}`);
    } else {
      this.priceCache.clear();
      console.log(`🗑️ Cleared all price cache`);
    }
  }
}

export default new StockPriceService();
