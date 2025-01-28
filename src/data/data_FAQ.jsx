const data = [
  {
    question: '¿Cómo confirmo si voy o no voy?',
    answer: (
      <p>
        Facilísimo: andá a la sección <strong>Confirmar asistencia</strong> de esta página y seguí los pasos hasta que te aparezca un mensaje de confirmación verde. Te pedimos que nos avises lo antes posible, ya sea que vengas o no, para poder organizarnos con tiempo. Y no te preocupes si cambiás de opinión más adelante; podés modificar tu respuesta hasta el <strong>30 de julio de 2025</strong>.
      </p>
    )
  },
  {
    question: '¿Qué hago si al final no puedo asistir?',
    answer: (
      <p>
        ¡No hay drama! Si ya confirmaste que venías y después no podés, solo tenés que volver a la sección <strong>Confirmar asistencia</strong> y cambiar tu respuesta. Eso sí, avisanos lo antes posible para ajustar los planes.
      </p>
    )
  },
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
        <p>¡Un look cómodo siempre es una buena idea!</p>
      </>
    )
  },
  {
    question: '¿Hay que ir a más de un lugar? ¿Van a tener una ceremonia religiosa?',
    answer: (
      <p>
        No. Nada de complicaciones: <strong>todo pasa en un solo lugar</strong>. La ceremonia civil se hace en el salón (Estancia El Rosal) y no hay ceremonia religiosa. ¡Todo en un solo evento, sin traslados extra!
      </p>
    )
  },
  {
    question: '¿Hay que pagar tarjeta?',
    answer: (
      <p>
        ¡No te preocupes por eso! La comida y bebida corren por nuestra cuenta. Solo tenés que venir y disfrutar.
      </p>
    )
  },
  {
    question: '¿Qué hago si hay alimentos que no puedo comer?',
    answer: (
      <p>
        Si tenés alguna restricción alimentaria o seguís una dieta especial (por ejemplo, una dieta vegana), te pedimos que nos lo aclares en el campo <strong>Restricciones alimentarias</strong> del formulario de asistencia que se encuentra en la sección <strong>Confirmar asistencia</strong>, así te gestionamos un plato que se adapte a tus necesidades.
      </p>
    )
  },
  {
    question: '¿Va a haber bebidas con alcohol?',
    answer: (
      <p>
        ¡Por supuesto! Habrá barra libre con muchas opciones para elegir. Eso sí, si pensás tomar y te alojás en la Ciudad de Córdoba, recordá que <strong>es muy probable que haya controles de alcoholemia</strong>. Mejor organizate para tener un conductor designado o usá otra opción de traslado.
      </p>
    )
  },
  {
    question: '¿Va a haber bebidas sin alcohol?',
    answer: (
      <p>
        ¡Obvio que sí! Además de agua y gaseosas, habrá limonadas y smoothies riquísimos para quienes prefieran no tomar alcohol.
      </p>
    )
  },
  {
    question: '¿Puedo llevar un acompañante?',
    answer: (
      <p>
        Aunque nos encantaría invitar a todo el mundo, nuestro presupuesto tiene un límite. Por eso, <strong>solo pueden venir las personas indicadas en tu invitación</strong>. Podés fijarte quiénes están incluidos en tu grupo en el mensaje que te enviamos por WhatsApp (con el enlace a esta página) y en el formulario de asistencia de la sección <strong>Confirmar asistencia</strong>.
      </p>
    )
  },
  {
    question: '¿Pueden asistir niños?',
    answer: (
      <>
        <p>
        ¡Sí, los niños son más que bienvenidos! Los incluimos en las invitaciones que enviamos. Sin embargo, sabemos que tal vez prefieras venir solo para relajarte y disfrutar. ¡Vos elegís lo que sea mejor para tu familia!
        </p>
        <p>
          Tené en cuenta que el lugar está en un predio grande con bosque, una pileta artificial y cerca de un río, así que es ideal mantener a los peques vigilados. Si vienen más de 6 niños (entre 2 y 12 años), habrá una niñera para cuidarlos durante el evento.
        </p>
      </>
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
  {
    question: '¿Tengo que llevar un regalo?',
    answer: (
      <p>
        El mejor regalo es que vengas y compartas este día con nosotros. Pero, si querés hacernos un mimo extra, podés ayudarnos con nuestra luna de miel (¡nos vamos a Japón!). Si querés colaborar, en la sección <strong>Regalos</strong> de esta página vas a encontrar varias opciones.
      </p>
    )
  },
  {
    question: '¿Dónde me puedo alojar?',
    answer: (
      <>
        <p>
          El salón está en la localidad de Agua de Oro, que queda a 45 km de la Ciudad de Córdoba. Estas son algunas opciones de alojamiento:
        </p>
        <p>
          <strong>Opción de alojamiento en el salón:</strong>
        </p>
        <ul>
          <li>
            Precio aproximado: $40.000 por persona por noche (varía según la cantidad total de personas que decidan quedarse y la fecha de pago).
          </li>
          <li>
            Plazas: Hay 66 lugares, así que, si querés quedarte, es necesario que nos avises cuanto antes.
          </li>
          <li>
            Por ahora, solo hay disponibilidad para la noche del evento. Más cerca de la fecha vamos a saber si se puede ir desde la noche del 29 de agosto.
          </li>
          <li>
            Nosotros nos vamos a quedar ahí y nuestra idea es poder compartir la mañana siguiente con los que se queden.
          </li>
        </ul>
        <p>
          <strong>Opciones de alojamiento en Agua de Oro:</strong>
        </p>
        <ul>
          <li>
            [Opciones en Agua de Oro]
          </li>
        </ul>
        <p>
          <strong>Opciones de alojamiento en Córdoba:</strong>
        </p>
        <ul>
          <li>
            [Opciones en Córdoba]
          </li>
        </ul>
      </>
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
  {
    question: '¿Cómo me traslado?',
    answer: (
      <>
        <p>
          <strong>Desde el aeropuerto al centro de la Ciudad de Córdoba:</strong>
        </p>
        <ul>
          <li>
            <strong>Colectivo Aerobus:</strong> Necesitás una tarjeta Red Bus (la SUBE cordobesa). Salen cada 30 minutos aproximadamente. El recorrido termina en la Nueva Terminal de Ómnibus (zona centro), pero hace varias paradas.
          </li>
          <li>
            <strong>Taxi:</strong> Siempre hay en el aeropuerto.
          </li>
          <li>
            <strong>Remis:</strong> Suele ser un poco más barato que el taxi, pero requiere reserva. Te podemos pasar el contacto de alguna remisería si lo necesitás.
          </li>
          <li>
            <strong>Uber:</strong> Si bien funciona y es recomendable en muchas partes de la ciudad, NO es legal en Córdoba, por lo que es muy probable que no te acepten el viaje desde el aeropuerto.
          </li>
        </ul>
        <p>
          <strong>Desde Córdoba a Agua de Oro:</strong>
        </p>
        <ul>
          <li>
            <strong>Colectivo interurbano:</strong> Podés tomar un colectivo de Fonobus en la Nueva Terminal de Ómnibus de Córdoba (zona centro) que te deje en Agua de Oro. Desde ahí, podés ir hasta el salón en taxi.
          </li>
          <li>
            <strong>Taxi</strong>.
          </li>
          <li>
            <strong>Traffic:</strong> La opción más cómoda si juntamos un grupo. Avisanos si te interesa y nosotros nos encargamos de la logística.
          </li>
        </ul>
      </>
    )
  },
  {
    question: '¿Cómo obtengo la ubicación del salón?',
    answer: (
      <p>
        La ubicación exacta está en la sección <strong>Información del evento</strong> de esta página. ¡Usá ese enlace, porque Google también muestra otro lugar con el mismo nombre que está a 20 minutos del salón!
      </p>
    )
  },
  {
    question: '¿Qué hago si necesito ayuda el día de la boda?',
    answer: (
      <p>
        Unos días antes del evento, te vamos a agregar a un grupo de WhatsApp con todos los invitados confirmados. Ahí vamos a compartir información importante y los contactos de personas de confianza que pueden ayudarte o avisarnos si necesitás algo.
      </p>
    )
  },
];

export default data;