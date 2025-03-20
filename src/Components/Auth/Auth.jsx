import { useState } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.toggleContainer}>
        <span className={styles.option}>Iniciar sesión</span>
        <label className={styles.switch}>
          <input
            className={styles.toggle}
            type="checkbox"
            checked={!isLogin}
            onChange={() => setIsLogin(prev => !prev)}
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.option}>Registrarse</span>
      </div>
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
};

export default Auth;