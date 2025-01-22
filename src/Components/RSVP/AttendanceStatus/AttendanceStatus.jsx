import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import styles from './AttendanceStatus.module.css';

const AttendanceStatus = ({ guestInfo, onModify }) => {
  const { mainGuest, companion, children, dietaryRestrictionsInGroup, songRequest, additionalNotes } = guestInfo;
  
  const renderGuestStatus = (guest, key) => (
    <div key={key} className={styles.guestItem}>
      <div className={styles.guestInfo}>
        <span className={styles.guestName}>{guest.name}</span>
      </div>
      <span className={`${styles.status} ${styles[guest.attending ? 'attending' : 'notAttending']}`}>
        {guest.attending ? 'Asistirá' : 'No asistirá'}
      </span>
    </div>
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Estado actual de la confirmación</h3>
      
      <div className={styles.guestList}>
        <div className={styles.guestGroup}>
          <h4 className={styles.groupTitle}>Adultos</h4>
          {renderGuestStatus(mainGuest, 'main')}
          {companion && renderGuestStatus(companion, 'companion')}
        </div>
        
        {children && children.length > 0 && (
          <div className={styles.guestGroup}>
            <h4 className={styles.groupTitle}>Menores</h4>
            {children.map((child, index) => renderGuestStatus(child, `child-${index}`))}
          </div>
        )}
      </div>

      {(dietaryRestrictionsInGroup || songRequest || additionalNotes) && (
        <div className={styles.additionalInfo}>
          {dietaryRestrictionsInGroup && (
            <div className={styles.infoItem}>
              <strong>Restricciones alimentarias:</strong>
              <p>{dietaryRestrictionsInGroup}</p>
            </div>
          )}
          
          {songRequest && (
            <div className={styles.infoItem}>
              <strong>Canción solicitada:</strong>
              <p>{songRequest}</p>
            </div>
          )}
          
          {additionalNotes && (
            <div className={styles.infoItem}>
              <strong>Notas adicionales:</strong>
              <p>{additionalNotes}</p>
            </div>
          )}
        </div>
      )}

      <Button 
        onClick={onModify}
        className={styles.modifyButton}
      >
        Modificar respuesta
      </Button>
    </div>
  );
};

AttendanceStatus.propTypes = {
  guestInfo: PropTypes.shape({
    mainGuest: PropTypes.shape({
      name: PropTypes.string.isRequired,
      attending: PropTypes.bool
    }).isRequired,
    companion: PropTypes.shape({
      name: PropTypes.string.isRequired,
      attending: PropTypes.bool
    }),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        attending: PropTypes.bool
      })
    ),
    dietaryRestrictionsInGroup: PropTypes.string,
    songRequest: PropTypes.string,
    additionalNotes: PropTypes.string
  }).isRequired,
  onModify: PropTypes.func.isRequired
};

export default AttendanceStatus;