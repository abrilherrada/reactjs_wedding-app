import { useState, useEffect, useMemo, useReducer } from 'react';
import { getRSVPInfo } from '../../../services/rsvp_services';
import { getAvailability, createReservation, updateReservation, deleteReservation } from '../../../services/reservation_services';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import Spinner from '../../Spinner/Spinner';
import WarningIcon from '../../../assets/icons/WarningIcon';
import styles from './ReservationForm.module.css';

const ERROR_MESSAGES = {
  AVAILABILITY_ERROR: 'Hubo un error al consultar la disponibilidad. Tocá el botón para intentar de nuevo.',
  NO_AVAILABILITY: 'Ya no hay lugares disponibles. ☹️',
  SPOTS_TAKEN: 'Pestañaste. Alguien más se quedó con los últimos lugares. 🫠',
  EMPTY_SELECTION: 'Para poder continuar, tenés que marcar las personas para las cuales querés hacer la reserva.'
};

const ACTIONS = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  UPDATE_GUEST_SELECTION: 'UPDATE_GUEST_SELECTION',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_STATUS: 'SET_STATUS',
  TOGGLE_CONFIRM_MODAL: 'TOGGLE_CONFIRM_MODAL',
  TOGGLE_EMPTY_MODAL: 'TOGGLE_EMPTY_MODAL',
  TOGGLE_CANCEL_MODAL: 'TOGGLE_CANCEL_MODAL',
  TOGGLE_NO_CHANGES_MODAL: 'TOGGLE_NO_CHANGES_MODAL',
  RESET_STATUS: 'RESET_STATUS'
};

const createInitialState = (guestInfo, existingReservation = null) => {
  const guests = guestInfo ? [
    guestInfo.mainGuest,
    ...(guestInfo.hasCompanion ? [guestInfo.companion] : []),
    ...(guestInfo.hasChildren ? guestInfo.children : [])
  ].filter(guest => guest.attending === true) : [];

  const mappedGuests = guests.map(guest => ({
    ...guest,
    selected: existingReservation?.guests.includes(guest.name) ?? false
  }));

  // Calculate initial counts based on selected guests
  const selectedGuests = mappedGuests.filter(guest => guest.selected);
  const adults = selectedGuests.filter(guest => !guest.isChild).length;
  const children = selectedGuests.filter(guest => guest.isChild).length;

  return {
    formData: {
      guests: mappedGuests,
      adults,
      children
    },
    submitting: false,
    showConfirmModal: false,
    showEmptyModal: false,
    showCancelModal: false,
    showNoChangesModal: false,
    status: { type: null, message: null }
  };
};

const formReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        formData: action.payload
      };
    case ACTIONS.UPDATE_GUEST_SELECTION: {
      const { index, selected } = action.payload;
      const updatedGuests = state.formData.guests.map((guest, i) => 
        i === index ? { ...guest, selected } : guest
      );
      
      // Recompute adults and children counts
      const selectedGuests = updatedGuests.filter(guest => guest.selected);
      const adults = selectedGuests.filter(guest => !guest.isChild).length;
      const children = selectedGuests.filter(guest => guest.isChild).length;
      
      return {
        ...state,
        formData: {
          ...state.formData,
          guests: updatedGuests,
          adults,
          children
        }
      };
    }
    case ACTIONS.SET_SUBMITTING:
      return {
        ...state,
        submitting: action.payload
      };
    case ACTIONS.SET_STATUS:
      return {
        ...state,
        status: action.payload
      };
    case ACTIONS.TOGGLE_CONFIRM_MODAL:
      return {
        ...state,
        showConfirmModal: action.payload
      };
    case ACTIONS.TOGGLE_EMPTY_MODAL:
      return {
        ...state,
        showEmptyModal: action.payload
      };
    case ACTIONS.TOGGLE_CANCEL_MODAL:
      return {
        ...state,
        showCancelModal: action.payload
      };
    case ACTIONS.TOGGLE_NO_CHANGES_MODAL:
      return {
        ...state,
        showNoChangesModal: action.payload
      };
    case ACTIONS.RESET_STATUS:
      return {
        ...state,
        status: { type: null, message: null }
      };
    default:
      return state;
  }
};

