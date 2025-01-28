import PropTypes from 'prop-types';
import { GuestInfoShape } from '../propTypes';
import Button from '../../Button/Button';
import styles from './AttendanceStatus.module.css';

const AttendanceStatus = ({ guestInfo, onModify }) => {
  const { mainGuest, companion, children, dietaryRestrictionsInGroup, songRequest, additionalNotes } = guestInfo;
  
  const renderGuestStatus = (guest, key) => (
    <div key={key} className={styles.guestItem}>
      <div>
        <span>{guest.name}</span>
      </div>
      <span className={`${styles[guest.attending ? 'attending' : 'notAttending']}`}>
        {guest.attending ? 'asistirá' : 'no asistirá'}
      </span>
    </div>
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tu respuesta</h3>
      
      <div className={styles.guestList}>
        <div className={styles.guestGroup}>
          <h4 className={styles.groupTitle}>Adultos</h4>
          {renderGuestStatus(mainGuest, 'main')}
          {companion && renderGuestStatus(companion, 'companion')}
        </div>
        
        {children && children.length > 0 && (
          <div className={styles.guestGroup}>
            <h4 className={styles.groupTitle}>Niños</h4>
            {children.map((child, index) => renderGuestStatus(child, `child-${index}`))}
          </div>
        )}
      </div>

      {(dietaryRestrictionsInGroup || songRequest || additionalNotes) && (
        <div className={styles.additionalInfo}>
          {dietaryRestrictionsInGroup && (
            <div className={styles.infoItem}>
              <p className={styles.infoTitle}>Restricciones alimentarias:</p>
              <p className={styles.infoText}>{dietaryRestrictionsInGroup}</p>
            </div>
          )}
          
          {songRequest && (
            <div className={styles.infoItem}>
              <p className={styles.infoTitle}>Música sugerida:</p>
              <p className={styles.infoText}>{songRequest}</p>
            </div>
          )}
          
          {additionalNotes && (
            <div className={styles.infoItem}>
              <p className={styles.infoTitle}>Notas adicionales:</p>
              <p className={styles.infoText}>{additionalNotes}</p>
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
  guestInfo: GuestInfoShape.isRequired,
  onModify: PropTypes.func.isRequired
};

export default AttendanceStatus;