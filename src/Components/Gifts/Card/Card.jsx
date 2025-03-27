import PropTypes from 'prop-types';
import Button from '../../Button/Button';
import styles from './Card.module.css';

const Card = ({ title, image, price, description, onClick }) => {
  return (
    <article className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}><span>{price}</span></p>
        <p className={styles.description}>{description}</p>
        <Button
          onClick={onClick}
          className={styles.button}
        >
          Regalar
        </Button>
      </div>
    </article>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Card;