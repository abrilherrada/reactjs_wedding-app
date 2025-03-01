import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getReservation } from '../../services/reservation_services';
import { useRSVP } from '../../context/useRSVP';
import ReservationForm from './ReservationForm/ReservationForm';
import ReservationStatus from './ReservationStatus/ReservationStatus';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import WarningIcon from '../../assets/icons/WarningIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import styles from './Reservation.module.css';

const ERROR_MESSAGES = {
  FETCH_ERROR: 'No pudimos cargar tu información. Tocá el botón para intentar de nuevo.',
  CANCEL_ERROR: 'No pudimos cancelar tu reserva. Tocá el botón para intentar de nuevo.',
  NO_INVITATION_ID: 'No pudimos encontrar tu invitación. Revisá que el enlace que estás usando sea el mismo que te enviamos por WhatsApp.',
  SERVER_ERROR: 'Hubo un problema con el servidor. Intentá de nuevo más tarde.'
};

const Reservation = ({reservationType, onReservationChange}) => {
  const { guestInfo } = useRSVP();
  const [showForm, setShowForm] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, message: null });

  const invitationId = new URLSearchParams(window.location.search).get('invitationId');

  const fetchReservation = useCallback(async (shouldSetLoading = true) => {
    if (shouldSetLoading) {
      setLoading(true);
    }
    setStatus({ type: null, message: null });
    
    try {
      if (!invitationId) {
        setStatus({
          type: 'error',
          message: ERROR_MESSAGES.NO_INVITATION_ID
        });
        return;
      }

      const reservationData = await getReservation(invitationId, reservationType);
      setReservation(reservationData); // reservationData will be null if no reservation exists
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setStatus({
        type: 'error',
        message: error.status >= 500 
          ? ERROR_MESSAGES.SERVER_ERROR 
          : ERROR_MESSAGES.FETCH_ERROR
      });
    } finally {
      if (shouldSetLoading) {
        setLoading(false);
      }
    }
  }, [invitationId, reservationType]);

  // Initial fetch
  useEffect(() => {
    fetchReservation(true);
  }, [fetchReservation]);

  // Refetch when guestInfo changes
  useEffect(() => {
    fetchReservation(false);
  }, [guestInfo, fetchReservation]);

  useEffect(() => {
    onReservationChange?.({
      isTextHidden: showForm || !!reservation
    });
  }, [reservation, showForm, onReservationChange]);

  const handleFormVisibility = (visible) => {
    setShowForm(visible);
    setStatus({
      type: null,
      message: null
    });
  };

  const handleReservationSuccess = (newReservation) => {
    setReservation(newReservation);
    setShowForm(false);
    setStatus({
      type: 'success',
      message: '¡Listo! Ya te guardamos tus lugares. 😎'
    });
  };

  const handleCancelSuccess = () => {
    setReservation(null);
    setStatus({
      type: 'success',
      message: '¡Listo! Cancelamos tu reserva.'
    });
  };

  const handleCancelError = () => {
    setStatus({
      type: 'error',
      message: ERROR_MESSAGES.CANCEL_ERROR
    });
  };

  const renderContent = () => {
    if (status.type === 'error') {
      return (
        <>
          <p className={`${styles.message} ${styles.error}`}>
            <span>
              <WarningIcon />
            </span>
            <span>{status.message}</span>
          </p>
          <Button 
            onClick={fetchReservation}
            className={styles.retryButton}
          >
            Intentar de nuevo
          </Button>
        </>
      );
    }

    return (
      <>
        {status.type === 'success' && (
          <p className={`${styles.message} ${styles.success}`}>
            <span>
              <CheckIcon />
            </span>
            <span>{status.message}</span>
          </p>
        )}

        {loading ? (
          <Spinner />
        ) : showForm ? (
          <ReservationForm 
            invitationId={invitationId}
            reservationType={reservationType}
            onClose={() => handleFormVisibility(false)}
            onRetry={fetchReservation}
            onSuccess={handleReservationSuccess}
            isModifying={!!reservation}
            reservation={reservation}
          />
        ) : reservation ? (
          <ReservationStatus
            reservationType={reservationType}
            reservation={reservation}
            onModify={() => handleFormVisibility(true)}
            onCancelSuccess={handleCancelSuccess}
            onCancelError={handleCancelError}
          />
        ) : (
          <>
              <Button
                className={styles.bookButton}
                onClick={() => handleFormVisibility(true)}
              >
                Reservar{reservationType === 'lodging' ? ' alojamiento' : (reservationType === 'transportation' ? ' trafic' : '')}
              </Button>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default Reservation;

Reservation.propTypes = {
  reservationType: PropTypes.string.isRequired,
  onReservationChange: PropTypes.func
};