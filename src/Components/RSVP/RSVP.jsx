import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRSVP } from '../../context/RSVP/useRSVP';
import AttendanceForm from './AttendanceForm/AttendanceForm';
import InitialChoice from './InitialChoice/InitialChoice';
import AttendanceStatus from './AttendanceStatus/AttendanceStatus';
import Spinner from '../Spinner/Spinner';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import WarningIcon from '../../assets/icons/WarningIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import styles from './RSVP.module.css';

const hasAttendanceResponse = (guest) => guest.attending !== null;

const ERROR_MESSAGES = {
  NO_INVITATION_ID: 'Para confirmar tu asistencia, usá el enlace que te enviamos por WhatsApp.',
  INVALID_INVITATION: 'No pudimos encontrar tu invitación. Revisá que el enlace que estás usando sea el mismo que te enviamos por WhatsApp.',
  UNKNOWN_ERROR: 'No pudimos cargar tu información. Intentá de nuevo.'
};

const getInvitationIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('invitationId');
};

const getErrorMessage = (status) => {
  if (!status?.type) return null;
  if (status.status === 404) return ERROR_MESSAGES.INVALID_INVITATION;
  if (!status.status) return ERROR_MESSAGES.NO_INVITATION_ID;
  if (status.status >= 500) return ERROR_MESSAGES.UNKNOWN_ERROR;
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

const RSVP = () => {
  const { guestInfo, setGuestInfo, status, loading: initialLoading, fetchRSVPInfo, setStatus, setLoading } = useRSVP();
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  const hasResponse = useMemo(() => {
    if (!guestInfo) return false;
    
    const guests = [
      guestInfo.mainGuest,
      ...(guestInfo.hasCompanion ? [guestInfo.companion] : []),
      ...(guestInfo.hasChildren ? guestInfo.children : [])
    ];
    
    return guests.some(hasAttendanceResponse);
  }, [guestInfo]);

  useEffect(() => {
    const invitationId = getInvitationIdFromUrl();
    
    if (!invitationId) {
      setStatus({
        type: 'error',
        status: null
      });
      setLoading(false);
      return;
    }

    fetchRSVPInfo(invitationId);
  }, [fetchRSVPInfo, setStatus, setLoading]);

  const handleFormSuccess = useCallback((updatedData) => {
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
        : '¡Gracias por confirmar tu asistencia! Nos vemos ahí 🤍'
    });
  }, [setGuestInfo, setStatus]);

  const handleDeclineSuccess = useCallback((updatedData) => {
    setGuestInfo(updatedData);
    setShowAttendanceForm(false);
    setStatus({
      type: 'success',
      message: 'Gracias por avisarnos. ¡Te vamos a extrañar!'
    });
  }, [setGuestInfo, setStatus]);

  const handleModifyResponse = useCallback(() => {
    setShowAttendanceForm(true);
    setStatus({ type: null, message: null });
  }, [setStatus]);

  const handleGoBack = useCallback(() => {
    setShowAttendanceForm(false);
    setStatus({ type: null, message: null });
  }, [setStatus]);

  const renderContent = useCallback(() => {
    if (showAttendanceForm) {
      return (
        <AttendanceForm 
          guestInfo={guestInfo}
          onSubmitSuccess={handleFormSuccess}
          onGoBack={handleGoBack}
          isModifying={hasResponse}
        />
      );
    }

    if (!hasResponse) {
      return (
        <InitialChoice
          guestInfo={guestInfo}
          onAttend={() => setShowAttendanceForm(true)}
          onDecline={handleDeclineSuccess}
        />
      );
    }

    return (
      <>
        {status.message && (
          <p className={`${styles.message} ${styles[status.type]}`}>
            <span className={styles.icon}>
            {status.type === 'success' ? <CheckIcon /> : null }
            </span>
            <span>{status.message}</span>
          </p>
        )}
        <AttendanceStatus 
          guestInfo={guestInfo}
          onModify={handleModifyResponse}
        />
      </>
    );
  }, [
    showAttendanceForm,
    guestInfo,
    hasResponse,
    status.message,
    status.type,
    handleFormSuccess,
    handleGoBack,
    handleDeclineSuccess,
    handleModifyResponse
  ]);

  if (initialLoading) {
    return <Spinner />;
  }

  // If we have no guest info, show the error message
  if (!guestInfo) {
    return (
      <div className={styles.container}>
        <header className={styles.title}>
          <h2>CONFIRMACIÓN&nbsp;</h2>
          <h2>DE ASISTENCIA</h2>
        </header>
        <div className={styles.errorContainer}>
          <p className={`${styles.message} ${styles[status.type]}`}>
            <span className={styles.icon}>
              {status.type === 'error' ? <WarningIcon /> : null}
            </span>
            <span>{getErrorMessage(status)}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h2>CONFIRMACIÓN&nbsp;</h2>
        <h2>DE ASISTENCIA</h2>
      </header>

      <ErrorBoundary>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default RSVP;