import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/Auth/useAuth';
import Button from '../../Button/Button';
import styles from '../Auth.module.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      return;
    }
    
    const success = await login(credentials);
    if (success) {
      navigate('/admin/guests');
    }
  };

  return (
    <div className={styles.card}>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <h2 className={styles.title}>Iniciar sesión</h2>
        <div className={styles.fieldGroup}>
          <label
            htmlFor="email"
            className={styles.label}
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            disabled={loading}
            required
            className={styles.field}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label
            htmlFor="password"
            className={styles.label}
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            disabled={loading}
            required
            className={styles.field}
          />
        </div>
        <Button 
          type="submit" 
          className={styles.authButton}
          disabled={loading || !credentials.email || !credentials.password}
        >
          {loading ? 'Enviando...' : 'Iniciar sesión'}
        </Button>
        {authError && <div className={styles.errorMessage}>{authError}</div>}
      </form>
    </div>
  );
};

export default Login;