import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarBrand}>
          <Link to="/" className={styles.navbarLogo}>
            Abril & Juan
          </Link>
          <button 
            className={`${styles.hamburger} ${isOpen ? styles.active : ''}`} 
            onClick={toggleMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        <div className={`${styles.navbarMenu} ${isOpen ? styles.active : ''}`}>
          <Link to="/" className={styles.navItem} onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/rsvp" className={styles.navItem} onClick={toggleMenu}>
            RSVP
          </Link>
          <Link to="/info" className={styles.navItem} onClick={toggleMenu}>
            Info
          </Link>
          <Link to="/faq" className={styles.navItem} onClick={toggleMenu}>
            FAQ
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;