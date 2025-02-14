import { useState, useEffect, useCallback } from 'react';
import { getLodgingReservation } from '../../services/lodging_services';
import LodgingForm from './LodgingForm/LodgingForm';
import LodgingStatus from './LodgingStatus/LodgingStatus';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import WarningIcon from '../../assets/icons/WarningIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import styles from './Lodging.module.css';

const ERROR_MESSAGES = {
  FETCH_ERROR: 'No pudimos cargar tu información. Tocá el botón para intentar de nuevo.',
  NO_INVITATION: 'No encontramos tu invitación. Revisá que el enlace que estás usando sea el mismo que te enviamos por WhatsApp.',
  CANCEL_ERROR: 'No pudimos cancelar tu reserva. Tocá el botón para intentar de nuevo.'
};

const Lodging = () => {
  const [expandedSections, setExpandedSections] = useState({
    venue: false,
    nearby: false,
    city: false
  });
  const [showForm, setShowForm] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: null, message: null });

  const invitationId = new URLSearchParams(window.location.search).get('invitationId');

  const fetchReservation = useCallback(async () => {
    setLoading(true);
    setStatus({ type: null, message: null });
    
    try {
      if (invitationId) {
        const reservationData = await getLodgingReservation(invitationId);
        setReservation(reservationData); // reservationData will be null if no reservation exists
      }
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setStatus({
        type: 'error',
        message: ERROR_MESSAGES.FETCH_ERROR
      });
    } finally {
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const handleFormVisibility = (visible) => {
    setShowForm(visible);
    setStatus({
      type: null,
      message: null
    });
  };

  const handleReservationSuccess = (newReservation) => {
    setReservation(newReservation);
    setShowForm(false);
    setStatus({
      type: 'success',
      message: '¡Listo! Ya te guardamos tus lugares. 😎'
    });
  };

  const handleCancelSuccess = () => {
    setReservation(null);
    setStatus({
      type: 'success',
      message: '¡Listo! Cancelamos tu reserva.'
    });
  };

  const handleCancelError = () => {
    setStatus({
      type: 'error',
      message: ERROR_MESSAGES.CANCEL_ERROR
    });
  };

  const renderVenueAccommodation = () => {
    if (status.type === 'error') {
      return (
        <>
          <p className={`${styles.message} ${styles.error}`}>
            <span>
              <WarningIcon />
            </span>
            <span>{status.message}</span>
          </p>
          <Button 
            onClick={fetchReservation}
            className={styles.retryButton}
          >
            Intentar de nuevo
          </Button>
        </>
      );
    }

    return (
      <>
        {status.type === 'success' && (
          <p className={`${styles.message} ${styles.success}`}>
            <span>
              <CheckIcon />
            </span>
            <span>{status.message}</span>
          </p>
        )}

        {loading ? (
          <Spinner />
        ) : showForm ? (
          <LodgingForm 
            invitationId={invitationId}
            onClose={() => handleFormVisibility(false)}
            onRetry={fetchReservation}
            onSuccess={handleReservationSuccess}
            isModifying={!!reservation}
            reservation={reservation}
          />
        ) : reservation ? (
          <LodgingStatus 
            reservation={reservation}
            onModify={() => handleFormVisibility(true)}
            onCancelSuccess={handleCancelSuccess}
            onCancelError={handleCancelError}
          />
        ) : (
          <>
            <p className={styles.paragraph}>El salón cuenta con alojamiento propio, que podemos usar la noche del evento (30 de agosto de 2025).</p>
            <div className={`${styles.expandableContent} ${expandedSections.venue ? styles.expanded : ''}`}>
              <p className={styles.paragraph}>El precio aproximado es de $40.000 por persona por noche. Este precio varia según la cantidad total de personas que decidan quedarse y la fecha de pago.</p>
              <p className={styles.paragraph}>Hay 66 lugares disponibles, asi que, si elegís esta opción, es necesario que nos avises cuanto antes. Para hacerlo, tocá el botón que se encuentra abajo.</p>
              <p className={styles.paragraph}>Por ahora, solo hay disponibilidad para la noche del evento. Mas cerca de la fecha vamos a saber si se puede ir desde el día anterior (29 de agosto).</p>
              <p className={styles.paragraph}>Nosotros nos vamos a quedar ahí. Nuestra idea es pasar la mañana siguiente con los que se queden para aprovechar su visita al máximo.</p>
              <Button
                className={styles.bookButton}
                onClick={() => handleFormVisibility(true)}
              >
                Reservar
              </Button>
            </div>
          </>
        )}
      </>
    );
  };

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
          <h3>En el salón</h3>
          {renderVenueAccommodation()}
          {!loading && !showForm && !reservation ?
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
          : null}
        </article>
        <article className={styles.card}>
          <h3>En localidades cercanas al salón</h3>
          <p className={styles.paragraph}>Si bien son limitadas, hay algunas opciones de alojamiento en Agua de Oro, Salsipuedes, La Granja, Villa Cerro Azul, entre otros. Si elegís quedarte por esa zona, tenés el beneficio de estar cerca del salón, por lo que podrías llegar en taxi sin problemas. Por otro lado, si vas a venir varios días, no hay tanto para hacer como en la Ciudad de Córdoba.</p>
          <div className={`${styles.expandableContent} ${expandedSections.nearby ? styles.expanded : ''}`}>
            <p className={styles.paragraph}>Estas son algunas de las opciones que encontramos:</p>
            <h4>Booking</h4>
            <ul className={styles.list}>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/la-pasionaria-agua-de-oro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  La Pasionaria Casa de Campo (hasta 6 personas)
                </a>
              </li>
              <li>
              <a
                href="https://www.booking.com/hotel/ar/carod-espacio-serrano"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Hotel Carod Espacio Serrano
              </a>
              </li>
              <li>
              <a
                href="https://www.booking.com/hotel/ar/orfeo-suites-salsipuedes"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Orfeo Suites Hotel Sierras Chicas
              </a>
              </li>
              <li>
              <a
                href="https://www.booking.com/hotel/ar/el-cimarron-casa-de-campo"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                El Cimarron Casa de Campo (casas para 2, 4, 5 y 6 personas)
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
                Casa de montaña (hasta 4 personas)
              </a>
              </li>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/1287148350751846600"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Casa soñada en las Sierras (hasta 7 personas)
              </a>
              </li>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/21239606"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Casa Sierras Cordoba Pileta Montana Rio Cerro Azul (hasta 8 personas)
              </a>
              </li>
              <li>
              <a
                href="https://www.airbnb.com.ar/rooms/1321255171208860947"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                El Erizo Refugio Boutique (hasta 2 personas)
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
                  href="https://www.booking.com/hotel/ar/ama-c-rian-executive-ca3rdoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Hotel Amérian Executive Córdoba
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/selina-cordoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Hotel Socialtel Nueva Cordoba
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/babel-nueva-cordoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamentos Babel Nueva Córdoba (para 2, 4 y 8 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/melina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamentos Mediterraneo (para 4 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/el-apartamento-nueva-cordoba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  El apartamento Nueva Cordoba (para 3 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.booking.com/hotel/ar/nueva-cba-nazareno-xv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento Nueva Cba, Nazareno XV (para 2 personas)
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
                  Tribeca, cálido y renovado depto en Nueva Córdoba (hasta 4 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1292922533587191999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento cómodo y luminoso (hasta 4 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1066015212599551419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Dpto Nueva Cba con cochera (hasta 3 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1127029869516680194"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento con terraza Nueva Córdoba (hasta 3 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1179814858431996140"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Nórdico - Moderno Depto en Nva Cba (hasta 3 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1295656798026530006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Departamento 1 dorm. en Nva. Cba. 6B (hasta 3 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/777706739491948566"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Nueva Córdoba Temporal 3B (hasta 2 personas)
                </a>
              </li>
              <li>
                <a
                  href="https://www.airbnb.com.ar/rooms/1197456670513463781"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Guarida Güemes (hasta 2 personas)
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
        <p className={styles.paragraph}>Obvio que estas opciones son solo algunas de las que hay disponibles y las proponemos como un punto de partida para orientarte. ¡Podés seguir investigando por tu cuenta y por ahí encontrás algo que te guste más!</p>
      </div>
    </div>
  );
};

export default Lodging;