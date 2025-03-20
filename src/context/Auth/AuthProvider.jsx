import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext.js';
import { login as loginService, signup as signupService } from '../../services/auth_services';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check localStorage for existing token on mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loginService({
        email: credentials.email,
        password: credentials.password
      });
      
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setError(error.message || 'Hubo un error al iniciar sesión');
      setTimeout(() => setError(null), 5000);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await signupService(userData);
      
      // Automatically log in after successful signup
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setError(error.message || 'Hubo un error al crear la cuenta');
      setTimeout(() => setError(null), 5000);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      token, 
      login,
      signup,
      logout,
      loading,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
