import { useTheme } from '../../contexts/ThemeContext';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

export default function PerformanceChart({ data = [] }) {
  const { isDark } = useTheme();
  const chartDataArray = Array.isArray(data) ? data : [];

  // Calculate performance metrics
  let totalGain = 0;
  let gainPercentage = 0;
  let highestValue = 0;
  let lowestValue = Infinity;
  let initialInvestment = 0;

  if (chartDataArray.length > 0) {
    // Get the last data point (current state)
    const lastData = chartDataArray[chartDataArray.length - 1];
    
    // Total invested and current value from the last data point
    initialInvestment = lastData.totalInvested;
    const currentValue = lastData.totalValue;
    
    // Gain/Loss = Current Portfolio Value - Total Amount Invested
    totalGain = currentValue - initialInvestment;
    gainPercentage = initialInvestment > 0 ? (totalGain / initialInvestment) * 100 : 0;

    // Find highest and lowest portfolio values
    chartDataArray.forEach((item) => {
      if (item.totalValue > highestValue) highestValue = item.totalValue;
      if (item.totalValue < lowestValue) lowestValue = item.totalValue;
    });
  }

  if (!chartDataArray || chartDataArray.length === 0) {
    return (
      <div className={`rounded-xl border p-6 h-96 flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/50 border-gray-200'}`}>
        <div className="text-center">
          <div className={`flex justify-center mb-4 p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <BarChart3 size={40} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
          </div>
          <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            No performance data available
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Add transactions to see portfolio performance over time
          </p>
        </div>
      </div>
    );
  }

  const isPositiveGain = totalGain >= 0;

  return (
    <div className={`rounded-xl border p-6 transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/50 border-gray-200'}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Performance Over Time
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isPositiveGain ? (isDark ? 'bg-green-500/10' : 'bg-green-50') : (isDark ? 'bg-red-500/10' : 'bg-red-50')}`}>
            <TrendingUp size={16} className={isPositiveGain ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')} />
            <span className={`text-sm font-semibold ${isPositiveGain ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
              {isPositiveGain ? '+' : ''}{gainPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-100/50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Gain/Loss
            </p>
            <p className={`text-sm font-bold ${isPositiveGain ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
              ₹{totalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-100/50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Peak Value
            </p>
            <p className={`text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              ₹{highestValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-100/50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Low Value
            </p>
            <p className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              ₹{lowestValue === Infinity ? 0 : lowestValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartDataArray}>
          <defs>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            stroke={isDark ? '#6b7280' : '#d1d5db'}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            stroke={isDark ? '#6b7280' : '#d1d5db'}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            labelFormatter={(label) => `📅 ${label}`}
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: isDark ? '#f3f4f6' : '#1f2937',
              boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            cursor={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
          />
          <Legend
            wrapperStyle={{
              color: isDark ? '#d1d5db' : '#6b7280',
              paddingTop: '1rem',
            }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey="totalInvested"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorInvested)"
            name="Total Invested"
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="totalValue"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Current Value"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Performance Insight */}
      <div className={`mt-4 p-3 rounded-lg text-xs ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
        <p className="font-semibold mb-1">💡 Performance Insight</p>
        <p>
          {totalGain >= 0 
            ? `Your portfolio has gained ₹${totalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${gainPercentage.toFixed(2)}%) since your first investment.`
            : `Your portfolio has declined by ₹${Math.abs(totalGain).toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${gainPercentage.toFixed(2)}%) from your initial investment.`
          }
        </p>
      </div>
    </div>
  );
}

