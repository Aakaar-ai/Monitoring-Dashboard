import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './login-form';
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";

// Fallback location hook for when not in Router context
const useSafeLocation = () => {
  try {
    return useRouterLocation();
  } catch {
    return { pathname: '/' };
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, redirectPath, setRedirectPath } = useAuth();
  const location = useSafeLocation();
  const navigate = useNavigate();

  // Set redirect path if not already set and we're not on the login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== '/login') {
      setRedirectPath(location.pathname);
    }
  }, [isLoading, isAuthenticated, location.pathname, setRedirectPath]);

  // Redirect after successful authentication
  useEffect(() => {
    if (!isLoading && isAuthenticated && redirectPath) {
      navigate(redirectPath, { replace: true });
      setRedirectPath(null);
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, setRedirectPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.superuser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoginForm />
      </div>
    );
  }

  return <>{children}</>;
};
