import { create } from 'zustand';

export const useHoldingsStore = create((set) => ({
  holdings: [],
  summary: null,
  isLoading: false,
  error: null,

  setHoldings: (holdings) => set({ holdings }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addHolding: (holding) =>
    set((state) => ({
      holdings: [...state.holdings, holding],
    })),

  updateHolding: (id, updated) =>
    set((state) => ({
      holdings: state.holdings.map((h) => (h._id === id ? updated : h)),
    })),

  deleteHolding: (id) =>
    set((state) => ({
      holdings: state.holdings.filter((h) => h._id !== id),
    })),

  clearHoldings: () => set({ holdings: [], summary: null }),
}));
