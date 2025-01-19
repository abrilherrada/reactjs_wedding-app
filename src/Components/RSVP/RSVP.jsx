import { useState, useEffect } from 'react';
import { getRSVPInfo, updateRSVPStatus } from '../../services/services';
import Button from '../Button/Button';
import styles from './RSVP.module.css';

const RSVP = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const [guestInfo, setGuestInfo] = useState(null);
  const [formData, setFormData] = useState({
    mainGuest: { attending: null },
    companion: { attending: null },
    children: [],
    dietaryRestrictionsInGroup: '',
    songRequest: '',
    additionalNotes: ''
  });

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('invitationId');
    
    if (!invitationId) {
      setStatus({
        type: 'error',
        message: 'Por favor, usá el link que te enviamos por mail para confirmar tu asistencia.'
      });
      setInitialLoading(false);
      return;
    }

    const fetchGuestInfo = async () => {
      try {
        const data = await getRSVPInfo(invitationId);
        if (mounted) {
          setGuestInfo(data);
          setFormData({
            mainGuest: { ...data.mainGuest },
            companion: data.hasCompanion ? { ...data.companion } : null,
            children: data.hasChildren ? [...data.children] : [],
            dietaryRestrictionsInGroup: data.dietaryRestrictionsInGroup || '',
            songRequest: data.songRequest || '',
            additionalNotes: data.additionalNotes || ''
          });
        }
      } catch (err) {
        // TODO: Remove console.error before deploying to production
        console.error('Error updating RSVP:', err);
        if (mounted) {
          setStatus({
            type: 'error',
            message: 'No pudimos encontrar tu invitación. Por favor, verificá el link.'
          });
        }
      } finally {
        if (mounted) {
          setInitialLoading(false);
        }
      }
    };

    fetchGuestInfo();

    return () => {
      mounted = false;
    };
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: null });

    try {
      const updateData = {
        invitationId: guestInfo.invitationId,
        ...formData
      };
      await updateRSVPStatus(updateData);
      setStatus({
        type: 'success',
        message: '¡Gracias por confirmar tu asistencia!'
      });
    } catch (err) {
      // TODO: Remove console.error before deploying to production
      console.error('Error updating RSVP:', err);
      setStatus({
        type: 'error',
        message: 'Hubo un error al guardar tu respuesta. Por favor, intentá de nuevo.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <div className={styles.container}>Cargando...</div>;
  }

  // If we have no guest info, show the error message
  if (!guestInfo) {
    return (
      <div className={styles.container}>
        <p className={`${styles.message} ${styles.error}`}>
          {status.message}
        </p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.title}>
        <h2>CONFIRMACIÓN&nbsp;</h2>
        <h2>DE ASISTENCIA</h2>
      </header>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.guestsSection}>
          <h3>¿Quiénes van a asistir?</h3>
          
          {/* Main guest */}
          <label className={styles.guestItem}>
            <input
              type="checkbox"
              checked={formData.mainGuest?.attending || false}
              onChange={handleSingleGuestAttendance('mainGuest')}
            />
            <span>{guestInfo?.mainGuest.name}</span>
          </label>

          {/* Companion */}
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

          {/* Children */}
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

        {status.message && (
          <p className={`${styles.message} ${styles[status.type]}`}>
            {status.message}
          </p>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Confirmar'}
        </Button>
      </form>
    </section>
  );
};

export default RSVP;