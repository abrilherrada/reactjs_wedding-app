import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';
import FlipUnitContainer from './FlipUnitContainer/FlipUnitContainer';

const Countdown = () => {
    const weddingDate = new Date(2025, 7, 30, 12, 30);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = weddingDate - now;

            if (difference > 0) {
                const newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };

                setTimeLeft(newTimeLeft);
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, []);

    return (
      <div className={styles.countdownContainer}>
        <div className={styles.countdown}>
            <FlipUnitContainer
                unit="days"
                digit={timeLeft.days}
                label="Días"
            />
            <FlipUnitContainer
                unit="hours"
                digit={timeLeft.hours}
                label="Horas"
            />
            <FlipUnitContainer
                unit="minutes"
                digit={timeLeft.minutes}
                label="Minutos"
            />
            <FlipUnitContainer
                unit="seconds"
                digit={timeLeft.seconds}
                label="Segundos"
            />
        </div>
      </div>
    );
};

export default Countdown;