import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { validateEmail } from '../../utils/validators';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import GoogleSignInButton from './GoogleSignInButton';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { setUser, setToken, setLoading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    if (!validateEmail(data.email)) {
      toast.error('Invalid email format');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!data.agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Google Sign In Button */}
      <GoogleSignInButton />

      {/* Divider */}
      <div className="relative">
        <div className={`absolute inset-0 flex items-center ${isDark ? 'border-t border-gray-600/50' : 'border-t border-gray-300/50'}`}></div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-3 transition-colors ${isDark ? 'bg-gray-800/30 text-gray-400' : 'bg-white/50 text-gray-600'}`}>
            Or create account with email
          </span>
        </div>
      </div>

      {/* Full Name Field */}
      <div className="group">
        <div className={`flex items-center gap-2 mb-2.5 transition-all duration-300 ${
          focusedField === 'fullName' ? isDark ? 'text-blue-400' : 'text-blue-600' : isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <User size={16} className="transition-transform duration-300" />
          <label className="block text-sm font-medium">Full Name</label>
        </div>
        <input
          type="text"
          {...register('fullName', { required: 'Full name is required' })}
          onFocus={() => setFocusedField('fullName')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
            isDark
              ? `bg-gray-700/40 border-gray-600/50 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.fullName ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
              : `bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.fullName ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
          }`}
          placeholder="John Doe"
        />
        {errors.fullName && <span className={`text-xs mt-1.5 flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          <span className="text-lg">!</span>{errors.fullName.message}
        </span>}
      </div>

      {/* Email Field */}
      <div className="group">
        <div className={`flex items-center gap-2 mb-2.5 transition-all duration-300 ${
          focusedField === 'email' ? isDark ? 'text-blue-400' : 'text-blue-600' : isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <Mail size={16} className="transition-transform duration-300" />
          <label className="block text-sm font-medium">Email Address</label>
        </div>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
            isDark
              ? `bg-gray-700/40 border-gray-600/50 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
              : `bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
          }`}
          placeholder="your@email.com"
        />
        {errors.email && <span className={`text-xs mt-1.5 flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          <span className="text-lg">!</span>{errors.email.message}
        </span>}
      </div>

      {/* Password Field */}
      <div className="group">
        <div className={`flex items-center gap-2 mb-2.5 transition-all duration-300 ${
          focusedField === 'password' ? isDark ? 'text-blue-400' : 'text-blue-600' : isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <Lock size={16} className="transition-transform duration-300" />
          <label className="block text-sm font-medium">Password</label>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 pr-10 ${
              isDark
                ? `bg-gray-700/40 border-gray-600/50 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
                : `bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 hover:scale-110 ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span className={`text-xs mt-1.5 flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          <span className="text-lg">!</span>{errors.password.message}
        </span>}
      </div>

      {/* Confirm Password Field */}
      <div className="group">
        <div className={`flex items-center gap-2 mb-2.5 transition-all duration-300 ${
          focusedField === 'confirmPassword' ? isDark ? 'text-blue-400' : 'text-blue-600' : isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <Lock size={16} className="transition-transform duration-300" />
          <label className="block text-sm font-medium">Confirm Password</label>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 pr-10 ${
              isDark
                ? `bg-gray-700/40 border-gray-600/50 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
                : `bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/50' : ''}`
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 hover:scale-110 ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <span className={`text-xs mt-1.5 flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          <span className="text-lg">!</span>{errors.confirmPassword.message}
        </span>}
      </div>

      {/* Terms and Conditions */}
      <label className="flex items-start gap-2 cursor-pointer group">
        <input
          type="checkbox"
          {...register('agreeToTerms')}
          className="w-4 h-4 rounded accent-blue-600 cursor-pointer transition-all hover:scale-110 mt-0.5"
        />
        <span className={`text-sm transition-colors ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
          I agree to the{' '}
          <a href="#" className={`font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            terms and conditions
          </a>
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-4 py-3.5 text-sm font-semibold rounded-lg transition-all duration-300 group relative overflow-hidden flex items-center justify-center gap-2 transform ${
          isDark
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/40 active:translate-y-0 active:shadow-lg active:shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40 active:translate-y-0 active:shadow-lg active:shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none'
        }`}
      >
        {/* Shimmer effect background */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 translate-x-full group-hover:translate-x-0 transition-all duration-500"></span>
        
        <span className="relative z-10 transition-all flex items-center gap-2">
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>

      {/* Login Link */}
      <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Already have an account?{' '}
        <a href="/login" className={`font-semibold transition-colors duration-300 flex items-center justify-center gap-1 group ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          Sign in
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </p>
    </form>
  );
}
