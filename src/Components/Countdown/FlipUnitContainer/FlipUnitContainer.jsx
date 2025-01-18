import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../Countdown.module.css';
import AnimatedCard from '../AnimatedCar/AnimatedCard.jsx';
import StaticCard from '../StaticCard/StaticCard.jsx';

const FlipUnitContainer = ({ digit, label }) => {
    const [prevDigit, setPrevDigit] = useState(digit);
    const [isAnimating, setIsAnimating] = useState(false);
    
    useEffect(() => {
        if (digit !== prevDigit) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setPrevDigit(digit);
                setIsAnimating(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [digit, prevDigit]);

    const currentDigit = digit < 10 ? `0${digit}` : digit;
    const previousDigit = prevDigit < 10 ? `0${prevDigit}` : prevDigit;

    return (
      <div className="countUnitContainer">
        <div className={styles.flipUnitContainer}>
            <StaticCard 
                position={'upperCard'} 
                digit={currentDigit}
            />
            <StaticCard 
                position={'lowerCard'} 
                digit={isAnimating ? previousDigit : currentDigit}
            />
            {(isAnimating || digit !== prevDigit) && (
                <>
                    <AnimatedCard digit={previousDigit} animation="fold" />
                    <AnimatedCard digit={currentDigit} animation="unfold" />
                </>
            )}
        </div>
        <span className={styles.label}>{label}</span>
      </div>
    );
};

FlipUnitContainer.propTypes = {
    digit: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default FlipUnitContainer;