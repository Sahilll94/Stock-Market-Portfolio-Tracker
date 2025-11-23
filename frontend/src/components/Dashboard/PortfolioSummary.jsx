import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

export default function PortfolioSummary({ summary = {} }) {
  const { isDark } = useTheme();
  const {
    totalInvested = 0,
    currentPortfolioValue = 0,
    totalProfitLoss = 0,
    totalProfitLossPercentage = 0,
    numberOfHoldings = 0,
  } = summary;

  const isPositive = totalProfitLoss >= 0;

  const cards = [
    {
      title: 'Current Value',
      value: `₹${currentPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: Briefcase,
      color: 'blue',
    },
    {
      title: 'Profit / Loss',
      value: `₹${totalProfitLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: `${totalProfitLossPercentage.toFixed(2)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'green' : 'red',
    },
    {
      title: 'Total Invested',
      value: `₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: 'gray',
    },
    {
      title: 'Holdings',
      value: numberOfHoldings,
      icon: Briefcase,
      color: 'purple',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: isDark ? 'bg-transparent' : 'bg-transparent',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
      },
      green: {
        bg: isDark ? 'bg-transparent' : 'bg-transparent',
        text: isDark ? 'text-green-400' : 'text-green-600',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
      },
      red: {
        bg: isDark ? 'bg-transparent' : 'bg-transparent',
        text: isDark ? 'text-red-400' : 'text-red-600',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
      },
      gray: {
        bg: isDark ? 'bg-transparent' : 'bg-transparent',
        text: isDark ? 'text-gray-400' : 'text-gray-600',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
      },
      purple: {
        bg: isDark ? 'bg-transparent' : 'bg-transparent',
        text: isDark ? 'text-purple-400' : 'text-purple-600',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);

        return (
          <div
            key={idx}
            className={`p-5 border-b-2 transition-all duration-300 ${
              isDark ? 'bg-transparent border-gray-700' : 'bg-transparent border-gray-200'
            }`}
          >
            <p className={`text-xs font-semibold mb-2 uppercase tracking-wide transition-colors ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {card.title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${colors.text}`}>
                {card.value}
              </p>
              {card.subtext && (
                <p className={`text-sm font-semibold ${colors.text}`}>
                  {card.subtext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
