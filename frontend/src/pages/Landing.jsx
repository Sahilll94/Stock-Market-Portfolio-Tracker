import { useNavigate } from 'react-router-dom';
import { 
  Moon, Sun, TrendingUp, BarChart3, Lock, Zap, ArrowRight, 
  CheckCircle, Users, Target, Lightbulb, Shield, Activity, 
  LineChart, PieChart, Gauge, DollarSign, Award, Rocket, Github
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import stockService from '../services/stockService';

const defaultPortfolioData = {
  totalReturn: 2.85,
  holdings: [
    { symbol: 'AAPL', change: 2.5, value: 217478 },
    { symbol: 'GOOGL', change: 3.2, value: 113042 }
  ]
};

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [loading, setLoading] = useState(true);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(0);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        setLoading(true);
        
        // Fetch 2 symbols: AAPL and GOOGL
        const stockSymbols = ['AAPL', 'GOOGL'];
        
        console.log('Fetching stocks:', stockSymbols);
        const stocksData = await stockService.getMultipleStocks(stockSymbols);


        if (stocksData && stocksData.length > 0) {
          // Map API data directly with all details and proper validation
          const holdings = stocksData
            .filter((stock) => stock && stock.symbol) // Filter out invalid data
            .map((stock) => {
              // Ensure numeric values with defaults
              const close = parseFloat(stock.close) || 0;
              const open = parseFloat(stock.open) || 0;
              const high = parseFloat(stock.high) || close;
              const low = parseFloat(stock.low) || close;
              const volume = parseInt(stock.volume) || 0;

              const priceChange = close - open;
              const percentChange = open > 0 ? (priceChange / open) * 100 : 0;

              // Extract time from datetime (format: "2025-11-23 02:29:45")
              let time = 'N/A';
              if (stock.datetime) {
                const timeMatch = stock.datetime.match(/(\d{2}:\d{2}:\d{2})/);
                if (timeMatch) {
                  time = timeMatch[1];
                }
              }

              return {
                symbol: stock.symbol || 'N/A',
                close: close,
                open: open,
                high: high,
                low: low,
                volume: volume,
                datetime: stock.datetime || 'N/A',
                time: time,
                change: parseFloat(percentChange.toFixed(2)),
                changeAmount: parseFloat(priceChange.toFixed(2))
              };
            });

          if (holdings.length > 0) {
            // Calculate total portfolio return
            const totalReturn = (holdings.reduce((sum, h) => sum + h.change, 0) / holdings.length).toFixed(2);

            setPortfolioData({
              totalReturn: parseFloat(totalReturn),
              holdings: holdings
            });
          } else {
            setPortfolioData(defaultPortfolioData);
          }
        } else {
          setPortfolioData(defaultPortfolioData);
        }
      } catch (error) {
        console.error('Failed to fetch real-time stock data:', error);
        // Use default data on error
        setPortfolioData(defaultPortfolioData);
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeData();

    // Refresh data every 60 seconds
    const interval = setInterval(fetchRealTimeData, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-blue-50 to-white'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'border-gray-800' : 'border-gray-200'} border-b sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${isDark ? 'bg-blue-600/20 group-hover:bg-blue-600/30' : 'bg-blue-600/10 group-hover:bg-blue-600/20'}`}>
                  <img src="/portfolioTrack-logo.png" alt="PortfolioTrack Logo" className="w-5 h-5" />
                </div>
                <span className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>PortfolioTrack</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* GitHub Link */}
              <a
                href="https://github.com/Sahilll94/Stock-Market-Portfolio-Tracker"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50 active:scale-95'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
                }`}
                title="View on GitHub"
              >
                <Github size={18} />
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50 active:scale-95'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
                }`}
              >
                {isDark ? <Sun size={18} className="transition-transform duration-300" /> : <Moon size={18} className="transition-transform duration-300" />}
              </button>

              {/* Sign In Button */}
              <button
                onClick={() => navigate('/login')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 hidden sm:block ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50 active:scale-95'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
                }`}
              >
                Sign In
              </button>

              {/* Get Started Button */}
              <button
                onClick={() => navigate('/register')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 active:scale-95 ${
                  isDark
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/50'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Stock Market Focused */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 w-fit ${
              isDark ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-400/50 bg-blue-50'
            }`}>
              <Rocket size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Real-Time Stock Tracking
              </span>
            </div>

            <div>
              <h1 className={`text-4xl xs:text-5xl sm:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Master Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 mt-2">
                  Investment Portfolio
                </span>
              </h1>
            </div>

            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-700'} leading-relaxed max-w-xl`}>
              Track stock prices in real-time, analyze your portfolio, and make better investment decisions. Completely free, no complexity.
            </p>

            {/* Key Benefits */}
            <div className="space-y-3 pt-4">
              {[
                'Real-time stock prices',
                'Instant profit/loss tracking',
                'Portfolio analytics',
                'Secure & completely free'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle size={20} className={`${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col xs:flex-row gap-3 pt-8">
              <button
                onClick={() => navigate('/register')}
                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-blue-600/40'
                    : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-blue-600/40'
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isDark ? 'bg-white' : 'bg-white'}`}></div>
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                  <Rocket size={18} className="transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
                  <span>Start Tracking</span>
                </span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group relative ${
                  isDark
                    ? 'border-2 border-blue-500/50 bg-blue-500/10 text-white hover:border-blue-400 hover:bg-blue-500/20 active:scale-95 hover:shadow-lg hover:shadow-blue-500/30'
                    : 'border-2 border-blue-600/50 bg-blue-600/10 text-blue-700 hover:border-blue-600 hover:bg-blue-600/20 active:scale-95 hover:shadow-lg hover:shadow-blue-600/30'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  <span>Sign In</span>
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={`flex flex-wrap gap-8 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {[
                { icon: TrendingUp, label: 'Real Data', desc: 'Live market prices' },
                { icon: Shield, label: 'Transparent', desc: 'No hidden fees' },
                { icon: DollarSign, label: 'Always Free', desc: 'No subscriptions' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <Icon size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <div>
                      <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Live Portfolio Demo */}
          <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/50 border-gray-200/50'
          } backdrop-blur-sm`}>
            <div className={`p-6 h-full ${isDark ? 'bg-gray-800/30' : 'bg-white/30'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Gauge size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  <h3 className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Portfolio Summary</h3>
                </div>
                <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  portfolioData.totalReturn >= 0
                    ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                    : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                }`}>
                  {portfolioData.totalReturn >= 0 ? '📈' : '📉'} {portfolioData.totalReturn >= 0 ? '+' : ''}{portfolioData.totalReturn.toFixed(2)}%
                </div>
              </div>
              
              <div className="space-y-3">
                {portfolioData.holdings.map((holding, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-102 hover:translate-x-1 group ${
                        isDark
                          ? 'hover:bg-gray-700/50'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm overflow-hidden bg-white`}>
                            <img 
                              src={`https://logo.clearbit.com/${holding.symbol === 'AAPL' ? 'apple.com' : holding.symbol === 'GOOGL' ? 'google.com' : 'placeholder.com'}`}
                              alt={holding.symbol}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-sm ${idx === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-cyan-500 to-cyan-600'}">${holding.symbol.substring(0, 1)}</div>`;
                              }}
                            />
                          </div>
                          <div>
                            <p className={`font-semibold text-sm transition-colors duration-300 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                              {holding.symbol}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm transition-colors duration-300 ${isDark ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-700'}`}>
                            ₹{(holding.close || 0).toFixed(2)}
                          </p>
                          <p className={`text-xs font-bold transition-colors duration-300 ${
                            (holding.change || 0) >= 0
                              ? isDark ? 'text-green-400 group-hover:text-green-300' : 'text-green-600 group-hover:text-green-700'
                              : isDark ? 'text-red-400 group-hover:text-red-300' : 'text-red-600 group-hover:text-red-700'
                          }`}>
                            {(holding.change || 0) >= 0 ? '▲ +' : '▼ '}{(holding.change || 0).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className={`w-full h-1 rounded-full transition-all duration-300 ${
                        (holding.change || 0) >= 0
                          ? isDark ? 'bg-gradient-to-r from-green-900/30 to-green-600/30' : 'bg-gradient-to-r from-green-100 to-green-200'
                          : isDark ? 'bg-gradient-to-r from-red-900/30 to-red-600/30' : 'bg-gradient-to-r from-red-100 to-red-200'
                      }`}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Stock Market Specific */}
      <section className={`py-16 sm:py-24 lg:py-32 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Essential Features
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to track your portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: TrendingUp,
                title: 'Real-Time Tracking', 
                desc: 'Live stock prices every minute'
              },
              { 
                icon: BarChart3,
                title: 'Profit/Loss Insights', 
                desc: 'Instant gain calculations'
              },
              { 
                icon: PieChart,
                title: 'Portfolio Analytics', 
                desc: 'Visual breakdown of holdings'
              },
              { 
                icon: Target,
                title: 'Transaction History', 
                desc: 'Complete transaction log'
              },
              { 
                icon: Gauge,
                title: 'Performance Metrics', 
                desc: 'Best & worst performers'
              },
              { 
                icon: Lock,
                title: 'Secure & Safe', 
                desc: 'Encrypted & protected'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? 'border-gray-700/50 bg-gray-800/20'
                      : 'border-gray-200/50 bg-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={20} className={isDark ? 'text-blue-400 flex-shrink-0 mt-1' : 'text-blue-600 flex-shrink-0 mt-1'} />
                    <div>
                      <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why PortfolioTrack Section */}
      <section className={`py-16 sm:py-24 lg:py-32 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why Choose PortfolioTrack
            </h2>
            <p className={`text-base max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Simple, transparent, and built for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'All Stocks', desc: 'Built for any stock' },
              { icon: Zap, title: 'Fast Updates', desc: 'Real-time data' },
              { icon: DollarSign, title: 'Always Free', desc: 'No subscriptions' },
              { icon: Shield, title: 'Your Privacy', desc: 'Secure & encrypted' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`p-4 rounded-lg border ${
                  isDark
                    ? 'border-gray-700/50 bg-gray-800/20'
                    : 'border-gray-200/50 bg-white/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <Icon size={20} className={isDark ? 'text-blue-400 flex-shrink-0 mt-1' : 'text-blue-600 flex-shrink-0 mt-1'} />
                    <div>
                      <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-16 sm:py-24 lg:py-32 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-base max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Sign Up', desc: 'Create account in seconds' },
              { icon: PieChart, title: 'Add Stocks', desc: 'Add your holdings' },
              { icon: Activity, title: 'Track', desc: 'Monitor in real-time' }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? 'border-gray-700/50 bg-gray-800/20'
                      : 'border-gray-200/50 bg-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                        isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-16 sm:py-24 lg:py-32 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Start Tracking Today
          </h2>
          <p className={`text-base mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Simple, free, and ready to use. No credit card required.
          </p>
          
          <div className="flex flex-col xs:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/register')}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-blue-600/40'
                  : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-blue-600/40'
              }`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                <Rocket size={18} className="transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
                Get Started Free
              </span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group relative ${
                isDark
                  ? 'border-2 border-blue-500/50 bg-blue-500/10 text-white hover:border-blue-400 hover:bg-blue-500/20 active:scale-95 hover:shadow-lg hover:shadow-blue-500/30'
                  : 'border-2 border-blue-600/50 bg-blue-600/10 text-blue-700 hover:border-blue-600 hover:bg-blue-600/20 active:scale-95 hover:shadow-lg hover:shadow-blue-600/30'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                Sign In
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center space-y-4">
            {/* Description */}
            <p className={`text-base max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Simple, free stock portfolio tracker
            </p>

            {/* Copyright */}
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              © 2025 PortfolioTrack
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

