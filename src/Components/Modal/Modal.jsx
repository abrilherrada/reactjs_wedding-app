import PropTypes from 'prop-types';
import Button from '../Button/Button';
import styles from './Modal.module.css';

const Modal = ({ 
  title = '',
  message = '',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cerrar',
  isOpen 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {message && <div className={styles.message}>{message}</div>}
        
        <div className={styles.actions}>
          <Button onClick={onCancel}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isOpen: PropTypes.bool.isRequired
};

export default Modal;