// src/Components/Auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/useAuth';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};