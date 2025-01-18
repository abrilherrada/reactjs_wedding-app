import PropTypes from 'prop-types';
import styles from '../Countdown.module.css';

const AnimatedCard = ({ animation, digit }) => {
    return (
        <div className={`${styles.flipCard} ${animation ? styles[animation] : ''}`}>
            <span>{digit}</span>
        </div>
    );
};

AnimatedCard.propTypes = {
    animation: PropTypes.string,
    digit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default AnimatedCard;