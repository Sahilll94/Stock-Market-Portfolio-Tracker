import { useEffect, useState, useCallback } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionsList from '../components/Transactions/TransactionsList';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../contexts/ThemeContext';
import transactionsService from '../services/transactionsService';
import { exportTransactionsToCSV, exportTransactionsToPDF } from '../utils/exportUtils';
import toast from 'react-hot-toast';
import { RotateCcw, Download, FileText } from 'lucide-react';

export default function Transactions() {
  const { transactions, setTransactions } = useTransactions();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
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

  const handleExportCSV = async () => {
    try {
      if (transactions.length === 0) {
        toast.error('No transactions to export');
        return;
      }
      setIsExporting(true);
      exportTransactionsToCSV(transactions);
      toast.success('Transactions exported as CSV');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (transactions.length === 0) {
        toast.error('No transactions to export');
        return;
      }
      setIsExporting(true);
      const toastId = toast.loading('Generating PDF...');
      await exportTransactionsToPDF(transactions);
      toast.dismiss(toastId);
      toast.success('Transactions exported as PDF');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setIsExporting(false);
    }
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
        <div className="flex items-center gap-2">
          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting || transactions.length === 0}
            className={`p-2.5 rounded-lg transition-all duration-300 group ${
              isExporting || transactions.length === 0
                ? isDark
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
                : isDark
                  ? 'hover:bg-gray-700/50 text-green-400 hover:text-green-300'
                  : 'hover:bg-gray-100 text-green-600 hover:text-green-700'
            }`}
            title="Export as CSV"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting || transactions.length === 0}
            className={`p-2.5 rounded-lg transition-all duration-300 group ${
              isExporting || transactions.length === 0
                ? isDark
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
                : isDark
                  ? 'hover:bg-gray-700/50 text-red-400 hover:text-red-300'
                  : 'hover:bg-gray-100 text-red-600 hover:text-red-700'
            }`}
            title="Export as PDF"
          >
            <FileText size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          {/* Refresh Button */}
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
