import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getReservation } from '../../services/reservation_services';
import { useRSVP } from '../../context/RSVP/useRSVP';
import ReservationForm from './ReservationForm/ReservationForm';
import ReservationStatus from './ReservationStatus/ReservationStatus';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import WarningIcon from '../../assets/icons/WarningIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import styles from './Reservation.module.css';

const ERROR_MESSAGES = {
  // Errores de autenticación/autorización
  INVALID_INVITATION: 'No pudimos encontrar tu invitación. Revisá que el enlace que estás usando sea el mismo que te enviamos por WhatsApp.',
  
  // Errores de operaciones principales
  FETCH_ERROR: 'No pudimos cargar tu información. Tocá el botón para intentar de nuevo.',
  CREATE_ERROR: 'No pudimos crear tu reserva. Tocá el botón para intentar de nuevo.',
  UPDATE_ERROR: 'No pudimos modificar tu reserva. Tocá el botón para intentar de nuevo.',
  CANCEL_ERROR: 'No pudimos cancelar tu reserva. Tocá el botón para intentar de nuevo.',
};

const getErrorMessage = (error) => {
  if (!error) return null;
  
  // Errores de invitación (formato inválido o no encontrada)
  if (error.response?.status === 400 || error.status === 400 || 
      error.response?.status === 404 || error.status === 404) {
    return ERROR_MESSAGES.INVALID_INVITATION;
  }
  
  // Otros errores específicos
  if (error.response?.status === 500) {
    return ERROR_MESSAGES.CREATE_ERROR;
  }
  
  return ERROR_MESSAGES.FETCH_ERROR;
};

const Reservation = ({reservationType, onReservationChange}) => {
  const { guestInfo, loading: rsvpLoading } = useRSVP();
  const [showForm, setShowForm] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, message: null });
  const fetchRef = useRef();

  const invitationId = new URLSearchParams(window.location.search).get('inv');

  fetchRef.current = async (shouldSetLoading = true) => {
    if (shouldSetLoading) {
      setLoading(true);
    }
    setStatus({ type: null, message: null });
    
    try {
      if (!invitationId) {
        setStatus({
          type: 'error',
          message: ERROR_MESSAGES.INVALID_INVITATION
        });
        if (shouldSetLoading) {
          setLoading(false);
        }
        return;
      }

      const reservationData = await getReservation(invitationId, reservationType);
      setReservation(reservationData);
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setStatus({
        type: 'error',
        message: getErrorMessage(error)
      });
    } finally {
      if (shouldSetLoading) {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!rsvpLoading) {
      if (!guestInfo) {
        setLoading(false);
        setStatus({
          type: 'error',
          message: ERROR_MESSAGES.INVALID_INVITATION
        });
        return;
      }
      fetchRef.current(true);
    }
  }, [guestInfo, rsvpLoading]);

  useEffect(() => {
    if (!invitationId) {
      setLoading(false);
      setStatus({
        type: 'error',
        message: ERROR_MESSAGES.INVALID_INVITATION
      });
    }
  }, [invitationId]);

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
          {status.message !== ERROR_MESSAGES.INVALID_INVITATION && (
            <Button 
              onClick={() => fetchRef.current(true)}
              className={styles.retryButton}
            >
              Intentar de nuevo
            </Button>
          )}
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
            onRetry={() => fetchRef.current(true)}
            onSuccess={handleReservationSuccess}
            onCancelSuccess={handleCancelSuccess}
            onCancelError={handleCancelError}
            onError={(errorType) => setStatus({
              type: 'error',
              message: ERROR_MESSAGES[errorType]
            })}
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