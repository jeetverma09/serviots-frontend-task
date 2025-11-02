import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        const userData = response.data?.user || response.data;
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      const userData = response.data;
      if (userData?.token) {
        localStorage.setItem('token', userData.token);
      }
      setUser(userData?.user || userData);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: response.message || response.error };
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success) {
      const userResponseData = response.data;
      if (userResponseData?.token) {
        localStorage.setItem('token', userResponseData.token);
      }
      setUser(userResponseData?.user || userResponseData);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: response.message || response.error };
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

