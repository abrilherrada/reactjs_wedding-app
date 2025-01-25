import { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import { updateRSVPStatus } from '../../../services/services';
import { GuestInfoShape } from '../propTypes';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import styles from './AttendanceForm.module.css';

// Define action types as constants
const ACTIONS = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  UPDATE_GUEST_ATTENDANCE: 'UPDATE_GUEST_ATTENDANCE',
  UPDATE_FIELD: 'UPDATE_FIELD',
  SET_SUBMITTING: 'SET_SUBMITTING',
  SET_DECLINING_ALL: 'SET_DECLINING_ALL',
  SET_STATUS: 'SET_STATUS',
  TOGGLE_CONFIRM_MODAL: 'TOGGLE_CONFIRM_MODAL',
  TOGGLE_DECLINE_MODAL: 'TOGGLE_DECLINE_MODAL',
  RESET_STATUS: 'RESET_STATUS'
};

// Initial state factory function
const createInitialState = (guestInfo) => ({
  formData: {
    mainGuest: { ...guestInfo.mainGuest },
    companion: guestInfo.hasCompanion ? { ...guestInfo.companion } : null,
    children: guestInfo.hasChildren ? [...guestInfo.children] : [],
    dietaryRestrictionsInGroup: guestInfo.dietaryRestrictionsInGroup || '',
    songRequest: guestInfo.songRequest || '',
    additionalNotes: guestInfo.additionalNotes || ''
  },
  submitting: false,
  decliningAll: false,
  showConfirmModal: false,
  showDeclineModal: false,
  status: { type: null, message: null }
});

