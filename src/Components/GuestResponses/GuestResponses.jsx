import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/useAuth';
import { getWeddingInvitations } from '../../services/wedding_services';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import styles from './GuestResponses.module.css';

const GuestResponses= () => {
  const navigate = useNavigate();
  const { id: weddingId } = useParams();
  const { token } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [attendance, setAttendance] = useState({attending: 0, notAttending: 0, pending: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getWeddingInvitations(weddingId, token);
        setInvitations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [weddingId, token]);

  useEffect(() => {
    if (invitations.length > 0) {
      let totalAttending = 0;
      let totalNotAttending = 0;
      let totalPending = 0;
      
      invitations.forEach(invitation => {
        if (invitation.mainGuest && invitation.mainGuest.attending === true) {
          totalAttending++;
        } else if (invitation.mainGuest && invitation.mainGuest.attending === false) {
          totalNotAttending++;
        } else if (invitation.mainGuest && invitation.mainGuest.attending === null) {
          totalPending++;
        }

        if (invitation.companion && invitation.companion.attending === true) {
          totalAttending++;
        } else if (invitation.companion && invitation.companion.attending === false) {
          totalNotAttending++;
        } else if (invitation.companion && invitation.companion.attending === null) {
          totalPending++;
        }

        if (invitation.children && invitation.children.length > 0) {
          invitation.children.forEach(child => {
            if (child.attending === true) {
              totalAttending++;
            } else if (child.attending === false) {
              totalNotAttending++;
            } else if (child.attending === null) {
              totalPending++;
            }
          });
        }
      });

      setAttendance({ attending: totalAttending, notAttending: totalNotAttending, pending: totalPending });
    }
  }, [invitations]);

  const handleGetAttendance = (invitation) => {
    let attendingCount = 0;

    if (invitation.mainGuest && invitation.mainGuest.attending === true) {
      attendingCount++;
    }

    if (invitation.companion && invitation.companion.attending === true) {
      attendingCount++;
    }

    if (invitation.children && invitation.children.length > 0) {
      invitation.children.forEach(child => {
        if (child.attending === true) {
          attendingCount++;
        }
      });
    }

    return attendingCount;
  };

  const getAttendanceClass = (guest) => {
    if (!guest) return '';

    if (guest.attending === true) {
      return styles.attending;
    } else if (guest.attending === false) {
      return styles.notAttending;
    }
  };

const handleGoToInvitation = (id) => {
  navigate(`/?inv=${id}`);
}

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Respuestas</h2>
      <div className={styles.countContainer}>
        <div className={styles.count}>
          <h4>Boda</h4>
          <p>
            <span className={styles.subtitle}>Asistirán:&nbsp;</span>
            <span className={styles.text}>{attendance.attending}</span>
          </p>
          <p>
            <span className={styles.subtitle}>No asistirán:&nbsp;</span>
            <span className={styles.text}>{attendance.notAttending}</span>
          </p>
          <p>
            <span className={styles.subtitle}>Pendientes:&nbsp;</span>
            <span className={styles.text}>{attendance.pending}</span>
          </p>
        </div>
        <div className={styles.count}>
          <h4>Alojamiento</h4>
          <p>
            <span className={styles.subtitle}>Reservas:</span>
            <span className={styles.text}></span>
          </p>
        </div>
        <div className={styles.count}>
          <h4>Transporte</h4>
          <p>
            <span className={styles.subtitle}>Reservas:</span>
            <span className={styles.text}></span>
          </p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invitación #</th>
              <th>Invitados</th>
              <th>Boda</th>
              <th>Comida especial</th>
              <th>Transporte</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map(invitation => (
              <tr 
                key={invitation._id}
              >
                <td>
                  {invitation._id}
                </td>
                <td className={styles.lists}>
                  <ul className={styles.guestList}>
                    {invitation.mainGuest && (
                      <li className={getAttendanceClass(invitation.mainGuest)}>
                        {invitation.mainGuest.name}
                      </li>
                    )}
                    {invitation.companion && (
                      <li className={getAttendanceClass(invitation.companion)}>
                        {invitation.companion.name}
                      </li>
                    )}
                  </ul>
                  {invitation.children && invitation.children.length > 0 && (
                    <ul className={styles.guestList}>
                      {invitation.children.map((child, index) => (
                        <li 
                          key={index} 
                          className={getAttendanceClass(child)}
                        >
                          {child.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td>
                  <p className={styles.response}>
                    {handleGetAttendance(invitation)}
                  </p>
                </td>
                <td>
                  <p>{invitation.dietaryRestrictionsInGroup}</p>

                </td>
                <td>
                </td>
                <td>
                  <Button
                    className={styles.btn}
                    onClick={() => handleGoToInvitation(invitation._id)}
                  >
                    Ver invitación
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestResponses;