import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ThemeProvider } from '../contexts/ThemeContext';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Holdings from '../pages/Holdings';
import Transactions from '../pages/Transactions';
import TermsAndConditions from '../pages/TermsAndConditions';
import ForgotPassword from '../pages/ForgotPassword';
import HowItWorks from '../pages/HowItWorks';

export const AppRoutes = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Route */}
          <Route path="/" element={<Landing />} />

          {/* Info Routes */}
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holdings"
            element={
              <ProtectedRoute>
                <Holdings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
