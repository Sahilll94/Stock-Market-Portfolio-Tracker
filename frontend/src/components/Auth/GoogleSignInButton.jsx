import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import firebaseAuthService from '../../services/firebaseAuthService';

export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { setUser, setToken, setLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      const result = await firebaseAuthService.signInWithGoogle();
      
      if (result.success) {
        const { user, token } = result.data;
        setToken(token);
        setUser(user);
        toast.success('Welcome to PortfolioTrack!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Google sign in failed');
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
        isDark
          ? 'bg-gray-800/50 border-gray-700/50 text-white hover:bg-gray-800/80 hover:border-gray-600/50 active:scale-95'
          : 'bg-gray-50/50 border-gray-300/50 text-gray-900 hover:bg-gray-100/50 hover:border-gray-400/50 active:scale-95'
      } hover:shadow-lg`}
    >
      {/* Google Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-110"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <span className="relative z-10 group-hover:tracking-wider transition-all">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  );
}
