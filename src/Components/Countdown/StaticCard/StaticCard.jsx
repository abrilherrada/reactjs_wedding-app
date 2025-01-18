import PropTypes from 'prop-types';
import styles from '../Countdown.module.css';

const StaticCard = ({ position, digit }) => {
    return (
        <div className={styles[position]}>
            <span>{digit}</span>
        </div>
    );
};

StaticCard.propTypes = {
    position: PropTypes.string.isRequired,
    digit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default StaticCard;