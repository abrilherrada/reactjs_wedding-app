import { useContext } from 'react';
import { RSVPContext } from './RSVPContext.js';

export const useRSVP = () => {
  const context = useContext(RSVPContext);
  if (!context) {
    throw new Error('useRSVP must be used within an RSVPProvider');
  }
  return context;
};