import { create } from 'zustand';

export const useTransactionsStore = create((set) => ({
  transactions: [],
  summary: null,
  isLoading: false,
  error: null,

  setTransactions: (transactions) => set({ transactions }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  clearTransactions: () => set({ transactions: [], summary: null }),
}));
