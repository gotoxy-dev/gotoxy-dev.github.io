/**
 * SITE CONTENT — Spanish (Argentina, voseo as on gotoxy.dev).
 * Same shape as `site.ts`; media paths and links are shared.
 */
import { brand as brandEn, caseMedia, projects as projectsEn, type SiteContent } from './site'

export const brand: SiteContent['brand'] = {
  ...brandEn,
  tagline: 'Software e IA',
  description:
    'Diseñamos e implementamos software, integraciones y automatizaciones con IA alrededor de cómo trabaja tu empresa. Conectamos lo que ya usás, construimos lo que falta y dejamos la solución funcionando.',
  shortDescription: 'Software a medida, integraciones y automatización con IA. Rosario, Argentina.',
  services: ['Software a medida', 'Integraciones', 'Automatización', 'Agentes de IA'],
  copyright: `${new Date().getFullYear()} GOTOXY. ROSARIO, ARGENTINA. TODOS LOS DERECHOS RESERVADOS`,
}

export const nav: SiteContent['nav'] = {
  links: [
    { label: 'Casos', href: '/#projects' },
    { label: 'Cómo trabajamos', href: '/#process' },
    { label: 'Qué hacemos', href: '/#services' },
    { label: 'En números', href: '/#numbers' },
  ],
  cta: { label: 'Hablemos', href: brand.bookingUrl },
}

export const hero: SiteContent['hero'] = {
  lines: [
    { text: 'Conectamos lo que', align: 'left' },
    { text: 'ya usás.', align: 'left', trailing: 'Construimos' },
    { text: 'lo que falta.', align: 'right' },
  ],
  caption: ['Software · Integraciones · Automatización · IA', 'Rosario, Argentina'],
}

const tagsEs: Record<string, string[]> = {
  japon: ['Gastronomía', 'E-commerce', 'Pagos'],
  cam: ['Educación', 'API de WhatsApp', 'Automatización'],
  animageneris: ['Operación de contenido', 'IA', 'App móvil'],
  agents: ['Operaciones', 'Agentes de IA', 'Integraciones'],
  inspection: ['Higiene y seguridad', 'Software a medida', 'IA'],
  speech: ['iOS', 'Voz en tiempo real', 'IA de baja latencia'],
}
const namesEs: Record<string, string> = {
  agents: 'Agentes de IA con herramientas',
  inspection: 'Informes de inspección de obra',
  speech: 'Corrección de inglés en tiempo real',
}

export const projects: SiteContent['projects'] = projectsEn.map((p) => ({
  ...p,
  name: namesEs[p.id] ?? p.name,
  tags: tagsEs[p.id] ?? p.tags,
}))

export const clients: SiteContent['clients'] = {
  title: ['Cómo', 'Trabajamos'],
  seeMoreLabel: 'Agendar una charla',
  seeMoreHref: brand.bookingUrl,
  seeMoreLogo: '',
  readLabel: 'Leer',
  closeLabel: 'Cerrar',
  testimonials: [
    {
      id: 'understand',
      author: '01 / Entender',
      role: 'La primera charla',
      company: 'Mapear el proceso real',
      scope: 'Tareas · datos · decisiones /\nexcepciones · controles',
      quote:
        'Trabajamos con quien hace la tarea. Mapeamos datos, decisiones, excepciones y controles.\n\nNo hace falta llegar con una solución definida: mostranos cómo trabajan hoy y dónde aparece la dificultad.',
    },
    {
      id: 'build',
      author: '02 / Construir e integrar',
      role: 'Solo lo que el proceso necesita',
      company: 'Conectar y construir',
      scope: 'Herramientas existentes · APIs /\nsoftware a medida · IA',
      quote:
        'Conectamos las herramientas existentes y desarrollamos únicamente lo que el proceso necesita.\n\nUsamos IA durante el análisis, el desarrollo y las pruebas para avanzar más rápido. La arquitectura, la seguridad y las decisiones críticas siguen a cargo del equipo.',
    },
    {
      id: 'implement',
      author: '03 / Implementar',
      role: 'Funcionando con tu equipo',
      company: 'Instalar y ajustar',
      scope: 'Pruebas con el equipo /\najustes sobre el uso diario · entrega',
      quote:
        'Probamos con el equipo, ajustamos sobre el uso diario y dejamos el sistema instalado y funcionando.\n\nCada proyecto empezó igual: alguien nos mostró cómo trabajaba. A partir de ahí conectamos herramientas, desarrollamos software e implementamos una solución a medida.',
    },
  ],
  logos: [
    { id: 'l1', name: 'Japón in Box', src: '/assets/logos/client-japon-in-box.svg' },
    { id: 'l2', name: 'Instituto CAM', src: '/assets/logos/client-instituto-cam.png' },
    { id: 'l3', name: 'Animageneris', src: '/assets/logos/client-animageneris.svg' },
    { id: 'l4', name: 'WhatsApp Business API', src: '/assets/logos/stack-whatsapp.svg' },
    { id: 'l5', name: 'Cloudflare Workers', src: '/assets/logos/stack-cloudflare.svg' },
    { id: 'l6', name: 'Mercado Libre', src: '/assets/logos/stack-mercado-libre.svg' },
    { id: 'l7', name: 'Moodle', src: '/assets/logos/stack-moodle.svg' },
    { id: 'l8', name: 'Mercado Pago', src: '/assets/logos/stack-mercado-pago.svg' },
  ],
}

