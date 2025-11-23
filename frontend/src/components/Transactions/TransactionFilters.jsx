import { memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, X } from 'lucide-react';

const TransactionFilters = memo(({
  inputValue,
  setInputValue,
  filters,
  onSymbolSearch,
  onTypeFilter,
  onClearFilters,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Symbol Search */}
        <div>
          <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Stock Symbol
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter symbol..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              onKeyPress={onSymbolSearch}
              className={`w-full px-3.5 py-2.5 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 text-sm ${
                isDark
                  ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:ring-blue-500/40 focus:border-blue-500/60'
                  : 'bg-white/60 border-gray-200/60 text-gray-900 placeholder-gray-400 focus:ring-blue-500/40 focus:border-blue-400/60'
              }`}
            />
            <Search size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Transaction Type
          </label>
          <select
            value={filters.type}
            onChange={onTypeFilter}
            className={`w-full px-3.5 py-2.5 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 text-sm font-medium ${
              isDark
                ? 'bg-gray-800/50 border-gray-700/50 text-white focus:ring-blue-500/40 focus:border-blue-500/60'
                : 'bg-white/60 border-gray-200/60 text-gray-900 focus:ring-blue-500/40 focus:border-blue-400/60'
            }`}
          >
            <option value="">All Types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>

        {/* Clear Button */}
        <div>
          <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &nbsp;
          </label>
          <button
            onClick={onClearFilters}
            className={`w-full px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group border ${
              isDark
                ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 border-gray-700/50 hover:border-gray-600/50'
                : 'bg-white/60 hover:bg-gray-50/80 text-gray-700 hover:text-gray-900 border-gray-200/60 hover:border-gray-300/60'
            }`}
          >
            <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            Clear
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.symbol || filters.type) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Active filters:
          </span>
          {filters.symbol && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              isDark ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-blue-100/60 text-blue-700 border border-blue-200/60'
            }`}>
              Symbol: <span className="font-semibold">{filters.symbol}</span>
            </span>
          )}
          {filters.type && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              isDark ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'bg-purple-100/60 text-purple-700 border border-purple-200/60'
            }`}>
              Type: <span className="font-semibold">{filters.type}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
});

TransactionFilters.displayName = 'TransactionFilters';
export default TransactionFilters;
