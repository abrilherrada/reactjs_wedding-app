import { useState } from 'react';
import PropTypes from 'prop-types';
import { deleteLodgingReservation } from '../../../services/lodging_services';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import styles from './LodgingStatus.module.css';

const LodgingStatus = ({ 
  reservation, 
  onModify, 
  onCancelSuccess, 
  onCancelError 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { guests } = reservation;

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      await deleteLodgingReservation(reservation.invitationId);
      onCancelSuccess();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      onCancelError();
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <h4>Tu reserva</h4>
      
      <div className={styles.guestList}>
        {guests.map((guest, index) => (
          <div key={`guest-${index}`}>
            <span>{guest}</span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button 
          onClick={onModify}
        >
          Modificar reserva
        </Button>
        <Button 
          onClick={() => setShowConfirmModal(true)}
        >
          Cancelar reserva
        </Button>
      </div>

      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          title="Cancelar reserva"
          message="¿Seguro que querés cancelar tu reserva?"
          confirmText={isSubmitting ? 'Enviando...' : 'Cancelar reserva'}
          cancelText="Volver"
          onConfirm={handleCancel}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

LodgingStatus.propTypes = {
  reservation: PropTypes.shape({
    invitationId: PropTypes.string.isRequired,
    guests: PropTypes.arrayOf(PropTypes.string).isRequired,
    adults: PropTypes.number.isRequired,
    children: PropTypes.number.isRequired
  }).isRequired,
  onModify: PropTypes.func.isRequired,
  onCancelSuccess: PropTypes.func.isRequired,
  onCancelError: PropTypes.func.isRequired
};

export default LodgingStatus;