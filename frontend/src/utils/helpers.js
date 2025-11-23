export const calculateProfitLoss = (currentPrice, purchasePrice, quantity) => {
  const profitLoss = (currentPrice - purchasePrice) * quantity;
  const percentage = ((currentPrice - purchasePrice) / purchasePrice) * 100;
  return { profitLoss, percentage };
};

export const calculatePortfolioValue = (holdings) => {
  return holdings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);
};

export const calculateTotalInvested = (holdings) => {
  return holdings.reduce((sum, h) => sum + (h.purchasePrice * h.quantity), 0);
};

export const sortByProfitLoss = (holdings) => {
  return [...holdings].sort((a, b) => {
    const pl_a = (a.currentPrice - a.purchasePrice) * a.quantity;
    const pl_b = (b.currentPrice - b.purchasePrice) * b.quantity;
    return pl_b - pl_a;
  });
};
