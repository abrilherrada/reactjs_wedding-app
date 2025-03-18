import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/Auth/useAuth';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      return;
    }
    
    const success = await login(credentials);
    if (success) {
      navigate('/admin/guests');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar sesión</h2>
        {authError && <div className="error-message">{authError}</div>}
        <div className="form-group">
          <label htmlFor="username">Correo electrónico</label>
          <input
            id="username"
            type="email"
            placeholder="Ingresá tu correo"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Ingresá tu contraseña"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            disabled={loading}
            required
          />
        </div>
        <button 
          type="submit" 
          className="login-button"
          disabled={loading || !credentials.username || !credentials.password}
        >
          {loading ? 'Enviando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;