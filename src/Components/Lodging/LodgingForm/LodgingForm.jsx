import { useState, useEffect, useMemo, useReducer } from 'react';
import { getRSVPInfo } from '../../../services/rsvp_services';
import { getLodgingAvailability, createLodgingReservation, updateLodgingReservation } from '../../../services/lodging_services';
import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import Spinner from '../../Spinner/Spinner';
import WarningIcon from '../../../assets/icons/WarningIcon';
import styles from './LodgingForm.module.css';

const ERROR_MESSAGES = {
  NO_INVITATION_ID: 'Para reservar tu alojamiento, usá el enlace que te enviamos por WhatsApp.',
  INVALID_INVITATION: 'No pudimos encontrar tu invitación. Revisá que el enlace que estás usando sea el mismo que te enviamos por WhatsApp.',
  NO_AVAILABILITY: 'Ya no hay lugares disponibles. ☹️',
  FETCH_ERROR: 'Hubo un error al cargar la información. Tocá el botón para intentar de nuevo.',
  AVAILABILITY_ERROR: 'Hubo un error al consultar la disponibilidad. Tocá el botón para intentar de nuevo.',
  SPOTS_TAKEN: 'Pestañaste. Alguien más se quedó con los últimos lugares. 🫠'
};

const hasConfirmedAttendance = (guest) => guest.attending === true;
const hasDeclinedAttendance = (guest) => guest.attending === false;
const hasPendingResponse = (guest) => guest.attending === null;

const ACTIONS = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  UPDATE_GUEST_SELECTION: 'UPDATE_GUEST_SELECTION',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_STATUS: 'SET_STATUS',
  TOGGLE_CONFIRM_MODAL: 'TOGGLE_CONFIRM_MODAL',
  RESET_STATUS: 'RESET_STATUS'
};

const createInitialState = (guestInfo, existingReservation = null, isModifying = false) => {
  const guests = guestInfo ? [
    guestInfo.mainGuest,
    ...(guestInfo.hasCompanion ? [guestInfo.companion] : []),
    ...(guestInfo.hasChildren ? guestInfo.children : [])
  ].filter(hasConfirmedAttendance) : [];

  return {
    formData: {
      guests: guests.map(guest => ({
        ...guest,
        selected: isModifying 
          ? existingReservation?.guests.includes(guest.name)
          : true
      })),
      adults: 0,
      children: 0
    },
    submitting: false,
    showConfirmModal: false,
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
    case ACTIONS.RESET_STATUS:
      return {
        ...state,
        status: { type: null, message: null }
      };
    default:
      return state;
  }
};

const LodgingForm = ({ invitationId, onClose, onRetry, onSuccess, isModifying = false, reservation = null }) => {
  // State for guest and availability information
  const [guestInfo, setGuestInfo] = useState(null);
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add form state management
  const [formState, dispatch] = useReducer(formReducer, null, () => 
    createInitialState(guestInfo, reservation, isModifying)
  );

  // Effect for fetching initial data
  useEffect(() => {
    if (!invitationId) {
      dispatch({
        type: ACTIONS.SET_STATUS,
        payload: {
          type: 'error',
          message: ERROR_MESSAGES.NO_INVITATION_ID
        }
      });
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Fetch both guest info and lodging availability in parallel
        const [guestData, availabilityData] = await Promise.all([
          getRSVPInfo(invitationId),
          getLodgingAvailability()
        ]);

        setGuestInfo(guestData);
        setAvailabilityInfo(availabilityData);
        
        // Check if there are spots available
        if (availabilityData.taken_spots >= availabilityData.total_spots) {
          dispatch({
            type: ACTIONS.SET_STATUS,
            payload: {
              type: 'error',
              message: ERROR_MESSAGES.NO_AVAILABILITY
            }
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        dispatch({
          type: ACTIONS.SET_STATUS,
          payload: {
            type: 'error',
            message: err.status === 404 
              ? ERROR_MESSAGES.INVALID_INVITATION 
              : ERROR_MESSAGES.FETCH_ERROR
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [invitationId]);

  // Derived state for guest attendance
  const attendanceStatus = useMemo(() => {
    if (!guestInfo) return null;
    
    const guests = [
      guestInfo.mainGuest,
      ...(guestInfo.hasCompanion ? [guestInfo.companion] : []),
      ...(guestInfo.hasChildren ? guestInfo.children : [])
    ];
    
    const attending = guests.filter(hasConfirmedAttendance);
    const notAttending = guests.filter(hasDeclinedAttendance);
    const pending = guests.filter(hasPendingResponse);
    
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
        payload: createInitialState(guestInfo, reservation, isModifying).formData 
      });
    }
  }, [guestInfo, reservation, isModifying, hasNoGuests]);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });
    
    try {
      const selectedGuests = formState.formData.guests.filter(guest => guest.selected);
      
      const reservationData = {
        guests: selectedGuests.map(guest => guest.name),
        adults: formState.formData.adults,
        children: formState.formData.children
      };

      const response = isModifying 
        ? await updateLodgingReservation(invitationId, reservationData)
        : await createLodgingReservation(invitationId, reservationData);
      
      onSuccess(response);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      dispatch({
        type: ACTIONS.SET_STATUS,
        payload: { 
          type: 'error', 
          message: error.status === 409
            ? ERROR_MESSAGES.SPOTS_TAKEN 
            : ERROR_MESSAGES.FETCH_ERROR
        }
      });
    } finally {
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
      dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: false });
    }
  };

  const renderContent = () => {
    if (!attendanceStatus) return null;

    if (attendanceStatus.allPending) {
      return (
        <>
          <div className={`${styles.messageContainer} ${styles.error}`}>
            <p>Para poder reservar alojamiento en el salón, primero tenés que confirmar que vas a asistir a la boda.</p>
            <p>Usá el siguiente botón para ir a la sección de asistencia, seguí los pasos y después volvé para reservar tu alojamiento.</p>
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
            <p>Como confirmaste que no vas a asistir a la boda, no podés reservar alojamiento en el salón.</p>
            <p>Si cambiaste de opinión y querés asistir, podés modificar tu respuesta desde la sección de asistencia.</p>
            <p>Una vez que confirmes tu asistencia, vas a poder reservar tu alojamiento.</p>
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
          <span className={styles.availabilityText}>Quedan {availabilityInfo.total_spots - availabilityInfo.taken_spots} lugares</span>
        </div>
        
        <div className={styles.guestList}>
          <h4 className={styles.guestListTitle}>¿Quiénes se quedan?</h4>
          <p>Seleccioná las personas que se van a alojar en el hotel del salón.</p>
          
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
                  No se puede reservar alojamiento para las personas marcadas con una X roja porque informaste que no asistirán a la boda.
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <Button onClick={onClose}>Volver</Button>
          <Button 
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: true })}
            disabled={formState.submitting || formState.formData.guests.every(guest => !guest.selected)}
          >
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
        </>
      )}
    </div>
  );
};

LodgingForm.propTypes = {
  invitationId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  isModifying: PropTypes.bool,
  reservation: PropTypes.object
};

export default LodgingForm;