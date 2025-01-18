import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick = () => {}, 
  className = '' 
}) => {
  return (
    <button 
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;