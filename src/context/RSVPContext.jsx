import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getRSVPInfo } from '../services/rsvp_services';
import { RSVPContext } from './RSVPContext.js';

export const RSVPProvider = ({ children }) => {
  const [guestInfo, setGuestInfo] = useState(null);
  const [status, setStatus] = useState({ type: null });
  const [loading, setLoading] = useState(true);

  const fetchRSVPInfo = useCallback(async (invitationId) => {
    setLoading(true);
    setStatus({ type: null });
    
    try {
      const data = await getRSVPInfo(invitationId);
      setGuestInfo(data);
      return data;
    } catch (error) {
      setStatus({
        type: 'error',
        status: error.status
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    guestInfo,
    setGuestInfo,
    status,
    setStatus,
    loading,
    setLoading,
    fetchRSVPInfo
  };

  return <RSVPContext.Provider value={value}>{children}</RSVPContext.Provider>;
};

RSVPProvider.propTypes = {
  children: PropTypes.node.isRequired
};