import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateRSVPStatus } from '../../../services/services';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import styles from './AttendanceForm.module.css';

const AttendanceForm = ({ guestInfo, onSubmitSuccess, onGoBack, isModifying = false }) => {
  const [submitting, setSubmitting] = useState(false);
  const [decliningAll, setDecliningAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const [formData, setFormData] = useState({
    mainGuest: { ...guestInfo.mainGuest },
    companion: guestInfo.hasCompanion ? { ...guestInfo.companion } : null,
    children: guestInfo.hasChildren ? [...guestInfo.children] : [],
    dietaryRestrictionsInGroup: guestInfo.dietaryRestrictionsInGroup || '',
    songRequest: guestInfo.songRequest || '',
    additionalNotes: guestInfo.additionalNotes || ''
  });

  // Update form data when guestInfo changes
  useEffect(() => {
    setFormData({
      mainGuest: { ...guestInfo.mainGuest },
      companion: guestInfo.hasCompanion ? { ...guestInfo.companion } : null,
      children: guestInfo.hasChildren ? [...guestInfo.children] : [],
      dietaryRestrictionsInGroup: guestInfo.dietaryRestrictionsInGroup || '',
      songRequest: guestInfo.songRequest || '',
      additionalNotes: guestInfo.additionalNotes || ''
    });
  }, [guestInfo]);

  // Pre-check main guest's checkbox if they're the only guest
  useEffect(() => {
    if (!isModifying && !guestInfo.hasCompanion && !guestInfo.hasChildren) {
      setFormData(prevData => ({
        ...prevData,
        mainGuest: { ...prevData.mainGuest, attending: true }
      }));
    }
  }, []); // Only run on mount

  // Handle main guest or companion attendance
  const handleSingleGuestAttendance = (guestType) => (e) => {
    const attending = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [guestType]: { ...prev[guestType], attending }
    }));
  };

  // Handle child attendance
  const handleChildAttendance = (index) => (e) => {
    const attending = e.target.checked;
    setFormData(prev => {
      const updatedChildren = [...prev.children];
      updatedChildren[index] = { ...updatedChildren[index], attending };
      return { ...prev, children: updatedChildren };
    });
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const generateSummaryMessage = () => {
    const attending = [];
    const notAttending = [];

    // Add main guest
    if (formData.mainGuest.attending) {
      attending.push(formData.mainGuest.name);
    } else {
      notAttending.push(formData.mainGuest.name);
    }

    // Add companion if exists
    if (guestInfo.hasCompanion && formData.companion) {
      if (formData.companion.attending) {
        attending.push(formData.companion.name);
      } else {
        notAttending.push(formData.companion.name);
      }
    }

    // Add children if any
    if (guestInfo.hasChildren && formData.children.length > 0) {
      formData.children.forEach(child => {
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

    if (formData.dietaryRestrictionsInGroup) {
      message += `Restricciones alimentarias:\n${formData.dietaryRestrictionsInGroup}\n\n`;
    }

    if (formData.songRequest) {
      message += `Canción solicitada:\n${formData.songRequest}\n\n`;
    }

    if (formData.additionalNotes) {
      message += `Notas adicionales:\n${formData.additionalNotes}`;
    }

    return message.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setStatus({ type: null, message: null });

    try {
      // Check if any guest is attending
      const anyAttending = formData.mainGuest?.attending || 
        (guestInfo.hasCompanion && formData.companion?.attending) ||
        (guestInfo.hasChildren && formData.children.some(child => child.attending));

      // If no one is attending and this is not a modification, set all to false
      const updateData = {
        invitationId: guestInfo.invitationId,
        mainGuest: {
          ...formData.mainGuest,
          attending: !isModifying && !anyAttending ? false : formData.mainGuest?.attending
        },
        companion: guestInfo.hasCompanion ? {
          ...formData.companion,
          attending: !isModifying && !anyAttending ? false : formData.companion?.attending
        } : null,
        children: guestInfo.hasChildren ? formData.children.map(child => ({
          ...child,
          attending: !isModifying && !anyAttending ? false : child.attending
        })) : [],
        dietaryRestrictionsInGroup: formData.dietaryRestrictionsInGroup,
        songRequest: formData.songRequest,
        additionalNotes: formData.additionalNotes
      };

      const updatedGuestInfo = await updateRSVPStatus(updateData);
      onSubmitSuccess(updatedGuestInfo);
    } catch (err) {
      // TODO: Remove console.error before deploying to production
      console.error('Error updating RSVP:', err);
      setStatus({
        type: 'error',
        message: 'Hubo un error al guardar tu respuesta. Por favor, intentá de nuevo.'
      });
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleDeclineAll = async () => {
    setDecliningAll(true);
    setStatus({ type: null, message: null });

    try {
      const updateData = {
        invitationId: guestInfo.invitationId,
        mainGuest: { ...guestInfo.mainGuest, attending: false },
        companion: guestInfo.hasCompanion ? { ...guestInfo.companion, attending: false } : null,
        children: guestInfo.hasChildren ? guestInfo.children.map(child => ({ ...child, attending: false })) : [],
        dietaryRestrictionsInGroup: '',
        songRequest: '',
        additionalNotes: ''
      };

      const updatedGuestInfo = await updateRSVPStatus(updateData);
      onSubmitSuccess(updatedGuestInfo);
    } catch (err) {
      console.error('Error updating RSVP:', err);
      setStatus({
        type: 'error',
        message: 'Hubo un error al guardar tu respuesta. Por favor, intentá de nuevo.'
      });
    } finally {
      setDecliningAll(false);
      setShowDeclineModal(false);
    }
  };

  const handleCancelDecline = () => {
    setShowDeclineModal(false);
    setStatus({ type: null, message: null });
  };

  const handleOpenDeclineModal = (e) => {
    e.preventDefault();
    setShowDeclineModal(true);
    setStatus({ type: null, message: null });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.guestsSection}>
          <h3>¿Quiénes van a asistir?</h3>
          
          <label className={styles.guestItem}>
            <input
              type="checkbox"
              checked={formData.mainGuest?.attending || false}
              onChange={handleSingleGuestAttendance('mainGuest')}
            />
            <span>{guestInfo?.mainGuest.name}</span>
          </label>

          {guestInfo?.hasCompanion && (
            <label className={styles.guestItem}>
              <input
                type="checkbox"
                checked={formData.companion?.attending || false}
                onChange={handleSingleGuestAttendance('companion')}
              />
              <span>{guestInfo.companion.name}</span>
            </label>
          )}

          {guestInfo?.hasChildren && guestInfo.children.map((child, index) => (
            <label key={index} className={styles.guestItem}>
              <input
                type="checkbox"
                checked={formData.children[index]?.attending || false}
                onChange={handleChildAttendance(index)}
              />
              <span>{child.name}</span>
            </label>
          ))}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dietary">Restricciones alimentarias:</label>
          <textarea
            id="dietary"
            value={formData.dietaryRestrictionsInGroup}
            onChange={handleInputChange('dietaryRestrictionsInGroup')}
            placeholder="Por favor, indicá si alguien tiene alguna restricción alimentaria"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="song">¿Qué canción no puede faltar?</label>
          <input
            type="text"
            id="song"
            value={formData.songRequest}
            onChange={handleInputChange('songRequest')}
            placeholder="¡Ayudanos a armar la playlist!"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="notes">Notas adicionales:</label>
          <textarea
            id="notes"
            value={formData.additionalNotes}
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
          disabled={submitting || decliningAll}
          className={styles.declineButton}
        >
          No asistirá nadie
        </Button>
      )}

      {status.message && (
        <p className={`${styles.message} ${styles[status.type]}`}>
          {status.message}
        </p>
      )}

      <Modal
        isOpen={showConfirmModal}
        title="Confirmar asistencia"
        message={generateSummaryMessage()}
        confirmText={submitting ? 'Enviando...' : 'Confirmar'}
        cancelText="Volver"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />

      <Modal
        isOpen={showDeclineModal}
        title="Confirmar ausencia"
        message="¿Estás seguro/a que nadie del grupo podrá asistir?"
        confirmText={decliningAll ? 'Enviando...' : 'Sí, nadie podrá asistir'}
        cancelText="Cancelar"
        onConfirm={handleDeclineAll}
        onCancel={handleCancelDecline}
      />
    </div>
  );
};

AttendanceForm.propTypes = {
  guestInfo: PropTypes.shape({
    invitationId: PropTypes.string.isRequired,
    mainGuest: PropTypes.shape({
      name: PropTypes.string.isRequired,
      attending: PropTypes.bool
    }).isRequired,
    hasCompanion: PropTypes.bool.isRequired,
    companion: PropTypes.shape({
      name: PropTypes.string.isRequired,
      attending: PropTypes.bool
    }),
    hasChildren: PropTypes.bool.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        attending: PropTypes.bool
    })),
    dietaryRestrictionsInGroup: PropTypes.string,
    songRequest: PropTypes.string,
    additionalNotes: PropTypes.string
  }).isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  isModifying: PropTypes.bool
};

export default AttendanceForm;