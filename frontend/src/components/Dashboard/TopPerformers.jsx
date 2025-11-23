import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TopPerformers({ holdings = [] }) {
  const { isDark } = useTheme();
  const holdingsArray = Array.isArray(holdings) ? holdings : [];

  // Calculate performance for each holding
  const performanceData = holdingsArray.map((holding) => {
    const profitLoss = (holding.currentHoldingValue || 0) - (holding.investedAmount || 0);
    const profitLossPercent =
      holding.investedAmount > 0
        ? ((profitLoss / holding.investedAmount) * 100).toFixed(2)
        : 0;
    return {
      ...holding,
      profitLoss,
      profitLossPercent,
      isPositive: profitLoss >= 0,
    };
  });

  // Sort by performance percentage
  const sorted = [...performanceData].sort((a, b) => b.profitLossPercent - a.profitLossPercent);

  const bestPerformer = sorted[0];
  const worstPerformer = sorted[sorted.length - 1];

  if (holdingsArray.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Best Performing */}
      {bestPerformer && (
        <div className={`rounded-lg border p-4 transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Best Performing
              </p>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg transition-colors ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {bestPerformer.symbol}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded ${isDark ? 'bg-green-500/15' : 'bg-green-50'}`}>
                  <TrendingUp size={14} className={isDark ? 'text-green-400' : 'text-green-600'} />
                  <span className={`text-xs font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    +{bestPerformer.profitLossPercent}%
                  </span>
                </div>
              </div>
              <p className={`text-xs mt-2 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {formatCurrency(bestPerformer.profitLoss)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <TrendingUp size={24} className={isDark ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>
        </div>
      )}

      {/* Worst Performing */}
      {worstPerformer && (
        <div className={`rounded-lg border p-4 transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Worst Performing
              </p>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg transition-colors ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {worstPerformer.symbol}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded ${worstPerformer.isPositive ? (isDark ? 'bg-green-500/15' : 'bg-green-50') : (isDark ? 'bg-red-500/15' : 'bg-red-50')}`}>
                  {worstPerformer.isPositive ? (
                    <TrendingUp size={14} className={isDark ? 'text-green-400' : 'text-green-600'} />
                  ) : (
                    <TrendingDown size={14} className={isDark ? 'text-red-400' : 'text-red-600'} />
                  )}
                  <span className={`text-xs font-bold ${worstPerformer.isPositive ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                    {worstPerformer.isPositive ? '+' : ''}{worstPerformer.profitLossPercent}%
                  </span>
                </div>
              </div>
              <p className={`text-xs mt-2 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {formatCurrency(worstPerformer.profitLoss)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${worstPerformer.isPositive ? (isDark ? 'bg-green-500/10' : 'bg-green-50') : (isDark ? 'bg-red-500/10' : 'bg-red-50')}`}>
              {worstPerformer.isPositive ? (
                <TrendingUp size={24} className={isDark ? 'text-green-400' : 'text-green-600'} />
              ) : (
                <TrendingDown size={24} className={isDark ? 'text-red-400' : 'text-red-600'} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
