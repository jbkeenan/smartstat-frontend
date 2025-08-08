import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isTestMode, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Allow access if authenticated or in test mode
  if (isAuthenticated || isTestMode) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated and not in test mode
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
