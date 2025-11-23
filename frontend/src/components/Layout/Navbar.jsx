import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { Menu, X, LogOut, Moon, Sun, User, Mail } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Holdings', href: '/holdings' },
    { label: 'Transactions', href: '/transactions' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className={`${isDark ? 'border-gray-800/50 bg-gray-900/50' : 'border-gray-200/50 bg-white/50'} border-b sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${isDark ? 'bg-blue-600/20 group-hover:bg-blue-600/30' : 'bg-blue-600/10 group-hover:bg-blue-600/20'}`}>
                <img src="/portfolioTrack-logo.png" alt="PortfolioTrack Logo" className="w-5 h-5 transition-all group-hover:scale-110" />
              </div>
              <span className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>PortfolioTrack</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(link.href)
                    ? isDark
                      ? 'text-blue-400 bg-blue-600/20 border border-blue-500/30'
                      : 'text-blue-600 bg-blue-100/50 border border-blue-300/50'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border border-transparent hover:border-gray-300/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
                isDark
                  ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-100/50 border border-transparent hover:border-gray-300/50'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile & Settings */}
            <div className="hidden md:flex items-center relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 border ${
                  isDark
                    ? 'hover:bg-gray-800/50 border-gray-700/30 hover:border-gray-600/50 text-gray-300 hover:text-white'
                    : 'hover:bg-blue-50/50 border-gray-300/30 hover:border-blue-300/50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:shadow-lg overflow-hidden border-2" style={{borderColor: isDark ? '#3b82f6' : '#2563eb'}}>
                  <img 
                    src={user?.photoURL || '/portfolioTrack-logo.png'} 
                    alt={user?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-sm font-medium hidden sm:inline truncate max-w-[80px]`}>
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className={`absolute right-0 mt-12 w-64 rounded-lg shadow-xl top-full border backdrop-blur-md transition-all duration-300 z-50 overflow-hidden ${
                  isDark
                    ? 'bg-gray-800/95 border-gray-700/50 shadow-gray-900/50'
                    : 'bg-white/95 border-gray-200/50 shadow-gray-200/50'
                }`}>
                  {/* Profile Header */}
                  <div className={`px-4 py-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden" style={{borderColor: isDark ? '#3b82f6' : '#2563eb'}}>
                      <img 
                        src={user?.photoURL || '/portfolioTrack-logo.png'} 
                        alt={user?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.name || 'User'}
                        </p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user?.email || 'No email'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className={`px-4 py-3 space-y-2 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                    <div className="flex items-center space-x-2">
                      <User size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.name || 'Username'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                      <span className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user?.email || 'email@example.com'}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center space-x-2 transition-all duration-300 ${
                      isDark
                        ? 'text-red-400 hover:bg-red-600/20 border-0 hover:border-0'
                        : 'text-red-600 hover:bg-red-100/50 border-0 hover:border-0'
                    }`}
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 border hover:scale-110 active:scale-95 ${
                isDark
                  ? 'bg-gray-800/50 hover:bg-gray-700/70 border-gray-700/50 hover:border-gray-600/50'
                  : 'bg-gray-100/50 hover:bg-blue-100/70 border-gray-300/50 hover:border-blue-300/50'
              }`}
            >
              {isMenuOpen ? (
                <X size={20} className={isDark ? 'text-white' : 'text-gray-900'} />
              ) : (
                <Menu size={20} className={isDark ? 'text-white' : 'text-gray-900'} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden pb-3 space-y-1 border-t ${isDark ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  navigate(link.href);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                  isActive(link.href)
                    ? isDark
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'bg-blue-100/50 text-blue-600 border border-blue-300/50'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100/50 border border-transparent hover:border-gray-300/50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-300 border ${
                isDark
                  ? 'text-red-400 hover:bg-red-600/20 border border-transparent hover:border-red-500/30'
                  : 'text-red-600 hover:bg-red-100/50 border border-transparent hover:border-red-300/30'
              }`}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
