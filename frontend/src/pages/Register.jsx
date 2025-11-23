import RegisterForm from '../components/Auth/RegisterForm';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  const benefits = [
    { icon: TrendingUp, title: 'Real-Time Tracking', desc: 'Live market data for 40k+ stocks' },
    { icon: Clock, title: 'Portfolio Updates', desc: 'Instant portfolio value tracking' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Charts and performance insights' }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-white via-blue-50 to-white'
    } relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 animate-pulse transition-all duration-1000 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
      <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2 animate-pulse transition-all duration-1000 delay-700 ${isDark ? 'bg-cyan-600' : 'bg-cyan-400'}`}></div>

      {/* Back Button with animation */}
      <button
        onClick={() => navigate('/')}
        className={`absolute top-6 left-6 p-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 group hover:scale-110 active:scale-95 ${
          isDark
            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Registration Form */}
        <div className={`rounded-xl border p-8 transition-all duration-500 transform animate-fadeInUp order-2 lg:order-1 ${
          isDark
            ? 'bg-gray-800/30 border-gray-700/50'
            : 'bg-white/50 border-gray-200/50'
        } backdrop-blur-sm shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30`}>
          {/* Logo display */}
          <div className="flex items-center justify-center mb-8">
            <img src="/portfolioTrack-logo.png" alt="PortfolioTrack" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
          </div>

          {/* Header with animation */}
          <div className="text-center mb-8 space-y-3 animate-fadeInUp animation-delay-100">
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Get Started
            </h1>
            <div className={`h-1 w-16 rounded-full mx-auto transition-all ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}></div>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create your investment account
            </p>
          </div>

          {/* Form with animation */}
          <div className="animate-fadeInUp animation-delay-200">
            <RegisterForm />
          </div>
        </div>

        {/* Right: Benefits showcase */}
        <div className="hidden lg:block space-y-6 animate-fadeInRight order-1 lg:order-2">
          <div className="space-y-2">
            <h2 className={`text-4xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why Join Us?
            </h2>
            <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to invest smarter
            </p>
          </div>
          
          <div className="space-y-3 pt-4">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBenefit(idx)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:translate-x-2 ${
                    hoveredBenefit === idx
                      ? isDark ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20' : 'bg-blue-50 border-blue-400/50 shadow-lg shadow-blue-400/20'
                      : isDark ? 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/70' : 'bg-white/30 border-gray-200/50 hover:border-gray-300/70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
                      hoveredBenefit === idx
                        ? isDark ? 'bg-blue-600/30' : 'bg-blue-100'
                        : isDark ? 'bg-gray-700/40' : 'bg-gray-100'
                    }`}>
                      <Icon size={20} className={`transition-all duration-300 ${
                        hoveredBenefit === idx
                          ? isDark ? 'text-blue-400 scale-110' : 'text-blue-600 scale-110'
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {benefit.title}
                      </h3>
                      <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project info */}
          <div className={`p-4 rounded-lg border transition-all duration-300 ${
            isDark ? 'bg-purple-600/10 border-purple-500/30' : 'bg-purple-50/50 border-purple-300/30'
          }`}>
            <p className={`text-xs font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              🚀 Powerful & Intuitive
            </p>
            <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Track 40k+ stocks globally. Advanced charts, AI-powered insights, secure OAuth authentication. Mobile-optimized dashboard with real-time portfolio updates.
            </p>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className={`absolute top-40 left-10 w-2 h-2 rounded-full animate-float opacity-30 ${isDark ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
      <div className={`absolute bottom-20 right-10 w-3 h-3 rounded-full animate-float opacity-20 ${isDark ? 'bg-cyan-500' : 'bg-cyan-400'}`} style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
