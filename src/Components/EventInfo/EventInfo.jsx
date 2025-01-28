import Button from '../Button/Button';
import styles from './EventInfo.module.css';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const EventInfo = () => {
  const googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3417.557280229469!2d-64.28468118803428!3d-31.066422074318456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94327e493e62d587%3A0x74fb360063580bd1!2sEstancia%20el%20Rosal!5e0!3m2!1ses!2sar!4v1737211945792!5m2!1ses!2sar";
  const directionsUrl = "https://www.google.com/maps/place/Estancia+el+Rosal/@-31.0664221,-64.2846812,17z/data=!3m1!4b1!4m6!3m5!1s0x94327e493e62d587:0x74fb360063580bd1!8m2!3d-31.0664221!4d-64.2821009!16s%2Fg%2F11bvv51p4m?entry=ttu";

  const handleOpenMaps = () => {
    window.open(directionsUrl, '_blank');
  };

  return (
    <section className={styles.eventInfoContainer}>
      <header className={styles.title}>
        <h2>INFORMACIÓN&nbsp;</h2>
        <h2>DEL EVENTO</h2>
      </header>
      <ErrorBoundary>
        <div className={styles.container}>
          <article className={styles.infoSection}>
            <p>
              <span className={styles.infoTitle}>Fecha:&nbsp;</span>
              <span className={styles.infoText}>30/08/25</span>
            </p>
            <p>
              <span className={styles.infoTitle}>Hora:&nbsp;</span>
              <span className={styles.infoText}>12:30&nbsp;p.&nbsp;m.</span>
            </p>
            <p>
              <span className={styles.infoTitle}>Lugar:&nbsp;</span>
              <span className={styles.infoText}>Estancia El Rosal, Agua de Oro, Córdoba, Argentina</span>
            </p>
          </article>
          <div className={styles.mapContainer}>
            <iframe
              src={googleMapsUrl}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Event Location"
            />
          </div>
          <Button 
            onClick={handleOpenMaps}
            className={styles.mapButton}
          >
            Abrir en Google Maps
          </Button>
          <p className={styles.clarification}>(Te recomendamos que uses esta ubicación, ya que, si buscás el salón por nombre en Google Maps, hay más de un resultado, y podés terminar demorando más de lo previsto en llegar).</p>
        </div>
      </ErrorBoundary>
    </section>
  );
};

export default EventInfo;