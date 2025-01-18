import { useState } from 'react';
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
          <a href="#" className={styles.navbarLogo}>
            Abril & Juan
          </a>
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
          <a href="#" className={styles.navItem} onClick={toggleMenu}>
            Home
          </a>
          <a href="#info" className={styles.navItem} onClick={toggleMenu}>
            Info
          </a>
          <a href="#rsvp" className={styles.navItem} onClick={toggleMenu}>
            RSVP
          </a>
          <a href="#faq" className={styles.navItem} onClick={toggleMenu}>
            FAQ
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;