export const awards: SiteContent['awards'] = {
  intro:
    'Ingenieros con experiencia en software, automatización e IA. Conectamos tus sistemas, reducimos trabajo manual y dejamos la solución funcionando con tu equipo. Desarrollo acelerado por IA; la arquitectura, la seguridad y las decisiones críticas siguen en manos de personas.',
  moreLabel: ['Todos los sistemas de arriba', 'están hoy en producción'],
  groups: [
    {
      id: 'cam',
      name: 'Instituto CAM',
      image: '/assets/cases/instituto-cam/page-1.jpg',
      entries: [
        { title: '2.300+ alumnos registrados y cotejados', year: '2025' },
        { title: '11 días desde la firma hasta el primer WhatsApp enviado', year: '2025' },
        { title: '100% automatizado, de punta a punta, disponible 24/7', year: '2025' },
        { title: '3 semanas, 97 pull requests, más de 2.000 pruebas automáticas', year: '2025' },
        { title: '14 pantallas en el panel propio del instituto', year: '2025' },
      ],
    },
    {
      id: 'japon',
      name: 'Japón in Box',
      image: '/assets/cases/japon-in-box/website.webp',
      entries: [
        { title: '3 sucursales en Rosario y Funes en una sola plataforma', year: '2025' },
        { title: '10 semanas desde el inicio hasta producción', year: '2025' },
        { title: '0 comisiones de apps de delivery en su canal propio', year: '2025' },
      ],
    },
    {
      id: 'animageneris',
      name: 'Animageneris',
      image: '/assets/cases/animageneris/page-1.jpg',
      entries: [
        { title: '20 canales investigados, producidos y publicados por un sistema', year: '2025' },
        { title: '40,4 mil seguidores y 2,1 millones de likes en TikTok', year: '2025' },
        { title: 'Agenda y publicación en YouTube y TikTok desde el celular', year: '2025' },
      ],
    },
    { id: 'agents', name: 'Agentes de IA con herramientas', entries: [] },
    { id: 'inspection', name: 'Informes de inspección de obra', entries: [] },
    { id: 'speech', name: 'Corrección de inglés en tiempo real', entries: [] },
  ],
}

export const cta: SiteContent['cta'] = {
  eyebrow: ['Mostranos cómo', 'trabajan hoy'],
  headline: ['La primera charla', 'es para entender el proceso.', 'Después definimos', 'si conviene integrar,', 'automatizar o construir.'],
  button: { label: 'Hablemos', href: brand.bookingUrl },
}

export const insights: SiteContent['insights'] = {
  title: 'Qué hacemos',
  moreLabel: 'Agendar una charla',
  moreHref: brand.bookingUrl,
  items: [
    {
      id: 'integrations',
      title: 'Integraciones: conectamos las herramientas que tu equipo ya usa.',
      category: 'Integraciones',
      image: '/assets/videos/project-04.jpg',
      href: brand.bookingUrl,
    },
    {
      id: 'software',
      title: 'Software a medida construido alrededor de una operación concreta.',
      category: 'Software a medida',
      image: '/assets/cases/instituto-cam/page-1.jpg',
      href: brand.bookingUrl,
    },
    {
      id: 'automation',
      title: 'Automatización que saca el trabajo manual de las tareas diarias.',
      category: 'Automatización',
      image: '/assets/videos/project-01.jpg',
      href: brand.bookingUrl,
    },
    {
      id: 'ai',
      title: 'Agentes de IA conectados a tus datos, reglas y permisos, con aprobación humana.',
      category: 'Agentes de IA',
      image: '/assets/cases/ai-agents-operations/page-3.jpg',
      href: brand.bookingUrl,
    },
  ],
}

