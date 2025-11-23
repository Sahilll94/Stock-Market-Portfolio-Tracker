import { useTransactionsStore } from '../stores/transactionsStore';

export const useTransactions = () => {
  const { transactions, summary, isLoading, error, setTransactions, setSummary, setLoading, setError } =
    useTransactionsStore();

  return {
    transactions,
    summary,
    isLoading,
    error,
    setTransactions,
    setSummary,
    setLoading,
    setError,
  };
};
