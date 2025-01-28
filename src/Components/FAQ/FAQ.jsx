import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Accordion from './Accordion/Accordion';
import styles from './FAQ.module.css';

const FAQ = () => {
  return (
    <section className={styles.container}>
      <header className={styles.title}>
        <h2>PREGUNTAS&nbsp;</h2>
        <h2>FRECUENTES</h2>
      </header>

      <ErrorBoundary>
        <div className={styles.content}>
          <Accordion/>
        </div>
      </ErrorBoundary>
    </section>
  );
};

export default FAQ;