import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isTestMode: boolean;
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  toggleTestMode: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(true); // Default to test mode for backward compatibility
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token on load
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/users/profile/');
          setUser(response.data);
          setIsAuthenticated(true);
          setIsTestMode(false);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/token/', { email, password });
      const { access, refresh } = response.data;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      const userResponse = await api.get('/users/profile/');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setIsTestMode(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/users/register/', { email, password, first_name: firstName, last_name: lastName });
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setIsTestMode(true); // Return to test mode after logout
  };

  const toggleTestMode = () => {
    if (isTestMode) {
      // Exit test mode - redirect to login
      setIsTestMode(false);
    } else {
      // Enter test mode
      setIsTestMode(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isTestMode,
        user,
        login,
        register,
        logout,
        toggleTestMode,
        loading,
        error
      }}
    >
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
