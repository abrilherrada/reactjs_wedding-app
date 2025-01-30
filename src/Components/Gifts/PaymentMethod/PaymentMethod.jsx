import styles from "./PaymentMethod.module.css";

const PaymentMethod = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Podés enviarnos el valor de tu regalo por alguno de estos medios:</p>
      <div className={styles.card}>
        <h3>Por transferencia</h3>
        <p className={styles.description}>Para los que tienen todo en blanco y nada que temer</p>
        <div className={styles.optionsContainer}>
          <div>
            <h4>En Argentina</h4>
            <div className={styles.options}>
              <div className={styles.option}>
                <h5>En pesos</h5>
                <ul className={styles.list}>
                  <li className={styles.item}>CBU: 0123456789012345678901</li>
                  <li className={styles.item}>Alias: ABRIL.HERRADA</li>
                  <li className={styles.item}>Titular: Abril Herrada Galvagni</li>
                </ul>
              </div>
              <div className={styles.option}>
                <h5>En dólares</h5>
                <ul className={styles.list}>
                  <li className={styles.item}>CBU: 0123456789012345678901</li>
                  <li className={styles.item}>Alias: ABRIL.HERRADA</li>
                  <li className={styles.item}>Titular: Abril Herrada Galvagni</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4>Fuera de Argentina</h4>
            <div className={styles.options}>
              <div className={styles.option}>
                <h5>Cuenta de USA</h5>
                <ul className={styles.list}>
                  <li className={styles.item}>Número de cuenta: 012345678901</li>
                  <li className={styles.item}>Numero de ruta: 012345678</li>
                  <li className={styles.item}>Tipo de cuenta: Cuenta de cheques</li>
                </ul>
              </div>
              <div className={styles.option}>
                <h5>PayPal</h5>
                <ul className={styles.list}>
                  <li className={styles.item}>
                    <a 
                      href="https://www.paypal.me/macarlupu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      paypal.me/macarlupu
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h3>En efectivo</h3>
        <p className={styles.description}>Para los que prefieren el cash, la guita, el metálico, la viva</p>
        <div className={styles.options}>
          <div className={styles.option}>
            <h5>En el evento</h5>
            <ul className={styles.list}>
              <li className={styles.item}>Si te queda más cómodo, podés darnos tu regalo el día del evento.</li>
            </ul>
          </div>
          <div className={styles.option}>
            <h5>En otro momento</h5>
            <ul className={styles.list}>
              <li className={styles.item}>Si la opción anterior no te sirve, hablanos y nos organizamos.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h3>Con cripto</h3>
        <p className={styles.description}>Para los que son parte de la revolución</p>
        <div>
          <h4>USDT</h4>
          <div className={styles.options}>
            <div className={styles.option}>
              <h5>Tron</h5>
              <ul className={styles.list}>
                <li className={styles.item}>TY6eRquTwFP1Bjo22RrSCT6sS2FhU5qvpZ</li>
              </ul>
            </div>
            <div className={styles.option}>
              <h5>BNB Smart Chain</h5>
              <ul className={styles.list}>
                <li className={styles.item}>0xca81396f30794c51ddB327039590e20EC1fe9e06</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h3>Con tarjeta de crédito</h3>
        <p className={styles.description}>Para los que quieren sumar los puntos o las millas como sea</p>
        <div className={styles.options}>
          <div className={styles.option}>
            <h4>En pesos</h4>
            <h5>Mercadopago</h5>
            <ul className={styles.list}>
              <li className={styles.item}>
                <a
                  href="https://www.link.mercadopago.com.ar/macarlupu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  link.mercadopago.com.ar/macarlupu
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.option}>
            <h4>En dólares</h4>
            <h5>PayPal</h5>
            <ul className={styles.list}>
              <li className={styles.item}>
                <a 
                  href="https://www.paypal.me/macarlupu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  paypal.me/macarlupu
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;