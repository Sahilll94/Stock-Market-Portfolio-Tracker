import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import DistributionChart from '../components/Dashboard/DistributionChart';
import { 
  ArrowRight, BarChart3, TrendingUp, DollarSign, Calendar, 
  LineChart as LineChartIcon, Target, CheckCircle, Zap,
  Lock, Menu, X, Activity, Award
} from 'lucide-react';
import { useState, useMemo } from 'react';

// Sample data for demonstration in HowItWorks page
const samplePerformanceData = [
  { date: 'Jan 1', totalInvested: 200000, totalValue: 200000 },
  { date: 'Jan 15', totalInvested: 200000, totalValue: 215000 },
  { date: 'Feb 1', totalInvested: 220000, totalValue: 235000 },
  { date: 'Feb 15', totalInvested: 220000, totalValue: 228000 },
  { date: 'Mar 1', totalInvested: 240000, totalValue: 258000 },
  { date: 'Mar 15', totalInvested: 240000, totalValue: 265000 },
  { date: 'Apr 1', totalInvested: 260000, totalValue: 285000 },
  { date: 'Apr 15', totalInvested: 260000, totalValue: 295000 },
  { date: 'May 1', totalInvested: 280000, totalValue: 310000 },
  { date: 'May 15', totalInvested: 280000, totalValue: 325000 },
  { date: 'Jun 1', totalInvested: 300000, totalValue: 350000 }
];

const sampleDistributionData = [
  { symbol: 'AAPL', value: 87500, percentage: 35 },
  { symbol: 'GOOGL', value: 75000, percentage: 30 },
  { symbol: 'MSFT', value: 50000, percentage: 20 },
  { symbol: 'TSLA', value: 37500, percentage: 15 }
];

