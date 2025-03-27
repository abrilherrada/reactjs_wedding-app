import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/User/useUser';
import Spinner from '../Spinner/Spinner';
import MultipleWeddings from './MultipleWeddings/MultipleWeddings';
import Button from '../Button/Button';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { userData, loading } = useUser();

  if (loading) {
    return <Spinner/>;
  }

  if (!userData || !userData.weddings || userData.weddings.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>No hay bodas</h1>
          <p className={styles.errorText}>No encontramos ninguna boda asociada a tu cuenta. Tocá el botón para intentar de nuevo. Si el error persiste, comunicate con soporte.</p>
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

  if (userData.weddings.length === 1) {
    return <Navigate to={`/admin/wedding/${userData.weddings[0]._id}`} replace />;
  }

  if (userData.weddings.length > 1) {
    return <MultipleWeddings />;
  }

  return null;
}

export default Dashboard;