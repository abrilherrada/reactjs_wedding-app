import { useState, useRef } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Button from '../Button/Button';
import Card from './Card/Card';
import Modal from '../Modal/Modal';
import PaymentMethod from './PaymentMethod/PaymentMethod';
import data from '../../data/data_gifts';
import styles from './Gifts.module.css';

const Gifts = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const paymentMethodRef = useRef(null);

  const handleCloseModal = () => {
    setShowModal(false);
    
    setTimeout(() => {
      if (paymentMethodRef.current) {
        const navbarHeight = 80;
        
        const elementPosition = paymentMethodRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h2>REGALOS</h2>
      </header>
      <ErrorBoundary>
        <div className={styles.content}>
          <p className={styles.description}>El mejor regalo es tu presencia. No hace falta nada más. En serio.</p>
          <div className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}>
            <p className={styles.description}>¿Cómo? ¿Que no vas a aceptar un &quot;no&quot; como respuesta? Bueno, está bien, si insistís... Si querés regalarnos algo, podés regalarnos un pedacito de nuestra luna de miel. ¡Nos vamos a Japón!</p>
            <p className={styles.description}>¿Qué nos podés regalar para un viaje a Japón? Te dejamos algunas ideas.</p>
            <div className={styles.giftsGrid}>
              {data.map((gift, index) => (
                <Card key={index} {...gift} onClick={() => setShowModal(true)} />
              ))}
            </div>
            <Modal
              isOpen={showModal}
              title= '¡Gracias!'
              message='Tu regalo va a hacer que nuestra luna de miel sea aún más especial. ❤️ Para hacernos el regalo, solo tenés que enviarnos el monto del regalo por alguno de los medios de pago disponibles.'
              onCancel= {handleCloseModal}
              cancelText='Ver medios de pago'
            />
            <div ref={paymentMethodRef}>
              <PaymentMethod />
            </div>
          </div>
          <Button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.readMoreButton}
          >
            <span>
              {isExpanded ? 'Ver menos' : 'Quiero hacerles un regalo'}
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
      </ErrorBoundary>
    </div>
  )
}

export default Gifts;