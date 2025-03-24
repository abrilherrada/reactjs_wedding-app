const data = [
  {
    category: "Asistencia e invitados",
    items: [
      {
        question: '¿Cómo confirmo si voy o no voy?',
        answer: (
          <p>
            Facilísimo: andá a la sección <a href="#rsvp">Confirmación de asistencia</a> de esta página y seguí los pasos hasta que te aparezca un mensaje de confirmación verde. Te pedimos que nos avises lo antes posible, ya sea que vengas o no, para poder organizarnos con tiempo. Y no te preocupes si cambiás de opinión más adelante; podés modificar tu respuesta hasta el <u>30 de julio de 2025</u>.
          </p>
        )
      },
      {
        question: '¿Qué hago si al final no puedo asistir?',
        answer: (
          <p>
            ¡No hay drama! Si ya confirmaste que venías y después no podés, solo tenés que volver a la sección <a href="#rsvp">Confirmación de asistencia</a> y cambiar tu respuesta. Eso sí, avisanos lo antes posible para ajustar los planes.
          </p>
        )
      },
      {
        question: '¿Puedo llevar un acompañante?',
        answer: (
          <p>
            Aunque nos encantaría invitar a todo el mundo, nuestro presupuesto tiene un límite. Por eso, <u>solo pueden venir las personas indicadas en tu invitación</u>. Podés fijarte quiénes están incluidos en tu grupo en el mensaje que te enviamos por WhatsApp (con el enlace a esta página) y en el formulario de asistencia de la sección <a href="#rsvp">Confirmación de asistencia</a>.
          </p>
        )
      }
    ]
  },
  {
    category: "Cosas que da vergüenza preguntar",
    items: [
      {
        question: '¿Hay que pagar tarjeta?',
        answer: (
          <p>
            No, la fiesta corre por nuestra cuenta. Solo tenés que venir y disfrutar.
          </p>
        )
      },
      {
        question: '¿Tengo que llevar un regalo?',
        answer: (
          <p>
            El mejor regalo es que vengas y compartas este día con nosotros. Pero, si querés regalarnos algo, podés regalarnos un pedacito de nuestra luna de miel (¡nos vamos a Japón!). Fijate cómo hacerlo en la sección <a href="#gifts">Regalos</a> de esta página.
          </p>
        )
      },
    ]
  },
  {
    category: "Vestimenta y clima",
    items: [
      {
        question: '¿Qué me pongo?',
        answer: (
          <>
            <p>
              No hay código de vestimenta, así que ponete lo que te guste y te haga sentir bien. Eso sí, tené en cuenta lo siguiente:
            </p>
            <ul>
              <li>
                El salón está en una estancia con césped y caminos de tierra.
              </li>
              <li>
                El evento es de día.
              </li>
              <li>
                La temperatura promedio en esa fecha y ese horario es de 14°C a 21°C.
              </li>
            </ul>
          </>
        )
      },
      {
        question: '¿Qué clima debería esperar?',
        answer: (
          <>
            <p>
              No tenemos una bola de cristal, pero según los datos históricos:
            </p>
            <ul>
              <li>
                La temperatura promedio en esa fecha y ese horario es de 14°C a 21°C.
              </li>
              <li>
                Suele estar nublado.
              </li>
              <li>
                Hay pocas probabilidades de lluvia.
              </li>
            </ul>
            <p>
              Te recomendamos que traigas algo para abrigarte, por las dudas.
            </p>
          </>
        )
      },
    ]
  },
  {
    category: "Evento y salón",
    items: [
      {
        question: '¿Hay que ir a más de un lugar? ¿Van a tener una ceremonia religiosa?',
        answer: (
          <p>
            No. Nada de complicaciones: <u>todo pasa en un solo lugar</u>. La ceremonia civil se hace en el salón (Estancia El Rosal) y no hay ceremonia religiosa. ¡Todo en un solo evento, sin traslados extra!
          </p>
        )
      },
      {
        question: '¿Cómo obtengo la ubicación del salón?',
        answer: (
          <p>
            La ubicación exacta está en la sección <a href="#info">Información del evento</a> de esta página. Usá ese enlace, porque Google también muestra otro lugar con el mismo nombre que está a 20 minutos del salón.
          </p>
        )
      },
      {
        question: '¿Hay estacionamiento en el salón?',
        answer: (
          <p>
            ¡Sí! Hay un espacio amplio para estacionar y personal de seguridad para cuidar los autos.
          </p>
        )
      },
    ]
  },
  {
    category: "Comida y bebida",
    items: [
      {
        question: '¿Qué hago si tengo una dieta especial?',
        answer: (
          <p>
            Si tenés alguna restricción alimentaria o seguís una dieta especial (por ejemplo, una dieta vegana), te pedimos que nos lo aclares en el campo <u>Restricciones alimentarias</u> del formulario de asistencia que se encuentra en la sección <a href="#rsvp">Confirmación de asistencia</a>, así te gestionamos un plato que se adapte a tus necesidades.
          </p>
        )
      },
      {
        question: '¿Qué tipo de bebidas va a haber?',
        answer: (
          <>
            <p>
              Habrá barra libre de bebidas alcohólicas con muchas opciones para elegir. Eso sí, si pensás tomar y te alojás en la Ciudad de Córdoba, recordá que <u>es muy probable que haya controles de alcoholemia</u>. Mejor organizate para tener un conductor designado o usá otra opción de traslado.
            </p>
            <p>
              Para los que prefieran no tomar alcohol, además de agua y gaseosas, habrá limonada y smoothies riquísimos.
          </p>
          </>
        )
      },
    ]
  },
  {
    category: "Alojamiento y traslado",
    items: [
      {
        question: '¿Dónde me puedo alojar?',
        answer: (
            <p>
              Si venís de visita para el casamiento, tenés varias alternativas de alojamiento. Para orientarte, hicimos la sección <a href="#lodging">Opciones de alojamiento</a>, que contiene algunas recomendaciones e información sobre cada opción.
            </p>
        )
      },
      {
        question: '¿Cómo me traslado?',
        answer: (
          <p>
            La opción más práctica y rápida siempre va a ser en auto. Para los que no van a disponer de un auto o prefieren no manejar, hicimos la sección <a href="#transportation">Opciones de traslado</a>, que contiene algunas recomendaciones e información sobre cada opción.
          </p>
        )
      },
      {
        question: '¿Cuál es el aeropuerto más cercano?',
        answer: (
          <>
            <p>
              El Aeropuerto Internacional de Córdoba Ingeniero Aeronáutico Ambrosio Taravella en la Ciudad de Córdoba.
            </p>
            <p>
              Si necesitas ayuda con los pasajes aéreos, comunicate con nosotros para que te pasemos el contacto de nuestra agente de confianza, que hace magia con los precios.
            </p>
          </>
        )
      },
    ]
  },
  {
    category: "Ayuda",
    items: [
      {
        question: '¿Qué hago si necesito ayuda el día de la boda?',
        answer: (
          <p>
            Unos días antes del evento, te vamos a agregar a un grupo de WhatsApp con todos los invitados confirmados. Ahí vamos a compartir información importante y los contactos de personas de confianza que pueden ayudarte o avisarnos si necesitás algo.
          </p>
        )
      },
    ]
  },
];

export default data;