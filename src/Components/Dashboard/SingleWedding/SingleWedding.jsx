import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/User/useUser';
import { formatDate } from '../../../utils/formatDate';
import Button from '../../Button/Button';
import styles from './SingleWedding.module.css';
import Spinner from '../../Spinner/Spinner';

const SingleWedding = () => {
  const navigate = useNavigate();
  const { userData, loading } = useUser();

  const handleGoToGuestList = (id) => {
    navigate(`/admin/wedding/${id}/guests`);
  }

  const handleGoToGuestResponses = (id) => {
    navigate(`/admin/wedding/${id}/responses`);
  }

  if (loading) {
    return <Spinner />;
  }

  if (!userData || !userData.weddings || userData.weddings.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>No hay información</h1>
          <p className={styles.errorText}>No encontramos información de la boda. Tocá el botón para intentar de nuevo. Si el error persiste, comunicate con soporte.</p>
        </div>
        <Button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  const wedding = userData.weddings[0];

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Boda de {wedding.weddingName}</h1>
        <div className={styles.cardContainer}>
          <div className={styles.mainCard}>
            <h2 className={styles.cardTitle}>Información de la boda</h2>
            <p>
              <span className={styles.subtitle}>Lugar:&nbsp;</span>
              <span className={styles.text}>{wedding.venue}</span>
            </p>
            <p>
              <span className={styles.subtitle}>Última actualización:&nbsp;</span>
              <span className={styles.text}>{formatDate(wedding.updatedAt)}</span>
            </p>
            <Button
              className={styles.btn}
              disabled={loading}
            >
              Editar
            </Button>
          </div>
          <div className={styles.secondaryCardContainer}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Invitaciones</h2>
              <p>
                <span className={styles.subtitle}>Creadas:&nbsp;</span>
                <span className={styles.text}></span>
              </p>
              <p>
                <span className={styles.subtitle}>Enviadas:&nbsp;</span>
                <span className={styles.text}></span>
              </p>
              <p>
                <span className={styles.subtitle}>Total (personas):&nbsp;</span>
                <span className={styles.text}></span>
              </p>
              <Button
                className={styles.btn}
                onClick={() => handleGoToGuestList(wedding._id)}
                disabled={loading}
              >
                Gestionar invitados
              </Button>
            </div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Confirmaciones</h2>
              <p>
                <span className={styles.subtitle}>Boda:&nbsp;</span>
                <span className={styles.text}></span>
              </p>
              <p>
                <span className={styles.subtitle}>Alojamiento:&nbsp;</span>
                <span className={styles.text}></span>
              </p>
              <p>
                <span className={styles.subtitle}>Transporte:&nbsp;</span>
                <span className={styles.text}></span>
              </p>
              <Button
                className={styles.btn}
                onClick={() => handleGoToGuestResponses(wedding._id)}
                disabled={loading}
              >
                Ver respuestas
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default SingleWedding;