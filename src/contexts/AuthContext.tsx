import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  supabase_auth_id: string;
  auth_provider: string;
  superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'aakaarai_access_token';
const USER_KEY = 'aakaarai_user';

// JWT token decoder
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        // Token expired, clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);  // Set isAuthenticated to true when token and user are valid
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } else {
      setIsAuthenticated(false);  // Ensure isAuthenticated is false if no valid token/user
    }
    
    setIsLoading(false);
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return;

    const timeUntilExpiry = (decoded.exp * 1000) - Date.now();
    
    if (timeUntilExpiry > 0) {
      const timeoutId = setTimeout(() => {
        logout();
      }, timeUntilExpiry);

      return () => clearTimeout(timeoutId);
    } else {
      logout();
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (!data.access_token || !data.superuser) {
        throw new Error('Access denied. Superuser privileges required.');
      }

      const decoded = decodeJWT(data.access_token);
      if (!decoded) {
        throw new Error('Invalid token received');
      }

      const userData: User = {
        id: decoded.id,
        email: decoded.email,
        supabase_auth_id: decoded.supabase_auth_id,
        auth_provider: decoded.auth_provider,
        superuser: data.superuser,
      };

      // Store in localStorage
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setToken(data.access_token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setRedirectPath(null);
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
    redirectPath: redirectPath,
    setRedirectPath: setRedirectPath,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