const ReservationForm = ({
  invitationId,
  reservationType,
  onClose,
  onRetry,
  onSuccess,
  onCancelSuccess,
  onCancelError,
  onError,
  isModifying = false,
  reservation = null
}) => {
  // State for guest and availability information
  const [guestInfo, setGuestInfo] = useState(null);
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add form state management
  const [formState, dispatch] = useReducer(formReducer, null, () => 
    createInitialState(guestInfo, reservation)
  );

  // Effect for fetching initial data
  useEffect(() => {
    if (!invitationId) {
      onError?.('INVALID_INVITATION');
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Fetch both guest info and availability in parallel
        const [guestData, availabilityData] = await Promise.all([
          getRSVPInfo(invitationId),
          getAvailability(reservationType, invitationId)
        ]);

        setGuestInfo(guestData);
        setAvailabilityInfo(availabilityData);
        
        // Check if there are spots available
        if (availabilityData.takenSpots >= availabilityData.totalSpots) {
          dispatch({
            type: ACTIONS.SET_STATUS,
            payload: {
              type: 'error',
              message: ERROR_MESSAGES.NO_AVAILABILITY
            }
          });
        }
      } catch (error) {
        // Si el error es de invitación (400 o 404), propagar al padre
        if (error.status === 400 || error.status === 404 || 
            error.response?.status === 400 || error.response?.status === 404) {
          onError?.('INVALID_INVITATION');
        } else {
          // Si el error es de getAvailability, manejarlo localmente
          dispatch({
            type: ACTIONS.SET_STATUS,
            payload: {
              type: 'error',
              message: ERROR_MESSAGES.AVAILABILITY_ERROR
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [invitationId, reservationType, onError]);

  // Effect for updating availability info when reservations change
  useEffect(() => {
    const updateAvailability = async () => {
      try {
        const availabilityData = await getAvailability(reservationType, invitationId);
        setAvailabilityInfo(availabilityData);
        
        // Check if there are spots available
        if (availabilityData.takenSpots >= availabilityData.totalSpots) {
          dispatch({
            type: ACTIONS.SET_STATUS,
            payload: {
              type: 'error',
              message: ERROR_MESSAGES.NO_AVAILABILITY
            }
          });
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
        dispatch({
          type: ACTIONS.SET_STATUS,
          payload: {
            type: 'error',
            message: ERROR_MESSAGES.AVAILABILITY_ERROR
          }
        });
      }
    };

    // Only update availability if we're modifying an existing reservation
    if (isModifying) {
      updateAvailability();
    }
  }, [isModifying, reservation, reservationType, invitationId]);

  // Derived state for guest attendance
  const attendanceStatus = useMemo(() => {
    if (!guestInfo) return null;
    
    const guests = [
      guestInfo.mainGuest,
      ...(guestInfo.hasCompanion ? [guestInfo.companion] : []),
      ...(guestInfo.hasChildren ? guestInfo.children : [])
    ];
    
    const attending = guests.filter(guest => guest.attending === true);
    const notAttending = guests.filter(guest => guest.attending === false);
    const pending = guests.filter(guest => guest.attending === null);
    
    return {
      attending,
      notAttending,
      pending,
      allPending: guests.length === pending.length,
      noneAttending: guests.length === notAttending.length
    };
  }, [guestInfo]);

  // Check if form needs initialization
  const hasNoGuests = formState.formData.guests.length === 0;

  // Update form data when guest info changes
  useEffect(() => {
    if (guestInfo && hasNoGuests) {
      dispatch({ 
        type: ACTIONS.SET_FORM_DATA, 
        payload: createInitialState(guestInfo, reservation).formData 
      });
    }
  }, [guestInfo, reservation, hasNoGuests]);

  const summaryMessage = useMemo(() => {
    let guests = formState.formData.guests.filter(guest => guest.selected).map(guest => (
      <li key={guest.name}>{guest.name}</li>
    ));

    return (
      <>
        <p>¿Confirmás la reserva para las siguientes personas?</p>
        <ul className={styles.confirmModalList}>
          {guests}
        </ul>
      </>
    )
  }, [formState.formData.guests]);

  const checkForChanges = () => {
    if (!isModifying) {
      return formState.formData.guests.some(guest => guest.selected);
    }

    const currentGuests = formState.formData.guests
      .filter(guest => guest.selected)
      .map(guest => guest.name)
      .sort();
    const originalGuests = reservation.guests.sort();

    const guestsChanged = currentGuests.length !== originalGuests.length ||
      currentGuests.some((guest, index) => guest !== originalGuests[index]);

    const adultsChanged = formState.formData.adults !== reservation.adults;
    const childrenChanged = formState.formData.children !== reservation.children;

    return guestsChanged || adultsChanged || childrenChanged;
  };

  const handleConfirmClick = () => {
    const hasSelectedGuests = formState.formData.guests.some(guest => guest.selected);
    
    // Si estamos modificando una reserva existente y no hay invitados seleccionados, mostrar modal de cancelación
    if (isModifying && !hasSelectedGuests) {
      dispatch({ type: ACTIONS.TOGGLE_CANCEL_MODAL, payload: true });
      return;
    }

    // Verificar si hay invitados seleccionados (para nuevas reservas)
    if (!hasSelectedGuests) {
      dispatch({ type: ACTIONS.TOGGLE_EMPTY_MODAL, payload: true });
      return;
    }

    // Verificar si hay cambios
    if (!checkForChanges()) {
      dispatch({ type: ACTIONS.TOGGLE_NO_CHANGES_MODAL, payload: true });
      return;
    }

    dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: true });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });
    dispatch({ type: ACTIONS.RESET_STATUS });
    
    try {
      const selectedGuests = formState.formData.guests.filter(guest => guest.selected);

      const reservationData = {
        guests: selectedGuests.map(guest => guest.name),
        adults: formState.formData.adults,
        children: formState.formData.children
      };

      const response = isModifying 
        ? await updateReservation(invitationId, reservationData, reservationType)
        : await createReservation(invitationId, reservationData, reservationType);
      
      onSuccess(response);
    } catch (error) {
      // Manejar error de spots tomados localmente
      if (error.status === 409) {
        dispatch({
          type: ACTIONS.SET_STATUS,
          payload: { 
            type: 'error',
            message: ERROR_MESSAGES.SPOTS_TAKEN
          }
        });
      } else {
        // Propagar otros errores al padre
        onError?.(isModifying ? 'UPDATE_ERROR' : 'CREATE_ERROR');
      }
    } finally {
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
      dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: false });
    }
  };

  // Handle reservation cancellation
  const handleCancel = async () => {
    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });
    dispatch({ type: ACTIONS.RESET_STATUS });
    
    try {
      await deleteReservation(invitationId, reservationType);
      onCancelSuccess();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      onCancelError();
    } finally {
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
      dispatch({ type: ACTIONS.TOGGLE_CANCEL_MODAL, payload: false });
    }
  };

  const renderContent = () => {
    if (!attendanceStatus) return null;

    if (attendanceStatus.allPending) {
      return (
        <>
          <div className={`${styles.messageContainer} ${styles.error}`}>
            <p>Para poder hacer una reserva{reservationType === 'lodging' ? ' de alojamiento' : (reservationType === 'transportation' ? ' de transporte' : '')}, primero tenés que confirmar que vas a asistir a la boda.</p>
            <p>Usá el siguiente botón para ir a la sección de asistencia, seguí los pasos y después volvé para hacer tu reserva.</p>
          </div>
          <div className={styles.messageActions}>
            <Button
              as="a"
              href="#rsvp"
              role="button"
              className={styles.rsvpButton}
            >
              Confirmación de asistencia
            </Button>
          </div>
        </>
      );
    }

    if (attendanceStatus.noneAttending) {
      return (
        <>
          <div className={`${styles.messageContainer} ${styles.error}`}>
            <p>Como confirmaste que no vas a asistir a la boda, no podés hacer una reserva{reservationType === 'lodging' ? ' de alojamiento' : (reservationType === 'transportation' ? ' de transporte' : '')}.</p>
            <p>Si cambiaste de opinión y querés asistir, podés modificar tu respuesta en la sección de asistencia.</p>
            <p>Una vez que confirmes tu asistencia, vas a poder hacer tu reserva.</p>
          </div>
          <div className={styles.messageActions}>
            <Button
              as="a"
              href="#rsvp"
              role="button"
              className={styles.rsvpButton}
            >
              Confirmación de asistencia
            </Button>
          </div>
        </>
      );
    }

    // Check if availability info is loaded
    if (!availabilityInfo) {
      return (
        <>
          <div className={`${styles.messageContainer} ${styles.error}`}>
            <p className={styles.message}>
              <span>
                <WarningIcon />
              </span>
              <span>{ERROR_MESSAGES.AVAILABILITY_ERROR}</span>
            </p>
          </div>
          <div className={styles.messageActions}>
            <Button onClick={onClose}>Volver</Button>
            <Button onClick={onRetry}>Intentar de nuevo</Button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className={styles.availabilityInfo}>
          <span className={styles.availabilityText}>Quedan {availabilityInfo.totalSpots - availabilityInfo.takenSpots} lugares</span>
        </div>
        
        <div className={styles.guestList}>
          <h4 className={styles.guestListTitle}>¿Quiénes {reservationType === 'lodging' ? 'se quedan' : (reservationType === 'transportation' ? 'viajan' : 'son parte de la reserva')}?</h4>
          <p>Seleccioná a las personas que {reservationType === 'lodging' ? 'se van a alojar en el hotel del salón' : (reservationType === 'transportation' ? 'van a trasladarse en trafic' : 'son parte de la reserva')}.</p>
          
          {/* Attending guests */}
          {attendanceStatus.attending.map((guest, index) => (
            <label key={guest.name} className={styles.guestItem}>
              <input
                type="checkbox"
                checked={formState.formData.guests[index]?.selected ?? false}
                onChange={(e) => dispatch({
                  type: ACTIONS.UPDATE_GUEST_SELECTION,
                  payload: { index, selected: e.target.checked }
                })}
              />
              <div className={styles.checkmark}></div>
              <span>{guest.name}</span>
            </label>
          ))}
          
          {/* Not attending guests */}
          <div className={styles.notAttendingContainer}>
            <div className={styles.notAttendingList}>
              {attendanceStatus.notAttending.map((guest) => (
                <div key={guest.name} className={`${styles.guestItem} ${styles.notAttending}`}>
                  <span className={styles.notAttendingIcon}>❌</span>
                  <span>{guest.name}</span>
                </div>
              )
              )}
            </div>
            <div>
              {attendanceStatus.notAttending.length > 0 && (
                <span className={styles.notAttendingMessage}>
                  No se puede reservar lugares para las personas marcadas con una X roja porque informaste que no asistirán a la boda.
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Button onClick={onClose}>Volver</Button>
          <Button onClick={handleConfirmClick}>
            Confirmar reserva
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <Spinner />
      ) : formState.status?.type === 'error' ? (
        <>
          <div className={`${styles.messageContainer} ${styles.error}`}>
            <p className={styles.message}>
              <span>
                <WarningIcon />
              </span>
              <span>{formState.status.message}</span>
            </p>
          </div>
          <div className={styles.messageActions}>
            <Button onClick={onClose}>Volver</Button>
            <Button onClick={onRetry}>Intentar de nuevo</Button>
          </div>
        </>
      ) : (
        <>
          {renderContent()}
          
          {formState.showConfirmModal && (
            <Modal
              isOpen={formState.showConfirmModal}
              title="Información de la reserva"
              message={summaryMessage}
              confirmText={formState.submitting ? 'Enviando...' : 'Confirmar'}
              cancelText="Volver"
              onConfirm={handleSubmit}
              onCancel={() => dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: false })}
            />
          )}

          {formState.showEmptyModal && (
            <Modal
              isOpen={formState.showEmptyModal}
              title="La reserva está vacía"
              message={ERROR_MESSAGES.EMPTY_SELECTION}
              onCancel={() => dispatch({ type: ACTIONS.TOGGLE_EMPTY_MODAL, payload: false })}
            />
          )}

          {formState.showCancelModal && (
            <Modal
              isOpen={formState.showCancelModal}
              title="Cancelar reserva"
              message={`¿Estás seguro de que querés cancelar la reserva${reservationType === 'lodging' ? ' de alojamiento' : (reservationType === 'transportation' ? ' de transporte' : '')}?`}
              confirmText={formState.submitting ? 'Enviando...' : 'Sí, cancelar'}
              cancelText="No, volver"
              onConfirm={handleCancel}
              onCancel={() => dispatch({ type: ACTIONS.TOGGLE_CANCEL_MODAL, payload: false })}
            />
          )}

          {formState.showNoChangesModal && (
            <Modal
              isOpen={formState.showNoChangesModal}
              title="No hay cambios"
              message="La reserva no tuvo modificaciones. Si querés hacer cambios, modificá la selección de invitados."
              onCancel={() => dispatch({ type: ACTIONS.TOGGLE_NO_CHANGES_MODAL, payload: false })}
            />
          )}
        </>
      )}
    </div>
  );
};

ReservationForm.propTypes = {
  invitationId: PropTypes.string.isRequired,
  reservationType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancelSuccess: PropTypes.func.isRequired,
  onCancelError: PropTypes.func.isRequired,
  onError: PropTypes.func,
  isModifying: PropTypes.bool,
  reservation: PropTypes.object
};

export default ReservationForm;