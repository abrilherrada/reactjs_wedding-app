// src/Components/Auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/useAuth';
import PropTypes from 'prop-types';
import Spinner from '../Components/Spinner/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Spinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};