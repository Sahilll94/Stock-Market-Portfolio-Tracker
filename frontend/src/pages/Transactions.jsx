import { useEffect, useState, useCallback } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionsList from '../components/Transactions/TransactionsList';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../contexts/ThemeContext';
import transactionsService from '../services/transactionsService';
import toast from 'react-hot-toast';
import { RotateCcw, History } from 'lucide-react';

export default function Transactions() {
  const { transactions, setTransactions } = useTransactions();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    symbol: '',
    type: '',
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionsService.getAll({
        symbol: filters.symbol || undefined,
        type: filters.type || undefined,
      });
      if (response.data.success) {
        setTransactions(response.data.data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters, setTransactions]);

  const handleSymbolSearch = (e) => {
    if (e.key === 'Enter') {
      setFilters({ ...filters, symbol: inputValue.toUpperCase() });
    }
  };

  const handleTypeFilter = (e) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleClearFilters = () => {
    setInputValue('');
    setFilters({ symbol: '', type: '' });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header - Minimalist style matching Dashboard */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Transactions
          </h1>
          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Track all your buy and sell transactions
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className={`p-2.5 rounded-lg transition-all duration-300 group ${
            isDark
              ? 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Refresh transactions"
        >
          <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Filters */}
      <TransactionFilters
        inputValue={inputValue}
        setInputValue={setInputValue}
        filters={filters}
        onSymbolSearch={handleSymbolSearch}
        onTypeFilter={handleTypeFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Transactions List */}
      <TransactionsList transactions={transactions} />
    </MainLayout>
  );
}
