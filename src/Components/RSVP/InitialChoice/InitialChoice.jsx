import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateRSVPStatus } from '../../../services/services';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import styles from './InitialChoice.module.css';

const InitialChoice = ({ guestInfo, onAttend, onDecline }) => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const [showModal, setShowModal] = useState(false);

  const handleDecline = async () => {
    setSubmitting(true);
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
      onDecline({ ...guestInfo, ...updatedGuestInfo });
    } catch (err) {
      console.error('Error updating RSVP:', err);
      setStatus({
        type: 'error',
        message: 'Hubo un error al guardar tu respuesta. Por favor, intentá de nuevo.'
      });
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <p className={styles.info}>
        Por favor, confirmá tu asistencia. Podés modificar tu respuesta hasta un mes antes del evento.
      </p>

      <div className={styles.buttonGroup}>
        <Button 
          onClick={onAttend}
          disabled={submitting}
          className={styles.attendButton}
        >
          Voy a asistir
        </Button>

        <Button 
          onClick={() => setShowModal(true)}
          disabled={submitting}
          className={styles.declineButton}
        >
          No voy a poder asistir
        </Button>
      </div>

      {status.message && (
        <p className={`message ${status.type}`}>
          {status.message}
        </p>
      )}

      <Modal
        isOpen={showModal}
        title="Confirmar ausencia"
        message="¿Estás seguro/a que no vas a poder asistir?"
        confirmText={submitting ? 'Enviando...' : 'Sí, no voy a poder asistir'}
        cancelText="Cancelar"
        onConfirm={handleDecline}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};

InitialChoice.propTypes = {
  guestInfo: PropTypes.shape({
    invitationId: PropTypes.string.isRequired,
    mainGuest: PropTypes.shape({
      name: PropTypes.string.isRequired,
      attending: PropTypes.bool
    }).isRequired,
    hasCompanion: PropTypes.bool.isRequired,
    companion: PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        attending: PropTypes.bool
      }),
      PropTypes.oneOf([null])
    ]),
    hasChildren: PropTypes.bool.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      attending: PropTypes.bool
    }))
  }).isRequired,
  onAttend: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired
};

export default InitialChoice;