import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/User/useUser';
import { formatDate } from '../../../utils/formatDate';
import Button from '../../Button/Button';
import styles from '../Dashboard.module.css';

const MultipleWeddings = () => {
  const navigate = useNavigate();
  const { userData, loading } = useUser();

  const handleGoToWedding = (id) => {
    navigate(`/admin/wedding/${id}`);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tus bodas</h1>
      <div className={styles.cardContainer}>
          {userData && userData.weddings.map(wedding => (
            <div key={wedding._id} className={styles.card}>
              <h2 className={styles.weddingTitle}>{wedding.weddingName}</h2>
              <p>
                <span className={styles.subtitle}>Lugar:&nbsp;</span>
                <span className={styles.text}>{wedding.venue}</span>
              </p>
              <p>
                <span className={styles.subtitle}>Última actualización:&nbsp;</span>
                <span className={styles.text}>{formatDate(wedding.updatedAt)}</span>
              </p>
              <Button
                className={styles.seeButton}
                onClick={() => handleGoToWedding(wedding._id)}
                disabled={loading}
              >
                Ver invitados
              </Button>
            </div>
          ))}
        </div>
    </div>
  )
}

export default MultipleWeddings;