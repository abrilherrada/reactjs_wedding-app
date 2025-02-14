import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick = () => {}, 
  className = '',
  as: Component = 'button',
  ...props
}) => {
  return (
    <Component 
      className={`${styles.button} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default Button;