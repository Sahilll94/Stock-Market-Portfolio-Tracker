import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const stockService = {
  /**
   * Get real-time data for a single stock
   * @param {string} symbol - Stock symbol (e.g., AAPL)
   * @returns {Promise<Object>} Stock data
   */
  getRealtimeData: async (symbol) => {
    try {
      const response = await axios.get(`${API_URL}/stocks/realtime/${symbol}`, {
        timeout: 10000
      });
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch stock data for ${symbol}:`, error.message);
      throw error;
    }
  },

  /**
   * Get real-time data for multiple stocks
   * @param {string[]} symbols - Array of stock symbols
   * @returns {Promise<Object[]>} Array of stock data
   */
  getMultipleStocks: async (symbols) => {
    try {
      const symbolString = symbols.join(',');
      console.log('Fetching stocks:', symbolString);
      
      const response = await axios.get(`${API_URL}/stocks/multiple`, {
        params: { symbols: symbolString },
        timeout: 15000
      });
      
      console.log('Stock data response:', response.data);
      
      if (!response.data.data || response.data.data.length === 0) {
        console.warn('No stock data returned from API');
        return [];
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch multiple stocks data:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
};

export default stockService;
