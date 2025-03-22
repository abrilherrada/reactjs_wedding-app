import { useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';
import { AuthContext } from '../Auth/AuthContext';
import { getUserInfo } from '../../services/admin_services';

export const UserProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getUserInfo(token);
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserContext.Provider value={{ 
      userData,
      loading,
      error,
      fetchUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};