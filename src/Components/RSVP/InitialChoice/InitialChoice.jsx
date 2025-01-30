import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateRSVPStatus } from '../../../services/services';
import { GuestInfoShape } from '../propTypes';
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
        message: 'Algo malió sal y tu respuesta no se guardó. Cruzá los dedos y probá de nuevo.'
      });
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.info}>
        Confirmá tu asistencia lo antes posible para que podamos encargar las salchichas y los panes 😂. Si después cambiás de idea, podés modificar tu respuesta hasta el 30 de julio.
      </p>

      <div className={styles.buttonGroup}>
        <Button 
          onClick={onAttend}
          disabled={submitting}
        >
          Sí, voy a asistir
        </Button>

        <Button 
          onClick={() => setShowModal(true)}
          disabled={submitting}
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
        message="¿Seguro que no vas a poder asistir?"
        confirmText={submitting ? 'Enviando...' : 'No asistiré'}
        cancelText="Volver"
        onConfirm={handleDecline}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

InitialChoice.propTypes = {
  guestInfo: GuestInfoShape.isRequired,
  onAttend: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired
};

export default InitialChoice;