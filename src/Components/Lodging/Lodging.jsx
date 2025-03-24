import { useState, useCallback } from 'react';
import Button from '../Button/Button';
import Reservation from '../Reservation/Reservation';
import styles from './Lodging.module.css';


const Lodging = () => {
  const [expandedSections, setExpandedSections] = useState({
    venue: false,
    nearby: false,
    city: false
  });
  const [isTextHidden, setIsTextHidden] = useState(false);

  const handleTextVisibility = useCallback(({isTextHidden}) => {
    setIsTextHidden(isTextHidden);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h2>OPCIONES&nbsp;</h2>
        <h2>DE ALOJAMIENTO</h2>
      </header>
      <div className={styles.content}>
        <p className={styles.paragraph}>El evento se va a llevar a cabo en la localidad de Agua de Oro, que queda a 45 km de la Ciudad de Córdoba.</p>
        <p className={styles.paragraph}>Te proponemos tres alternativas de lugares para quedarte:</p>
        <article className={styles.card}>
          {!isTextHidden && (
            <>
              <h3>En el salón</h3>
              <p className={styles.paragraph}>El salón cuenta con alojamiento propio, de estilo rústico (porque es un edificio antigüo), que podemos usar la noche del evento (30 de agosto de 2025).</p>
              <div className={`${styles.expandableContent} ${expandedSections.venue ? styles.expanded : ''}`}>
                <p className={styles.paragraph}>El precio aproximado es de $40.000-$45.000 por persona por noche. Este precio puede variar según la cantidad total de personas que decidan quedarse y la fecha en que se pague.</p>
                <p className={styles.paragraph}>Los lugares son limitados, así que, si elegís esta opción, es necesario que nos avises cuanto antes. Para hacerlo, tocá el botón &quot;Reservar alojamiento&quot;, que está abajo.</p>
                <p className={styles.paragraph}>Por ahora, solo hay disponibilidad para la noche del evento. Más cerca de la fecha vamos a saber si se puede ir desde el día anterior (29 de agosto).</p>
                <p className={styles.paragraph}>Nosotros nos vamos a quedar ahí. Nuestra idea es desayunar la mañana siguiente con los que se queden para aprovechar su visita al máximo.</p>
              </div>
              <Button 
                onClick={() => setExpandedSections(prev => ({ ...prev, venue: !prev.venue }))}
                className={styles.readMoreButton}
              >
                <span>
                  {expandedSections.venue ? 'Ver menos' : 'Ver más'}
                </span>
                <svg 
                  className={`${styles.arrow} ${expandedSections.venue ? styles.arrowUp : ''}`}
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
            </>
          )}
          {isTextHidden && (
            <h3>Reserva en el salón</h3>
          )}
          <Reservation
            reservationType='lodging'
            onReservationChange={handleTextVisibility}
          />
        </article>
        <article className={styles.card}>
          <h3>En localidades cercanas al salón</h3>
          <p className={styles.paragraph}>Si bien son limitadas, hay algunas opciones de alojamiento en Agua de Oro, Salsipuedes, La Granja y Villa Cerro Azul, entre otras. Si elegís quedarte por esa zona, tenés el beneficio de estar cerca del salón, por lo que podrías llegar en taxi sin problemas. Por otro lado, si vas a venir varios días, no hay tanto para hacer como en la Ciudad de Córdoba.</p>
          <div className={`${styles.expandableContent} ${expandedSections.nearby ? styles.expanded : ''}`}>
            <p className={styles.paragraph}>Estas son algunas de las opciones de alojamiento que encontramos:</p>
            <h4>Booking</h4>
            <ul className={styles.list}>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/la-pasionaria-agua-de-oro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Casa para 3, 5 y 6 personas
                </a>
              </li>
            </ul>
            <h4>Airbnb</h4>
            <ul className={styles.list}>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/1284744176743189868"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Casa para hasta 4 personas
              </a>
              </li>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/1287148350751846600"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Casa para hasta 7 personas
              </a>
              </li>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/21239606"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Casa para hasta 8 personas
              </a>
              </li>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/1321255171208860947"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Casa para hasta 2 personas
              </a>
              </li>
            </ul>
          </div>
          <Button 
            onClick={() => setExpandedSections(prev => ({ ...prev, nearby: !prev.nearby }))}
            className={styles.readMoreButton}
          >
            <span>
              {expandedSections.nearby ? 'Ver menos' : 'Ver opciones'}
            </span>
            <svg 
              className={`${styles.arrow} ${expandedSections.nearby ? styles.arrowUp : ''}`}
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
        <article className={styles.card}>
          <h3>En la Ciudad de Córdoba</h3>
          <p className={styles.paragraph}>Si elegís quedarte en Córdoba, vas a tener muchas más opciones de alojamiento y precios. Además, si venís varios días, podés aprovechar para conocer esta hermosa ciudad que tiene muchísimo para ofrecer. Eso sí, tené en cuenta que hay una hora de viaje aproximadamente para llegar al salón (desde el centro).</p>
          <div className={`${styles.expandableContent} ${expandedSections.city ? styles.expanded : ''}`}>
            <p className={styles.paragraph}>Estas son algunas de las opciones con buena ubicación que encontramos: </p>
            <h4>Booking</h4>
            <ul className={styles.list}>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/nueva-cba-nazareno-xv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para 2 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/el-apartamento-nueva-cordoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para 3 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/babel-nueva-cordoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamentos para 2, 3, 4, 6 y 8 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/ama-c-rian-executive-ca3rdoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Hotel Amérian (habitaciones para 1-2 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/selina-cordoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Hotel Socialtel (habitaciones para 2-4 personas)
                </a>
              </li>
            </ul>
            <h4>Airbnb</h4>
            <ul className={styles.list}>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1062265281275593002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para hasta 4 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1292922533587191999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para hasta 4 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1127029869516680194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para hasta 3 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1295656798026530006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para hasta 3 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/777706739491948566"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para hasta 2 personas
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1197456670513463781"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento para hasta 2 personas
                </a>
              </li>
            </ul>
          </div>
          <Button 
              onClick={() => setExpandedSections(prev => ({ ...prev, city: !prev.city }))}
              className={styles.readMoreButton}
            >
              <span>
                {expandedSections.city ? 'Ver menos' : 'Ver opciones'}
              </span>
              <svg 
                className={`${styles.arrow} ${expandedSections.city ? styles.arrowUp : ''}`}
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
        <p className={styles.paragraph}>Obvio que estas opciones son solo algunas de las que hay disponibles y las proponemos como un punto de partida para orientarte. Podés seguir investigando por tu cuenta y por ahí encontrás algo que te guste más.</p>
      </div>
    </div>
  );
};

export default Lodging;