import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function HoldingsList({ holdings = [], onEdit, onDelete, onAdd }) {
  const { isDark } = useTheme();
  const [sortBy, setSortBy] = useState('value');

  // Ensure holdings is an array
  const holdingsArray = Array.isArray(holdings) ? holdings : [];

  const sortedHoldings = [...holdingsArray].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return (b.currentHoldingValue || 0) - (a.currentHoldingValue || 0);
      case 'profit':
        return (b.profitLoss || 0) - (a.profitLoss || 0);
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  if (holdingsArray.length === 0) {
    return (
      <div className={`relative rounded-xl p-12 text-center transition-all duration-300 border-2 ${isDark ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-blue-500/30' : 'bg-gradient-to-br from-blue-50/50 to-gray-50/50 border-blue-200/30 hover:border-blue-300/50'}`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl ${isDark ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
          <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 blur-3xl ${isDark ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full transition-all duration-300 ${isDark ? 'bg-blue-500/15 group-hover:bg-blue-500/25' : 'bg-blue-100 group-hover:bg-blue-150'}`}>
              <div className="animate-bounce" style={{animationDuration: '2s'}}>
                <Plus size={48} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h3 className={`text-2xl font-bold mb-3 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Start Your Journey
          </h3>

          {/* Description */}
          <p className={`text-base mb-2 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your portfolio is empty. Let's add your first holding to get started!
          </p>
          <p className={`text-sm mb-8 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Track your investments and monitor your portfolio performance in real-time.
          </p>

          {/* CTA Button */}
          <button 
            onClick={onAdd}
            className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 group hover:scale-105 active:scale-95 ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'}`}
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Your First Holding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls - Minimalist */}
      <div className="mb-6 flex items-center justify-between">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`text-sm px-3 py-2 border-b-2 transition-colors font-medium ${
            isDark
              ? 'bg-transparent border-gray-700 text-gray-300 hover:border-gray-600'
              : 'bg-transparent border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <option value="value">Sort by Value</option>
          <option value="profit">Sort by P&L</option>
          <option value="symbol">Sort by Symbol</option>
        </select>
      </div>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b transition-colors ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className={`text-left py-3 px-0 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Symbol
              </th>
              <th className={`text-right py-3 px-4 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Quantity
              </th>
              <th className={`text-right py-3 px-4 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Purchase Price
              </th>
              <th className={`text-right py-3 px-4 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Current Price
              </th>
              <th className={`text-right py-3 px-4 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Value
              </th>
              <th className={`text-right py-3 px-4 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Profit/Loss
              </th>
              <th className={`text-center py-3 px-4 font-semibold uppercase text-xs tracking-wide transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHoldings.map((holding) => {
              const profitLoss = (holding.currentHoldingValue || 0) - (holding.investedAmount || 0);
              const profitLossPercent =
                holding.investedAmount > 0
                  ? ((profitLoss / holding.investedAmount) * 100).toFixed(2)
                  : 0;
              const isPositive = profitLoss >= 0;

              return (
                <tr
                  key={holding._id}
                  className={`border-b transition-all duration-300 ${
                    isDark
                      ? 'border-gray-800 hover:bg-gray-800/50'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-0">
                    <span className={`font-semibold text-base transition-colors ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{holding.symbol}</span>
                  </td>
                  <td className={`text-right py-4 px-4 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{holding.quantity}</td>
                  <td className={`text-right py-4 px-4 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatCurrency(holding.purchasePrice)}
                  </td>
                  <td className={`text-right py-4 px-4 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatCurrency(holding.currentPrice || 0)}
                  </td>
                  <td className={`text-right py-4 px-4 font-semibold transition-colors ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {formatCurrency(holding.currentHoldingValue || 0)}
                  </td>
                  <td
                    className={`text-right py-4 px-4 font-semibold transition-colors ${
                      isPositive ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')
                    }`}
                  >
                    {formatCurrency(profitLoss)} <span className="text-xs">({profitLossPercent}%)</span>
                  </td>
                  <td className="text-center py-4 px-4 space-x-2 flex justify-center">
                    <button
                      onClick={() => onEdit(holding)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        isDark
                          ? 'text-blue-400 hover:bg-blue-500/10'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(holding._id)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        isDark
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="md:hidden space-y-4">
        {sortedHoldings.map((holding) => {
          const profitLoss = (holding.currentHoldingValue || 0) - (holding.investedAmount || 0);
          const profitLossPercent =
            holding.investedAmount > 0
              ? ((profitLoss / holding.investedAmount) * 100).toFixed(2)
              : 0;
          const isPositive = profitLoss >= 0;

          return (
            <div key={holding._id} className={`border-b-2 pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-semibold text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{holding.symbol}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(holding)}
                    className={`p-2 rounded transition-all duration-300 hover:scale-110 ${isDark ? 'text-blue-400 hover:bg-blue-500/10' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(holding._id)}
                    className={`p-2 rounded transition-all duration-300 hover:scale-110 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Quantity</p>
                  <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{holding.quantity}</p>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Current Value</p>
                  <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {formatCurrency(holding.currentHoldingValue || 0)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Avg Price</p>
                  <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {formatCurrency(holding.purchasePrice)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${isPositive ? (isDark ? 'text-green-500' : 'text-green-600') : (isDark ? 'text-red-500' : 'text-red-600')}`}>
                    P&L
                  </p>
                  <p
                    className={`font-semibold ${isPositive ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}
                  >
                    {formatCurrency(profitLoss)} ({profitLossPercent}%)
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
