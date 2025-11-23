import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, token, isLoading, error, setUser, setToken, setLoading, logout, isAuthenticated } =
    useAuthStore();

  return {
    user,
    token,
    isLoading,
    error,
    setUser,
    setToken,
    setLoading,
    logout,
    isAuthenticated: isAuthenticated(),
  };
};
