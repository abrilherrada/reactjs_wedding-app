import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/Auth/useAuth';
import Button from '../../Button/Button';
import styles from '../Auth.module.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    hasWeddingId: false,
    weddingId: '',
    weddingName: ''
  });
  const { signup, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.hasWeddingId && !formData.weddingId) {
      return;
    }
    
    const success = await signup({
      email: formData.email,
      password: formData.password,
      ...(formData.hasWeddingId 
        ? { weddingId: formData.weddingId }
        : formData.weddingName ? { weddingName: formData.weddingName } : {}
      )
    });

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
        <h2 className={styles.title}>Crear una cuenta</h2>
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
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            disabled={loading}
            required
            className={styles.field}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label
            htmlFor="confirmPassword"
            className={styles.label}
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            disabled={loading}
            required
            className={styles.field}
          />
        </div>

        <div className={styles.wrapper}>
          <div className={styles.tab}>
            <input
              type="radio"
              name="hasWeddingId"
              checked={formData.hasWeddingId}
              onChange={() => setFormData(prev => ({ 
                ...prev, 
                hasWeddingId: true,
                weddingName: '' // Clear wedding name when switching
              }))}
              disabled={loading}
              className={styles.input}
            />
            <div className={styles.btn}>
              <span className={styles.span}>
                Quiero unirme <br/> a una boda
              </span>
            </div>
          </div>
          <div className={styles.tab}>
            <input
              type="radio"
              name="hasWeddingId"
              checked={!formData.hasWeddingId}
              onChange={() => setFormData(prev => ({ 
                ...prev, 
                hasWeddingId: false,
                weddingId: '' // Clear wedding ID when switching
              }))}
              disabled={loading}
              className={styles.input}
            />
            <div className={styles.btn}>
              <span className={styles.span}>
                Quiero crear <br/> una boda
              </span>
            </div>
          </div>
        </div>
        
        {formData.hasWeddingId ? (
          <div className={styles.fieldGroup}>
            <label
              htmlFor="weddingId"
              className={styles.label}
              >
                Código de la boda
              </label>
            <input
              id="weddingId"
              type="text"
              value={formData.weddingId}
              onChange={(e) => setFormData(prev => ({ ...prev, weddingId: e.target.value }))}
              disabled={loading}
              required={formData.hasWeddingId}
              className={styles.field}
            />
          </div>
        ) : (
          <div className={styles.fieldGroup}>
            <label
              htmlFor="weddingName"
              className={styles.label}
            >
              Nombre de la boda (opcional)
            </label>
            <input
              id="weddingName"
              type="text"
              value={formData.weddingName}
              onChange={(e) => setFormData(prev => ({ ...prev, weddingName: e.target.value }))}
              disabled={loading}
              className={styles.field}
            />
          </div>
        )}

        <Button 
          type="submit" 
          className={styles.authButton}
          disabled={
            loading || 
            !formData.email || 
            !formData.password || 
            !formData.confirmPassword ||
            (formData.hasWeddingId && !formData.weddingId)
          }
        >
          {loading ? 'Enviando...' : 'Crear cuenta'}
        </Button>
        {authError && <div className={styles.errorMessage}>{authError}</div>}
      </form>
    </div>
  );
};

export default Signup;