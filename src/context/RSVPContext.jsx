import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getRSVPInfo } from '../services/rsvp_services';
import { RSVPContext } from './RSVPContext.js';

export const RSVPProvider = ({ children }) => {
  const [guestInfo, setGuestInfo] = useState(null);
  const [status, setStatus] = useState({ type: null, message: null });
  const [loading, setLoading] = useState(true);

  const fetchRSVPInfo = useCallback(async (invitationId) => {
    setLoading(true);
    setStatus({ type: null, message: null });
    
    try {
      const data = await getRSVPInfo(invitationId);
      setGuestInfo(data);
      return data;
    } catch (error) {
      console.error('Error fetching RSVP info:', error);
      setStatus({
        type: 'error',
        message: 'No pudimos cargar tu información. Intentá de nuevo.'
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
    fetchRSVPInfo
  };

  return <RSVPContext.Provider value={value}>{children}</RSVPContext.Provider>;
};

RSVPProvider.propTypes = {
  children: PropTypes.node.isRequired
};