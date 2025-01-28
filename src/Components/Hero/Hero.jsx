import { useState } from 'react';
import Button from '../Button/Button';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import styles from './Hero.module.css';

const Hero = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={styles.heroContainer}>
      <ErrorBoundary>
        <div className={styles.content}>
          <h1 className={styles.headline}>¡EXTRA, EXTRA!</h1>
          <div className={styles.imageContainer}>
            <img 
              src="/hero.jpg" 
              alt="Happy couple" 
              className={styles.heroImage}
            />
            <p className={styles.imageCaption}>Rumbo al espacio (¡y al altar!): Abril y Juan a bordo de su nave en una misión intergaláctica de risas y amor.</p>
          </div>

          <article className={styles.articleContent}>
            <h3 className={styles.articleHeadline}>Después de 7 años de aventuras, Abril y Juan anuncian la gran noticia: se casan</h3>
            <div className={styles.articleText}>
              <p>
                La ceremonia y la celebración tendrán lugar el <b>30 de agosto de 2025</b>, en Agua de Oro, Córdoba, y prometen ser tan únicas y llenas de alegría como la pareja misma.
              </p>

              <div className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}>
                <p>
                  Esta historia de amor comenzó en 2018. Después de varios años de cruzarse en conferencias, una conversación por Instagram marcó el inicio de algo especial. Desde Nueva York, Juan preguntó en una encuesta si debía animarse a actuar en un show de standup, y Abril no dudó en alentarlo. Esa misma charla llevó a una invitación de Abril a tomar algo cuando Juan regresara a Argentina con el pretexto de contarle cómo le había ido en el examen de Lingüística para el que estaba estudiando (aunque, irónicamente, Abril no se presentó al examen y Juan no toma alcohol).
                </p>
                <p>
                  Desde entonces, han compartido viajes, proyectos y la adopción de tres adorables perros, demostrando que el amor es una aventura llena de sorpresas y momentos inolvidables.
                </p>
                <p>
                  <i>&quot;¡No se lo pierdan!&quot;</i>, insisten los futuros esposos, listos para compartir este día inolvidable con quienes más quieren.
                </p>
              </div>

              <Button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={styles.readMoreButton}
              >
                <span>
                  {isExpanded ? 'Leer menos' : 'Leer más'}
                </span>
                <svg 
                  className={`${styles.arrow} ${isExpanded ? styles.arrowUp : ''}`}
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M1 1L6 6L11 1" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </article>
        </div>
      </ErrorBoundary>
    </section>
  );
};

export default Hero;