export const footer: SiteContent['footer'] = {
  backToTop: 'Volver arriba',
  socials: [
    { label: 'Instagram', href: brand.instagram },
    { label: 'Agendar una charla', href: brand.bookingUrl },
    { label: 'gotoxy.dev', href: brand.domain },
  ],
  headline: 'Hablemos',
  headlineHref: brand.bookingUrl,
  contact: 'Mostranos cómo trabajan hoy',
  contactHref: brand.bookingUrl,
  copyright: brand.copyright,
}

export const caseStudies: SiteContent['caseStudies'] = [
  {
    slug: 'japon-in-box',
    projectId: 'japon',
    title: 'Su propio canal de ventas, del menú al pago',
    summary:
      'Plataforma de pedidos online para Japón in Box: catálogo, carrito, pedidos y pagos integrados para tres sucursales en Rosario y Funes, desarrollada de punta a punta en diez semanas.',
    table: [
      { label: 'Cliente', value: 'Japón in Box · Sushi boutique y cocina de autor, nueve años en Rosario · Tres sucursales: Norte, Centro y Funes' },
      { label: 'Participación', value: 'Diseño de producto, desarrollo de punta a punta, pagos, puesta en producción' },
      { label: 'Alcance', value: 'Plataforma de pedidos online: catálogo, carrito, pedidos, pagos, tres sucursales' },
      {
        label: 'Resultados',
        value:
          'El cliente elige sucursal, arma su pedido y paga con tarjeta sin salir de la página; después sigue a su cadete en el mapa. Sin comisiones de apps de delivery. Diez semanas, tres sucursales, funcionando en producción.',
      },
    ],
    link: { label: 'Visitar japoninbox.com', href: 'https://japoninbox.com/' },
    pages: [
      {
        label: 'Objetivo',
        heading: 'Un canal de ventas propio, con la identidad del restaurante en cada paso.',
        paragraphs: [
          'Diseñamos y desarrollamos de punta a punta la plataforma de venta online de Japón in Box: catálogo, carrito de compras, pedidos y pagos integrados para sus tres sucursales en Rosario y Funes.',
          'Desde el celular, el cliente elige una sucursal, arma su pedido y paga online. Resolvimos el recorrido completo de compra, con la identidad del restaurante y el sistema funcionando en producción.',
        ],
      },
      {
        label: 'Resultados',
        heading: 'Pedidos, pagos y envíos en un solo panel',
        paragraphs: [
          'El restaurante gestiona cada pedido desde su propio panel: estado del pago, estado del envío y asignación de cadete, mientras el cliente sigue la entrega en el mapa.',
          'El pago con tarjeta ocurre sin salir de la página y el canal no paga comisiones a apps de delivery. Diez semanas desde el inicio hasta producción, tres sucursales en una sola plataforma.',
        ],
      },
    ],
    journey: {
      label: 'El pedido, paso a paso',
      steps: [
        {
          title: 'Entra al sitio',
          text: 'La landing presenta el restaurante y deja «Realizar un pedido» a un toque.',
          screen: '/assets/cases/japon-in-box/screens-mobile/japon-mob-01.jpg',
          height: 845,
          taps: [[327, 43]],
        },
        {
          title: 'Elige la sucursal',
          text: 'Norte, Centro o Funes. El menú que ve es el de esa sucursal.',
          screen: '/assets/cases/japon-in-box/journey/02-location.jpg',
          app: '/assets/cases/japon-in-box/journey/app/02-location.html',
          height: 900,
          taps: [[195, 622]],
        },
        {
          title: 'Arma el pedido',
          text: 'Recorre el menú por categoría y suma boxes al carrito.',
          screen: '/assets/cases/japon-in-box/journey/03-menu.jpg',
          app: '/assets/cases/japon-in-box/journey/app/03-menu.html',
          height: 2400,
          taps: [[182, 1134], [195, 2375]],
        },
        {
          title: 'Retiro o envío',
          text: 'No necesita crear una cuenta. Si es envío, la dirección se valida contra la zona de cobertura de la sucursal.',
          screen: '/assets/cases/japon-in-box/journey/04-delivery.jpg',
          app: '/assets/cases/japon-in-box/journey/app/04-delivery.html',
          height: 1900,
          taps: [[195, 1733]],
        },
        {
          title: 'Suma extras',
          text: 'Antes de finalizar, le sugiere los extras disponibles en esa sucursal.',
          screen: '/assets/cases/japon-in-box/journey/05-extras.jpg',
          app: '/assets/cases/japon-in-box/journey/app/05-extras.html',
          height: 1300,
          taps: [[302, 412], [247, 1076]],
        },
        {
          title: 'Paga',
          text: 'Efectivo, transferencia o tarjeta. Los datos de la tarjeta van directo a Payway, sin salir de la página.',
          screen: '/assets/cases/japon-in-box/journey/06-payment.jpg',
          app: '/assets/cases/japon-in-box/journey/app/06-payment.html',
          height: 2290,
          taps: [[195, 2123]],
        },
        {
          title: 'Pedido recibido',
          text: 'Ve la confirmación con el detalle, y el pedido entra al panel del restaurante.',
          screen: '/assets/cases/japon-in-box/journey/07-confirmation.jpg',
          app: '/assets/cases/japon-in-box/journey/app/07-confirmation.html',
          height: 1140,
          taps: [[190, 941]],
        },
        {
          title: 'Sigue al repartidor',
          text: 'Sigue la entrega en el mapa hasta que llega a la puerta.',
          screen: '/assets/cases/japon-in-box/journey/08-tracking.jpg',
          app: '/assets/cases/japon-in-box/journey/app/08-tracking.html',
          height: 955,
          taps: [],
        },
        {
          title: 'El cadete llega',
          text: 'La app le avisa que el cadete está en su domicilio, con el monto a tener listo.',
          screen: '/assets/cases/japon-in-box/journey/09-arrival.jpg',
          app: '/assets/cases/japon-in-box/journey/app/09-arrival.html',
          height: 930,
          taps: [],
        },
        {
          title: 'Pedido entregado',
          text: 'Una notificación confirma la entrega y cierra el pedido con una calificación.',
          screen: '/assets/cases/japon-in-box/journey/10-delivered.jpg',
          app: '/assets/cases/japon-in-box/journey/app/10-delivered.html',
          height: 790,
          taps: [],
        },
      ],
    },
    media: caseMedia('japon-in-box', {
      background: '/assets/cases/japon-in-box/website.webp',
      device: undefined,
      closing: '/assets/cases/japon-in-box/locations.webp',
      screenshot: true,
      // opens on the Japón Centro card
      closingZoom: { scale: 2.8, origin: '49% 60%' },
    }),
    next: 'instituto-cam',
  },
  {
    slug: 'instituto-cam',
    projectId: 'cam',
    title: 'De la firma al primer WhatsApp en once días',
    summary:
      'Registro y mensajería para Instituto CAM: inscripción presencial validada contra la universidad, mail reemplazado por WhatsApp con la API oficial de Meta y un panel propio que el instituto maneja solo.',
    table: [
      { label: 'Cliente', value: 'Instituto CAM · Educación · 15+ años, 100+ programas, sedes en Rosario y Ciudad del Este · 3.000+ alumnos' },
      { label: 'Participación', value: 'Mapeo del proceso, software a medida, WhatsApp Business API, integración con Moodle' },
      { label: 'Alcance', value: 'Registro, validación de documentos, mensajería, campañas, auditoría, panel de control' },
      {
        label: 'Resultados',
        value:
          '2.300+ alumnos registrados y cotejados, 100% automatizado, disponible 24/7. Once días desde la firma hasta el primer WhatsApp enviado; tres semanas, 97 pull requests y más de 2.000 pruebas automáticas para el panel completo.',
      },
    ],
    link: { label: 'Visitar caminstituto.com', href: 'https://www.caminstituto.com/' },
    pages: [
      {
        label: 'Objetivo',
        heading: 'Del mail que nadie abría a un proceso que se sostiene solo.',
        paragraphs: [
          'Instituto CAM necesitaba registrar y avisar a más de 3.000 alumnos antes de empezar clases. Por mail, nunca llegaban a tiempo.',
          'Armamos todo el proceso de punta a punta: registro presencial con validación de documentos y cotejo automático contra la lista de la universidad, y el mail reemplazado por completo por WhatsApp, con usuario, contraseña y link de Zoom enviados por la API oficial de Meta.',
        ],
      },
      {
        label: 'Resultados',
        heading: 'Construido para bancar el volumen real, no una demo',
        paragraphs: [
          'Infraestructura en Cloudflare Workers y D1, sin servidores que mantener y sin un número personal que se banee. Cotejo automático contra la lista de la universidad, con revisión manual solo para las diferencias.',
          'Después lo ampliamos hasta el panel propio del instituto, catorce pantallas: alta automática en Moodle, campañas, reenvíos, seguridad y auditoría. El instituto controla todo sin depender de nosotros.',
        ],
      },
    ],
    media: caseMedia('instituto-cam'),
    next: 'animageneris',
  },
  {
    slug: 'animageneris',
    projectId: 'animageneris',
    title: 'De publicar a mano a coordinar veinte canales',
    summary:
      'Una operación de contenido para Animageneris: un sistema que investiga, escribe, produce y publica en veinte canales de YouTube y TikTok, gestionado desde el celular con control editorial del creador.',
    table: [
      { label: 'Cliente', value: 'Animageneris · Operación de contenido' },
      { label: 'Participación', value: 'Mapeo del proceso, pipeline de IA, integraciones de publicación, app móvil' },
      { label: 'Alcance', value: 'Investigación, guiones, voz, video, subtítulos, agenda, publicación, métricas' },
      {
        label: 'Resultados',
        value: 'Veinte canales manejados por un solo sistema. 40,4 mil seguidores y 2,1 millones de likes en TikTok. El creador conserva el control editorial.',
      },
    ],
    link: { label: 'Agendar una charla', href: brand.bookingUrl },
    pages: [
      {
        label: 'Objetivo',
        heading: 'Publicar más sin sumar horas de trabajo a cada pieza.',
        paragraphs: [
          'Animageneris necesitaba publicar más sin sumar horas de trabajo a cada pieza. Empezamos con su canal de TikTok: mapeamos cómo elegía temas, escribía, producía y publicaba; después construimos un sistema alrededor de ese criterio.',
          'La plataforma investiga, prepara guiones, genera voz, video y subtítulos, agenda y publica en YouTube y TikTok.',
        ],
      },
      {
        label: 'Resultados',
        heading: 'Veinte canales, una operación, desde el celular',
        paragraphs: [
          'La app Animageneris reúne los canales, las publicaciones y sus métricas para seguir toda la operación desde el celular. El creador conserva el control editorial de cada pieza.',
          'El sistema pasó de un canal a veinte, con 40,4 mil seguidores y 2,1 millones de likes en TikTok.',
        ],
      },
    ],
    media: caseMedia('animageneris'),
    next: 'ai-agents-operations',
  },
  {
    slug: 'ai-agents-operations',
    projectId: 'agents',
    title: 'Un agente de IA conectado al trabajo diario de cada empresa',
    summary:
      'Un núcleo de agente adaptado a los datos, reglas y permisos de cada operación: lee correo y documentos, consulta información bancaria y prepara compras completas en Mercado Libre; las acciones sensibles esperan aprobación humana.',
    table: [
      { label: 'Cliente', value: 'Equipos de operaciones de varias empresas · Finanzas, compras y back office' },
      { label: 'Participación', value: 'Núcleo de agente, integraciones con herramientas, modelo de permisos, flujos de aprobación' },
      { label: 'Alcance', value: 'Correo · documentos · bancos · Mercado Libre · sistemas internos' },
      {
        label: 'Resultados',
        value: 'Un mismo núcleo de agente reutilizado en varias operaciones. Contexto más herramientas producen una acción lista para aprobar; nada sensible se ejecuta sin una persona.',
      },
    ],
    link: { label: 'Agendar una charla', href: brand.bookingUrl },
    pages: [
      {
        label: 'Objetivo',
        heading: 'Donde la IA aporta: contexto, herramientas y una persona que aprueba.',
        paragraphs: [
          'Un agente de IA es útil cuando conoce el contexto del trabajo y puede conectarse con las herramientas correctas. Para distintas operaciones implementamos un núcleo de agente adaptado a sus datos, reglas y permisos.',
          'Puede leer correo y documentos, consultar información bancaria y preparar una compra completa en Mercado Libre.',
        ],
      },
      {
        label: 'Resultados',
        heading: 'Acciones listas para aprobar, controles que siguen en manos de personas',
        paragraphs: [
          'Las acciones sensibles esperan aprobación. El agente prepara la compra, la transferencia o la respuesta; la persona confirma.',
          'La IA participa donde aporta; los controles y las decisiones críticas siguen definidos por personas.',
        ],
      },
    ],
    media: caseMedia('ai-agents-operations'),
    next: 'site-inspection-reports',
  },
  {
    slug: 'site-inspection-reports',
    projectId: 'inspection',
    title: 'De una inspección en obra a un informe listo para revisar',
    summary:
      'Software a medida para una consultora de higiene y seguridad: las fotos de obra se convierten en observaciones, recomendaciones e informes en Word, PDF y web, validados por el técnico antes de entregar.',
    table: [
      { label: 'Cliente', value: 'Consultora de higiene y seguridad · Inspecciones de obra para construcción e industria' },
      { label: 'Participación', value: 'Software a medida, pipeline de imágenes, análisis asistido por IA, generación de documentos' },
      { label: 'Alcance', value: 'Imágenes · revisión técnica · Word · PDF · web' },
      {
        label: 'Resultados',
        value: 'Fotografías de una inspección convertidas en un informe listo para revisar. El profesional valida el análisis antes de entregar el documento.',
      },
    ],
    link: { label: 'Agendar una charla', href: brand.bookingUrl },
    pages: [
      {
        label: 'Objetivo',
        heading: 'Recibir las fotos, organizarlas y preparar el informe.',
        paragraphs: [
          'Para una consultora desarrollamos software que recibe las fotos de obra, las organiza, identifica puntos que el técnico debe revisar y prepara observaciones, recomendaciones e informes.',
        ],
      },
      {
        label: 'Resultados',
        heading: 'El técnico valida, el sistema hace el resto',
        paragraphs: [
          'El profesional revisa los puntos marcados y valida el análisis antes de que el documento salga, en Word, PDF o en la web.',
          'Horas de armado manual se convierten en un paso de revisión.',
        ],
      },
    ],
    media: caseMedia('site-inspection-reports'),
    next: 'english-conversation-app',
  },
  {
    slug: 'english-conversation-app',
    projectId: 'speech',
    title: 'Una conversación en inglés, corregida mientras sucede',
    summary:
      'Una app iOS que transcribe en tiempo real, propone una versión más clara sin cortar la conversación y conserva el audio si la conexión falla.',
    table: [
      { label: 'Cliente', value: 'Producto de aprendizaje de idiomas · iOS' },
      { label: 'Participación', value: 'Diseño de la app, infraestructura, flujo de audio, IA de baja latencia' },
      { label: 'Alcance', value: 'iOS · voz en tiempo real · IA de baja latencia' },
      {
        label: 'Resultados',
        value: 'Hablar con naturalidad y recibir una versión corregida sin frenar. El audio se conserva cuando la conexión falla.',
      },
    ],
    link: { label: 'Agendar una charla', href: brand.bookingUrl },
    pages: [
      {
        label: 'Objetivo',
        heading: 'Hablar con naturalidad y recibir una versión más clara, en vivo.',
        paragraphs: [
          'Un cliente llegó con una idea específica: hablar con naturalidad y recibir una versión corregida sin cortar la conversación.',
          'Diseñamos la app, la infraestructura y el flujo de audio.',
        ],
      },
      {
        label: 'Resultados',
        heading: 'Transcripción en tiempo real que sobrevive a una mala conexión',
        paragraphs: [
          'Transcribe en tiempo real, propone una versión más clara y conserva el audio si la conexión falla.',
          '"I think this process is more slow" se convierte en "I think this process is slower" mientras la conversación sigue.',
        ],
      },
    ],
    media: caseMedia('english-conversation-app'),
    next: 'japon-in-box',
  },
]

export const siteEs: SiteContent = { brand, nav, hero, projects, clients, awards, cta, insights, footer, caseStudies }
export default siteEs
