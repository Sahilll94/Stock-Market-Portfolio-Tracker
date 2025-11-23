import { useTheme } from '../../contexts/ThemeContext';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#06b6d4'];

export default function DistributionChart({ data = [] }) {
  const { isDark } = useTheme();
  const chartDataArray = Array.isArray(data) ? data : [];

  if (!chartDataArray || chartDataArray.length === 0) {
    return (
      <div className={`rounded-xl border p-6 h-96 flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/50 border-gray-200'}`}>
        <div className="text-center">
          <div className={`flex justify-center mb-4 p-4 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <PieIcon size={40} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            No holdings data available
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Add holdings to see portfolio distribution
          </p>
        </div>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = chartDataArray.map((item) => ({
    name: item.symbol,
    value: item.value,
    percentage: item.percentage,
  }));

  return (
    <div className={`rounded-xl border p-6 transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/50 border-gray-200'}`}>
      <h3 className={`text-lg font-bold mb-6 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Portfolio Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: isDark ? '#f3f4f6' : '#1f2937',
            }}
          />
          <Legend
            wrapperStyle={{
              color: isDark ? '#d1d5db' : '#6b7280',
              paddingTop: '1rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
