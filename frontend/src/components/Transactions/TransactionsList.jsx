import { format } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

export default function TransactionsList({ transactions = [] }) {
  const { isDark } = useTheme();
  const transactionsArray = Array.isArray(transactions) ? transactions : [];

  if (transactionsArray.length === 0) {
    return (
      <div
        className={`rounded-xl border p-8 text-center transition-all duration-300 ${
          isDark
            ? 'bg-gray-800/50 border-gray-700/30'
            : 'bg-white/50 border-gray-200'
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <History size={32} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          </div>
        </div>
        <p className={`font-semibold text-lg transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          No transactions yet
        </p>
        <p className={`mt-2 text-sm transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Your transactions will appear here once you add holdings.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      isDark
        ? 'bg-gray-800/50 border-gray-700/30'
        : 'bg-white/50 border-gray-200'
    }`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b transition-colors ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
              <th className={`text-left py-4 px-6 font-semibold text-xs uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Date & Time
              </th>
              <th className={`text-left py-4 px-6 font-semibold text-xs uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Symbol
              </th>
              <th className={`text-left py-4 px-6 font-semibold text-xs uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Type
              </th>
              <th className={`text-right py-4 px-6 font-semibold text-xs uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Quantity
              </th>
              <th className={`text-right py-4 px-6 font-semibold text-xs uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Price/Share
              </th>
              <th className={`text-right py-4 px-6 font-semibold text-xs uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionsArray.map((transaction, index) => {
              const isBuy = transaction.type === 'BUY';
              return (
                <tr
                  key={transaction._id}
                  className={`border-b transition-all duration-300 ${
                    index % 2 === 0
                      ? isDark ? 'bg-gray-800/20' : 'bg-gray-50/30'
                      : ''
                  } hover:${isDark ? 'bg-gray-700/30' : 'bg-blue-50/50'}`}
                >
                  <td className={`py-4 px-6 text-sm transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div>
                      <p className="font-medium">{format(new Date(transaction.date), 'dd MMM yyyy')}</p>
                      <p className="text-xs mt-0.5">{format(new Date(transaction.date), 'HH:mm:ss')}</p>
                    </div>
                  </td>
                  <td className={`py-4 px-6 font-semibold transition-colors ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {transaction.symbol}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      isBuy
                        ? isDark ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-green-100/60 text-green-700 border border-green-200/60'
                        : isDark ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-red-100/60 text-red-700 border border-red-200/60'
                    }`}>
                      {isBuy ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`text-right py-4 px-6 font-medium transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {transaction.quantity.toLocaleString('en-IN')}
                  </td>
                  <td className={`text-right py-4 px-6 text-sm transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatCurrency(transaction.pricePerShare)}
                  </td>
                  <td className={`text-right py-4 px-6 font-semibold transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {formatCurrency(transaction.quantity * transaction.pricePerShare)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {transactionsArray.map((transaction) => {
          const isBuy = transaction.type === 'BUY';
          return (
            <div 
              key={transaction._id} 
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isDark
                  ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
                  : 'bg-white/60 border-gray-200/60 hover:bg-white/80'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className={`font-bold text-lg transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {transaction.symbol}
                  </p>
                  <p className={`text-xs transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {format(new Date(transaction.date), 'dd MMM yyyy, HH:mm:ss')}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    isBuy
                      ? isDark ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-green-100/60 text-green-700 border border-green-200/60'
                      : isDark ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-red-100/60 text-red-700 border border-red-200/60'
                  }`}>
                    {isBuy ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {transaction.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`text-xs transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {transaction.quantity} @ {formatCurrency(transaction.pricePerShare)}
                  </p>
                  <p className={`font-bold text-sm transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {formatCurrency(transaction.quantity * transaction.pricePerShare)}
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