export default function HowItWorks() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(0);

  const sections = [
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Dashboard Overview',
      subtitle: 'Get a complete snapshot of your portfolio',
      description: 'The dashboard is your command center. At a glance, you can see your total portfolio value, overall profit/loss percentage, and how your investments are performing today.',
      features: [
        'Real-time portfolio value calculation',
        'Overall profit/loss in currency and percentage',
        'Best and worst performing stocks',
        'Daily price changes across all holdings'
      ],
      color: 'blue'
    },
    {
      id: 'holdings',
      icon: Target,
      title: 'Holdings Management',
      subtitle: 'Track all your stock investments',
      description: 'View, add, edit, and delete your stock holdings. For each holding, see the current price, quantity owned, purchase price, profit/loss, and performance metrics.',
      features: [
        'Add new stock holdings with quantity and purchase price',
        'View current market price (updated in real-time)',
        'Calculate automatic profit/loss for each stock',
        'Edit or delete holdings as needed',
        'See percentage gains and absolute gains'
      ],
      color: 'green'
    },
    {
      id: 'transactions',
      icon: Calendar,
      title: 'Transaction History',
      subtitle: 'Complete record of all activities',
      description: 'Every action is logged. See when you bought or sold stocks, at what price, and for how many shares. This creates a complete audit trail of your investment history.',
      features: [
        'Timestamped transaction records',
        'Transaction type (Buy/Sell)',
        'Stock symbol and quantity',
        'Purchase price and total value',
        'Sort and filter by date or stock',
        'Export transaction data'
      ],
      color: 'purple'
    },
    {
      id: 'analytics',
      icon: LineChartIcon,
      title: 'Advanced Analytics',
      subtitle: 'Deep insights into your investments',
      description: 'Visualize your portfolio performance over time. See how your investments have grown, identify trends, and make data-driven decisions.',
      features: [
        'Portfolio value trend over time',
        'Asset allocation pie chart',
        'Performance metrics and statistics',
        'Compare returns across different periods',
        'Identify your best investments'
      ],
      color: 'orange'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-blue-50 to-white'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-white/30'} border-b sticky top-0 z-50 backdrop-blur-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${isDark ? 'bg-blue-600/20' : 'bg-blue-600/10'}`}>
                <img src="/portfolioTrack-logo.png" alt="PortfolioTrack Logo" className="w-5 h-5" />
              </div>
              <span className={`font-semibold hidden sm:inline transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>PortfolioTrack</span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`md:hidden pb-3 space-y-2 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => { navigate('/'); setIsMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                  isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-semibold ${
                  isDark
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-blue-100/50 text-blue-600'
                }`}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            How PortfolioTrack Works
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Master your investments with our intuitive portfolio tracking platform. Learn how each feature helps you make better investment decisions.
          </p>
        </div>

        {/* Key Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const colorMap = {
              blue: isDark ? 'text-blue-400' : 'text-blue-600',
              green: isDark ? 'text-green-400' : 'text-green-600',
              purple: isDark ? 'text-purple-400' : 'text-purple-600',
              orange: isDark ? 'text-orange-400' : 'text-orange-600'
            };

            return (
              <button
                key={idx}
                onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                className={`p-4 rounded-lg border text-left transition-all duration-300 hover:scale-102 ${
                  expandedSection === idx
                    ? isDark
                      ? 'bg-gray-700/50 border-gray-600/50'
                      : 'bg-blue-50/50 border-blue-300/50'
                    : isDark
                    ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50'
                    : 'bg-white/30 border-gray-200/30 hover:bg-white/50 hover:border-gray-300/50'
                }`}
              >
                <Icon size={24} className={colorMap[section.color]} />
                <h3 className={`font-semibold text-sm mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {section.title}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {section.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Dashboard Section */}
        <div className={`rounded-lg border overflow-hidden transition-all ${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/30 border-gray-200/30'}`}>
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-100/50'}`}>
                    <BarChart3 size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Dashboard Overview
                  </h2>
                </div>

                <p className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Your personal investment command center. Get a complete overview of your portfolio's performance with real-time data and key metrics.
                </p>

                <ul className="space-y-3">
                  {[
                    'See total portfolio value updated in real-time',
                    'Track overall profit or loss in both currency and percentage',
                    'Identify your best and worst performing stocks instantly',
                    'Monitor daily price changes across your entire portfolio'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className={isDark ? 'text-green-400 flex-shrink-0 mt-0.5' : 'text-green-600 flex-shrink-0 mt-0.5'} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  View Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Mock Dashboard Chart */}
              <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/30' : 'bg-gray-50/50 border-gray-300/30'}`}>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Portfolio Value</p>
                    <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>₹2,50,000</p>
                    <p className={`text-sm font-semibold mt-2 text-green-500`}>📈 +₹15,000 (+6.4%)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Best Performer</p>
                      <p className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>AAPL</p>
                      <p className="text-green-500 text-sm font-bold">+12.5%</p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Worst Performer</p>
                      <p className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>TSLA</p>
                      <p className="text-red-500 text-sm font-bold">-3.2%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Section */}
        <div className={`rounded-lg border overflow-hidden transition-all ${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/30 border-gray-200/30'}`}>
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Mock Holdings Table */}
              <div className={`p-6 rounded-lg border order-2 lg:order-1 ${isDark ? 'bg-gray-700/30 border-gray-600/30' : 'bg-gray-50/50 border-gray-300/30'}`}>
                <div className="space-y-3">
                  {[
                    { symbol: 'AAPL', qty: 50, buyPrice: 150, currentPrice: 169, gain: '+12.7%' },
                    { symbol: 'GOOGL', qty: 20, buyPrice: 100, currentPrice: 130, gain: '+30%' },
                    { symbol: 'MSFT', qty: 30, buyPrice: 300, currentPrice: 380, gain: '+26.7%' }
                  ].map((stock, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stock.symbol}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stock.qty} shares @ ₹{stock.buyPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{stock.currentPrice}</p>
                        <p className="text-green-500 text-sm font-bold">{stock.gain}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-600/20' : 'bg-green-100/50'}`}>
                    <Target size={24} className={isDark ? 'text-green-400' : 'text-green-600'} />
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Holdings Management
                  </h2>
                </div>

                <p className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Keep track of every stock you own. Add, edit, or remove holdings with ease, and instantly see your gains and losses.
                </p>

                <ul className="space-y-3">
                  {[
                    'Add new stock holdings with quantity purchased',
                    'View real-time market prices for each stock',
                    'Automatic profit/loss calculation in both ₹ and %',
                    'Edit holdings when you buy or sell more shares',
                    'Delete holdings when you exit a position'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className={isDark ? 'text-green-400 flex-shrink-0 mt-0.5' : 'text-green-600 flex-shrink-0 mt-0.5'} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group ${
                    isDark
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Manage Holdings
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className={`rounded-lg border overflow-hidden transition-all ${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/30 border-gray-200/30'}`}>
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-600/20' : 'bg-purple-100/50'}`}>
                    <Calendar size={24} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Transaction History
                  </h2>
                </div>

                <p className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Complete audit trail of all your investment activities. Track every buy and sell with timestamps and exact prices.
                </p>

                <ul className="space-y-3">
                  {[
                    'Timestamped record of every transaction',
                    'See transaction type (Buy/Sell) clearly',
                    'Track stock symbol and quantity bought/sold',
                    'Know exact price and total value at transaction',
                    'Sort and filter transactions by date or stock'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className={isDark ? 'text-green-400 flex-shrink-0 mt-0.5' : 'text-green-600 flex-shrink-0 mt-0.5'} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group ${
                    isDark
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  View Transactions
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Mock Transactions */}
              <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/30' : 'bg-gray-50/50 border-gray-300/30'}`}>
                <div className="space-y-3">
                  {[
                    { type: 'BUY', symbol: 'AAPL', qty: 50, price: 150, date: 'Nov 20' },
                    { type: 'BUY', symbol: 'GOOGL', qty: 20, price: 100, date: 'Nov 18' },
                    { type: 'SELL', symbol: 'MSFT', qty: 10, price: 380, date: 'Nov 15' },
                    { type: 'BUY', symbol: 'TSLA', qty: 15, price: 250, date: 'Nov 10' }
                  ].map((tx, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-white text-sm ${tx.type === 'BUY' ? 'bg-green-600' : 'bg-red-600'}`}>
                          {tx.type === 'BUY' ? '↓' : '↑'}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{tx.symbol}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tx.qty} @ ₹{tx.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tx.date}</p>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{(tx.qty * tx.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className={`rounded-lg border overflow-hidden transition-all ${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/30 border-gray-200/30'}`}>
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Dashboard Analytics Charts */}
              <div className="order-2 lg:order-1 space-y-6">
                <PerformanceChart data={samplePerformanceData} />
                <DistributionChart data={sampleDistributionData} />
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-600/20' : 'bg-orange-100/50'}`}>
                    <LineChartIcon size={24} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Advanced Analytics
                  </h2>
                </div>

                <p className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Visualize your portfolio growth and make informed decisions with our powerful analytics tools.
                </p>

                <ul className="space-y-3">
                  {[
                    'Portfolio value trend chart over time',
                    'Asset allocation pie chart by percentage',
                    'Performance metrics and statistics',
                    'Identify best and worst performing investments',
                    'Compare returns across different time periods'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className={isDark ? 'text-green-400 flex-shrink-0 mt-0.5' : 'text-green-600 flex-shrink-0 mt-0.5'} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group ${
                    isDark
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  Explore Analytics
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className={`rounded-lg border p-6 sm:p-8 mb-12 ${isDark ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-100/20 border-blue-300/30'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Getting Started in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: 'Sign Up',
                description: 'Create your free account in seconds. No credit card required.',
                icon: '📝'
              },
              {
                step: 2,
                title: 'Add Your Holdings',
                description: 'Enter the stocks you own with quantity and purchase price.',
                icon: '📊'
              },
              {
                step: 3,
                title: 'Track & Analyze',
                description: 'Watch your portfolio grow with real-time data and analytics.',
                icon: '📈'
              }
            ].map((item, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Step {item.step}
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center mb-12`}>
        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Ready to Master Your Portfolio?
        </h2>
        <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Start tracking your investments today with PortfolioTrack
        </p>

        <button
          onClick={() => navigate('/register')}
          className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2 group ${
            isDark
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-600/40'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-600/30'
          }`}
        >
          <Zap size={20} />
          Get Started Free
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            © 2025 PortfolioTrack. Simple, free stock portfolio tracker.
          </p>
        </div>
      </footer>
    </div>
  );
}
