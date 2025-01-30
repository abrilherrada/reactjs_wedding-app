import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({ title, image, price, description }) => {
  return (
    <article className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}><span>{price}</span></p>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default Card;