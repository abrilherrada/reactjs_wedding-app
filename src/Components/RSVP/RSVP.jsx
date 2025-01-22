import { useState, useEffect } from 'react';
import { getRSVPInfo } from '../../services/services';
import AttendanceForm from './AttendanceForm/AttendanceForm';
import InitialChoice from './InitialChoice/InitialChoice';
import AttendanceStatus from './AttendanceStatus/AttendanceStatus';
import Spinner from '../Spinner/Spinner';
import styles from './RSVP.module.css';

const RSVP = () => {
  const [guestInfo, setGuestInfo] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const [initialLoading, setInitialLoading] = useState(true);

  const hasAnyResponse = (guestInfo) => {
    // Check main guest
    if (guestInfo.mainGuest.attending !== null) return true;
    
    // Check companion if exists
    if (guestInfo.hasCompanion && guestInfo.companion.attending !== null) return true;
    
    // Check children if any
    if (guestInfo.hasChildren) {
      return guestInfo.children.some(child => child.attending !== null);
    }
    
    return false;
  };

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

  const handleFormSuccess = (updatedData) => {
    // Update the state with the data returned from the server
    setGuestInfo(updatedData);
    
    // Check if everyone in the party has declined
    const allDeclined = updatedData.mainGuest.attending === false && 
      (!updatedData.hasCompanion || updatedData.companion.attending === false) &&
      (!updatedData.hasChildren || updatedData.children.every(child => child.attending === false));
    
    setShowAttendanceForm(false);
    setStatus({
      type: 'success',
      message: allDeclined 
        ? 'Gracias por avisarnos. ¡Te vamos a extrañar!'
        : '¡Gracias por confirmar tu asistencia!'
    });
  };

  const handleDeclineSuccess = (updatedData) => {
    setGuestInfo(updatedData);
    setShowAttendanceForm(false);
    setStatus({
      type: 'success',
      message: 'Gracias por avisarnos. ¡Te vamos a extrañar!'
    });
  };

  const handleModifyResponse = () => {
    // Don't change hasDeclined state, just show the form
    setShowAttendanceForm(true);
    setStatus({ type: null, message: null });
  };

  const handleGoBack = () => {
    setShowAttendanceForm(false);
    setStatus({ type: null, message: null });
  };

  const renderContent = () => {
    // If they want to show the form (either first time or modifying)
    if (showAttendanceForm) {
      return (
        <AttendanceForm 
          guestInfo={guestInfo}
          onSubmitSuccess={handleFormSuccess}
          onGoBack={handleGoBack}
          isModifying={hasAnyResponse(guestInfo)}
        />
      );
    }

    // If no one in the party has responded yet
    if (!hasAnyResponse(guestInfo)) {
      return (
        <InitialChoice
          guestInfo={guestInfo}
          onAttend={() => setShowAttendanceForm(true)}
          onDecline={handleDeclineSuccess}
        />
      );
    }

    // If they have already made a choice, show current status
    return (
      <>
        <AttendanceStatus 
          guestInfo={guestInfo}
          onModify={handleModifyResponse}
        />
        {status.message && (
          <p className={`${styles.message} ${styles[status.type]}`}>
            {status.message}
          </p>
        )}
      </>
    );
  };

  if (initialLoading) {
    return <Spinner />;
  }

  // If we have no guest info, show the error message
  if (!guestInfo) {
    return (
      <div className={styles.container}>
        <p className={`${styles.message} ${styles[status.type]}`}>
          {status.message}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h2>CONFIRMACIÓN&nbsp;</h2>
        <h2>DE ASISTENCIA</h2>
      </header>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default RSVP;