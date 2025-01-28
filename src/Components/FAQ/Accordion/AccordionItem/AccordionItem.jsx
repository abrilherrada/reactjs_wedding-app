import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import styles from "./AccordionItem.module.css";

function AccordionItem ({question, answer, isOpen, onClick}) {
    const contentHeight = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const contentRef = contentHeight.current;
        
        const updateHeight = () => {
            if (contentRef && isOpen) {
                setHeight(contentRef.scrollHeight);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            if (isOpen) {
                updateHeight();
            }
        });

        if (contentRef) {
            resizeObserver.observe(contentRef);
        }

        updateHeight();

        return () => {
            if (resizeObserver && contentRef) {
                resizeObserver.unobserve(contentRef);
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setHeight(0);
        } else if (contentHeight.current) {
            setHeight(contentHeight.current.scrollHeight);
        }
    }, [isOpen]);

    return (
        <div className={styles.wrapper}>
            <button 
                className={`${styles.questionContainer} ${isOpen ? styles.active : ""}`} 
                onClick={onClick}
                aria-expanded={isOpen}
                type="button"
            >
                <p className={styles.questionContent}>{question}</p>
                <span 
                    className={`${styles.arrow} ${isOpen ? styles.active : ""}`}
                    aria-hidden="true"
                >
                    ⌄
                </span>
            </button>
            <div    
                ref={contentHeight} 
                className={styles.answerContainer} 
                style={{ 
                    maxHeight: `${height}px`
                }}
                role="region"
                aria-hidden={!isOpen}
            >
                <div className={styles.answerContent}>
                    {answer}
                </div>
            </div>
        </div>
    );
}

AccordionItem.propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default AccordionItem;