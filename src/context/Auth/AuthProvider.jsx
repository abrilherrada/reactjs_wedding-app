import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext.js';
import { login as loginService, signup as signupService } from '../../services/auth_services';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const validateToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      setError(error.message || 'Hubo un error al validar la sesión');
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken && validateToken(storedToken)) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else if (storedToken) {
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    };
    
    initializeAuth();

    const validationInterval = setInterval(() => {
      const currentToken = localStorage.getItem('authToken');
      if (currentToken) {
        validateToken(currentToken);
      }
    }, 60 * 60 * 1000); // Validate every hour

    return () => {
      clearInterval(validationInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginService({
        email: credentials.email,
        password: credentials.password
      });

      if (validateToken(data.token)) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Token inválido recibido del servidor');
      }
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

      if (validateToken(data.token)) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Token inválido recibido del servidor');
      }
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
