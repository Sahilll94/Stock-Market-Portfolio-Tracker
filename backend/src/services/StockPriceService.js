import axios from 'axios';
import PriceCache from '../models/PriceCache.js';
import AppError from '../utils/AppError.js';

class StockPriceService {
  constructor() {
    this.apiKey = process.env.TWELVEDATA_API_KEY;
    this.baseURL = process.env.TWELVEDATA_BASE_URL || 'https://api.twelvedata.com';
    this.cacheExpireTime = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  /**
   * Get current price for a stock symbol
   * @param {string} symbol - Stock symbol (e.g., RELIANCE, TCS)
   * @returns {number} Current price
   */
  async getStockPrice(symbol) {
    try {
      symbol = symbol.toUpperCase();

      // Check cache first
      const cachedPrice = await this.getCachedPrice(symbol);
      if (cachedPrice !== null) {
        return cachedPrice;
      }

      // Fetch from API
      const price = await this.fetchFromAPI(symbol);

      // Save to cache
      await this.cachePrice(symbol, price);

      return price;
    } catch (error) {
      throw new AppError(`Failed to fetch price for ${symbol}: ${error.message}`, 500);
    }
  }

  /**
   * Get prices for multiple symbols
   * @param {array} symbols - Array of stock symbols
   * @returns {object} Object with symbol as key and price as value
   */
  async getMultiplePrices(symbols) {
    try {
      const prices = {};

      for (const symbol of symbols) {
        prices[symbol] = await this.getStockPrice(symbol);
      }

      return prices;
    } catch (error) {
      throw new AppError(`Failed to fetch multiple prices: ${error.message}`, 500);
    }
  }

  /**
   * Fetch price from API
   * @private
   * @param {string} symbol - Stock symbol
   * @returns {number} Current price
   */
  async fetchFromAPI(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/quote`, {
        params: {
          symbol: symbol,
          apikey: this.apiKey
        },
        timeout: 10000 // 10 second timeout
      });

      // TwelveData API returns data directly, not nested in response.data.data
      const data = response.data;
      
      if (!data || !data.close) {
        throw new Error(`Invalid response from API for symbol ${symbol}: ${JSON.stringify(data)}`);
      }

      const price = parseFloat(data.close);

      if (isNaN(price)) {
        throw new Error(`Invalid price data for symbol ${symbol}`);
      }

      return price;
    } catch (error) {
      // If it's an axios error or API error, throw it
      throw error;
    }
  }

  /**
   * Get cached price if not expired
   * @private
   * @param {string} symbol - Stock symbol
   * @returns {number|null} Cached price or null if not found/expired
   */
  async getCachedPrice(symbol) {
    try {
      const cached = await PriceCache.findOne({ symbol: symbol.toUpperCase() });

      if (cached) {
        const timeDiff = new Date().getTime() - new Date(cached.updatedAt).getTime();

        // Check if cache is still valid (1 hour)
        if (timeDiff < this.cacheExpireTime) {
          return cached.price;
        } else {
          // Delete expired cache
          await PriceCache.deleteOne({ symbol: symbol.toUpperCase() });
        }
      }

      return null;
    } catch (error) {
      // If cache lookup fails, return null and fetch from API
      return null;
    }
  }

  /**
   * Cache the price
   * @private
   * @param {string} symbol - Stock symbol
   * @param {number} price - Stock price
   */
  async cachePrice(symbol, price) {
    try {
      await PriceCache.updateOne(
        { symbol: symbol.toUpperCase() },
        { symbol: symbol.toUpperCase(), price, updatedAt: new Date() },
        { upsert: true }
      );
    } catch (error) {
      // If caching fails, continue without cache
      console.warn(`Failed to cache price for ${symbol}:`, error.message);
    }
  }

  /**
   * Clear cache for a symbol or all symbols
   * @param {string} symbol - Optional. If provided, only clears cache for this symbol
   */
  async clearCache(symbol = null) {
    try {
      if (symbol) {
        await PriceCache.deleteOne({ symbol: symbol.toUpperCase() });
      } else {
        await PriceCache.deleteMany({});
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error.message);
    }
  }
}

export default new StockPriceService();
