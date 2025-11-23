import { useHoldingsStore } from '../stores/holdingsStore';

export const useHoldings = () => {
  const { holdings, summary, isLoading, error, setHoldings, setSummary, setLoading, setError } =
    useHoldingsStore();

  return {
    holdings,
    summary,
    isLoading,
    error,
    setHoldings,
    setSummary,
    setLoading,
    setError,
  };
};
