export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.stocks.sahilfolio.live/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOLDINGS: '/holdings',
  TRANSACTIONS: '/transactions',
};

export const TRANSACTION_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
};

export const COLORS = {
  success: '#10b981',
  danger: '#ef4444',
  primary: '#0ea5e9',
  secondary: '#6b7280',
  warning: '#f59e0b',
};

export const CHART_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