// Reducer function
const formReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        formData: action.payload
      };
    case ACTIONS.UPDATE_GUEST_ATTENDANCE: {
      const { guestType, index, attending } = action.payload;
      if (guestType === 'children') {
        const updatedChildren = [...state.formData.children];
        updatedChildren[index] = { ...updatedChildren[index], attending };
        return {
          ...state,
          formData: {
            ...state.formData,
            children: updatedChildren
          }
        };
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          [guestType]: { ...state.formData[guestType], attending }
        }
      };
    }
    case ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value
        }
      };
    case ACTIONS.SET_SUBMITTING:
      return {
        ...state,
        submitting: action.payload,
        ...(action.payload === false && { showConfirmModal: false })
      };
    case ACTIONS.SET_DECLINING_ALL:
      return {
        ...state,
        decliningAll: action.payload,
        ...(action.payload === false && { showDeclineModal: false })
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
    case ACTIONS.TOGGLE_DECLINE_MODAL:
      return {
        ...state,
        showDeclineModal: action.payload
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

// Error handling utility
const getErrorMessage = (error) => {
  if (error.message?.includes('Network')) {
    return 'No pudimos conectarnos al servidor. Por favor, verificá tu conexión a internet.';
  }
  if (error.response?.status === 404) {
    return 'No pudimos encontrar tu invitación. Por favor, verificá el link.';
  }
  if (error.response?.status === 400) {
    return 'Los datos ingresados no son válidos. Por favor, intentá de nuevo.';
  }
  if (error.response?.status === 409) {
    return 'Ya no es posible modificar tu respuesta. Si necesitás hacer cambios, contactanos directamente.';
  }
  return 'Hubo un error al guardar tu respuesta. Por favor, intentá de nuevo.';
};

const AttendanceForm = ({ guestInfo, onSubmitSuccess, onGoBack, isModifying = false }) => {
  const [state, dispatch] = useReducer(formReducer, guestInfo, createInitialState);
  const [anyAttending, setAnyAttending] = useState(false);

  // Update form data when guestInfo changes
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_FORM_DATA, payload: createInitialState(guestInfo).formData });
  }, [guestInfo]);

  // Pre-check main guest's checkbox if they're the only guest
  useEffect(() => {
    if (!isModifying && !guestInfo.hasCompanion && !guestInfo.hasChildren) {
      dispatch({
        type: ACTIONS.UPDATE_GUEST_ATTENDANCE,
        payload: { guestType: 'mainGuest', index: null, attending: true }
      });
    }
  }, []); // Only run on mount

  // Update anyAttending whenever formData changes
  useEffect(() => {
    const isAnyoneAttending = state.formData.mainGuest?.attending || 
      (guestInfo.hasCompanion && state.formData.companion?.attending) ||
      (guestInfo.hasChildren && state.formData.children.some(child => child.attending));
    
    setAnyAttending(isAnyoneAttending);
  }, [state.formData, guestInfo.hasCompanion, guestInfo.hasChildren]);

  const handleAttendanceChange = useCallback((guestType, index = null) => (e) => {
    dispatch({
      type: ACTIONS.UPDATE_GUEST_ATTENDANCE,
      payload: { guestType, index, attending: e.target.checked }
    });
  }, []);

  const handleInputChange = (field) => (e) => {
    dispatch({
      type: ACTIONS.UPDATE_FIELD,
      payload: { field, value: e.target.value }
    });
  };

  const summaryMessage = useMemo(() => {
    const attending = [];
    const notAttending = [];

    // Add main guest
    if (state.formData.mainGuest.attending) {
      attending.push(state.formData.mainGuest.name);
    } else {
      notAttending.push(state.formData.mainGuest.name);
    }

    // Add companion if exists
    if (guestInfo.hasCompanion && state.formData.companion) {
      if (state.formData.companion.attending) {
        attending.push(state.formData.companion.name);
      } else {
        notAttending.push(state.formData.companion.name);
      }
    }

    // Add children if any
    if (guestInfo.hasChildren && state.formData.children.length > 0) {
      state.formData.children.forEach(child => {
        if (child.attending) {
          attending.push(child.name);
        } else {
          notAttending.push(child.name);
        }
      });
    }

    let message = '';
    
    if (attending.length > 0) {
      message += 'Asistirán:\n' + attending.join('\n') + '\n\n';
    }
    
    if (notAttending.length > 0) {
      message += 'No asistirán:\n' + notAttending.join('\n') + '\n\n';
    }

    if (anyAttending && state.formData.dietaryRestrictionsInGroup) {
      message += `Restricciones alimentarias:\n${state.formData.dietaryRestrictionsInGroup}\n\n`;
    }

    if (state.formData.songRequest) {
      message += `Canción solicitada:\n${state.formData.songRequest}\n\n`;
    }

    if (state.formData.additionalNotes) {
      message += `Notas adicionales:\n${state.formData.additionalNotes}`;
    }

    return message.trim();
  }, [state.formData, guestInfo.hasCompanion, guestInfo.hasChildren, anyAttending]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: true });
  };

  const handleConfirmSubmit = async () => {
    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });
    dispatch({ type: ACTIONS.RESET_STATUS });

    try {
      // If no one is attending and this is not a modification, set all to false
      const updateData = {
        invitationId: guestInfo.invitationId,
        mainGuest: {
          ...state.formData.mainGuest,
          attending: !isModifying && !anyAttending ? false : state.formData.mainGuest?.attending
        },
        companion: guestInfo.hasCompanion ? {
          ...state.formData.companion,
          attending: !isModifying && !anyAttending ? false : state.formData.companion?.attending
        } : null,
        children: guestInfo.hasChildren ? state.formData.children.map(child => ({
          ...child,
          attending: !isModifying && !anyAttending ? false : child.attending
        })) : [],
        dietaryRestrictionsInGroup: anyAttending ? state.formData.dietaryRestrictionsInGroup : '',
        songRequest: state.formData.songRequest,
        additionalNotes: state.formData.additionalNotes
      };

      const updatedGuestInfo = await updateRSVPStatus(updateData);
      onSubmitSuccess(updatedGuestInfo);
    } catch (err) {
      dispatch({
        type: ACTIONS.SET_STATUS,
        payload: {
          type: 'error',
          message: getErrorMessage(err)
        }
      });
    } finally {
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
    }
  };

  const handleDeclineAll = async () => {
    dispatch({ type: ACTIONS.SET_DECLINING_ALL, payload: true });
    dispatch({ type: ACTIONS.RESET_STATUS });

    try {
      const updateData = {
        invitationId: guestInfo.invitationId,
        mainGuest: { ...guestInfo.mainGuest, attending: false },
        companion: guestInfo.hasCompanion ? { ...guestInfo.companion, attending: false } : null,
        children: guestInfo.hasChildren ? guestInfo.children.map(child => ({ ...child, attending: false })) : [],
        dietaryRestrictionsInGroup: ''
      };

      const updatedGuestInfo = await updateRSVPStatus(updateData);
      onSubmitSuccess(updatedGuestInfo);
    } catch (err) {
      dispatch({
        type: ACTIONS.SET_STATUS,
        payload: {
          type: 'error',
          message: getErrorMessage(err)
        }
      });
    } finally {
      dispatch({ type: ACTIONS.SET_DECLINING_ALL, payload: false });
    }
  };

  const handleCancelDecline = () => {
    dispatch({ type: ACTIONS.TOGGLE_DECLINE_MODAL, payload: false });
    dispatch({ type: ACTIONS.RESET_STATUS });
  };

  const handleOpenDeclineModal = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.TOGGLE_DECLINE_MODAL, payload: true });
    dispatch({ type: ACTIONS.RESET_STATUS });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.guestsSection}>
          <h3>¿Quiénes van a asistir?</h3>
          
          <label className={styles.guestItem}>
            <input
              type="checkbox"
              checked={state.formData.mainGuest?.attending || false}
              onChange={handleAttendanceChange('mainGuest')}
            />
            <span>{guestInfo?.mainGuest.name}</span>
          </label>

          {guestInfo?.hasCompanion && (
            <label className={styles.guestItem}>
              <input
                type="checkbox"
                checked={state.formData.companion?.attending || false}
                onChange={handleAttendanceChange('companion')}
              />
              <span>{guestInfo.companion.name}</span>
            </label>
          )}

          {guestInfo?.hasChildren && guestInfo.children.map((child, index) => (
            <label key={index} className={styles.guestItem}>
              <input
                type="checkbox"
                checked={state.formData.children[index]?.attending || false}
                onChange={handleAttendanceChange('children', index)}
              />
              <span>{child.name}</span>
            </label>
          ))}
        </div>
        
        {anyAttending ?
            <div className={styles.inputGroup}>
              <label htmlFor="dietary">Restricciones alimentarias:</label>
              <textarea
                id="dietary"
                value={state.formData.dietaryRestrictionsInGroup}
                onChange={handleInputChange('dietaryRestrictionsInGroup')}
                placeholder="Por favor, indicá si alguien tiene alguna restricción alimentaria"
              />
            </div>
        : null
        }

        <div className={styles.inputGroup}>
          <label htmlFor="song">¿Qué canción no puede faltar?</label>
          <input
            type="text"
            id="song"
            value={state.formData.songRequest}
            onChange={handleInputChange('songRequest')}
            placeholder="¡Ayudanos a armar la playlist!"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="notes">Notas adicionales:</label>
          <textarea
            id="notes"
            value={state.formData.additionalNotes}
            onChange={handleInputChange('additionalNotes')}
            placeholder="¿Hay algo más que quieras contarnos?"
          />
        </div>

        <div className={styles.buttonGroup}>
          <Button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onGoBack();
            }}
            className={styles.backButton}
          >
            Volver
          </Button>
          <Button 
            type="submit" 
            className={styles.submitButton}
          >
            Confirmar
          </Button>
        </div>
      </form>

      {isModifying && 
       !(guestInfo.mainGuest.attending === false && 
         (!guestInfo.hasCompanion || guestInfo.companion.attending === false) &&
         (!guestInfo.hasChildren || guestInfo.children.every(child => child.attending === false))) && (
        <Button
          type="button"
          onClick={handleOpenDeclineModal}
          disabled={state.submitting || state.decliningAll}
          className={styles.declineButton}
        >
          No asistirá nadie
        </Button>
      )}

      {state.status.message && (
        <p className={`${styles.message} ${styles[state.status.type]}`}>
          {state.status.message}
        </p>
      )}

      <Modal
        isOpen={state.showConfirmModal}
        title="Confirmar asistencia"
        message={summaryMessage}
        confirmText={state.submitting ? 'Enviando...' : 'Confirmar'}
        cancelText="Volver"
        onConfirm={handleConfirmSubmit}
        onCancel={() => dispatch({ type: ACTIONS.TOGGLE_CONFIRM_MODAL, payload: false })}
      />

      <Modal
        isOpen={state.showDeclineModal}
        title="Confirmar ausencia"
        message="¿Estás seguro/a que nadie del grupo podrá asistir?"
        confirmText={state.decliningAll ? 'Enviando...' : 'Sí, nadie podrá asistir'}
        cancelText="Cancelar"
        onConfirm={handleDeclineAll}
        onCancel={handleCancelDecline}
      />
    </div>
  );
};

AttendanceForm.propTypes = {
  guestInfo: GuestInfoShape.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  isModifying: PropTypes.bool
};

export default AttendanceForm;