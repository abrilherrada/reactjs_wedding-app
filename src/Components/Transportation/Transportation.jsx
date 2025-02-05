import { useState } from 'react';
import Button from '../Button/Button';
import styles from './Transportation.module.css';

const Transportation = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h2>OPCIONES&nbsp;</h2>
        <h2>DE TRASLADO</h2>
      </header>
      <div className={styles.content}>
        <p className={styles.paragraph}>Cuál es la mejor opción de traslado hasta el salón va a depender de dónde te alojes.</p>
        <p className={styles.paragraph}>Tené en cuenta que el salón se encuentra en un área retirada a la cual solo se puede acceder en vehículos particulares.</p>
        <article className={styles.card}>
          <h3>Desde Agua de Oro</h3>
          <p className={styles.paragraph}>Si te quedás en Agua de Oro o en alguna localidad aledaña (como Salsipuedes, La Granja, Villa Cerro Azul, El Manzano), el taxi va a ser la opción más práctica y rápida.</p>
        </article>
        <article className={styles.card}>
          <h3>Desde Córdoba</h3>
          <p className={styles.paragraph}>Si vas a ir desde la Ciudad de Córdoba, tenés varias opciones de traslado.</p>
          <div className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}>
            <ul className={styles.list}>
              <li>
                <span className={styles.listItemTitle}>Colectivo + taxi:&nbsp;</span>
                <span className={styles.listItemText}>Podés tomar un colectivo interurbano en la Nueva Terminal de Ómnibus de Córdoba (zona centro). El servicio 472 de la línea Córdoba - Agua de Oro x Río Ceballos de la empresa Fonobus sale a las 10&nbsp;a.&nbsp;m. y te podés bajar en la parada Ruta E53 (Tres Cóndores) en El Manzano a las 11:45 &nbsp;a.&nbsp;m. Desde ahí, podés tomarte un taxi hasta el salón, que está a 2,5 kilómetros de la parada.</span>
              </li>
              <li>
                <span className={styles.listItemTitle}>Taxi/Remis/Uber:&nbsp;</span>
                <span className={styles.listItemText}>Aunque es de las opciones más costosas, también es de las más rápidas y prácticas. Un taxi o remis puede llegar a salir entre $40.000 y $60.000 aproximadamente, y un Uber puede salir entre $30.000 y $40.000. Es posible que sea más difícil conseguir un Uber que te lleve hasta allá.</span>
              </li>
              <li>
                <span className={styles.listItemTitle}>Trafic:&nbsp;</span>
                <span className={styles.listItemText}>Como queremos facilitarles las cosas a nuestros invitados y que empiecen el día lo más relajados que se pueda, se nos occurrió ofrecerles esta opción. El costo sería de $10.000 por persona aproximadamente. Nosotros nos encargaríamos de la logística (buscar una empresa, reservar la cantidad de vehículos que hagan falta y coordinar dónde y cuándo los pasarían a buscar). Lo único que necesitamos es que los que elijan esta opción, toquen el botón que se encuentra abajo para reservar los lugares.</span>
              </li>
            </ul>
            {/*BOTON PARA RESERVAR TRASLADO*/}
            <Button
                className={styles.bookButton}
              >
                Reservar trafic
            </Button>
          </div>
          <Button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={styles.readMoreButton}
              >
                <span>
                  {isExpanded ? 'Ver menos' : 'Ver más'}
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
        </article>
      </div>
  </div>
  )
}

export default Transportation;