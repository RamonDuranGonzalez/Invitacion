/**
 * ============================================================
 *  CONFIGURACIÓN PRINCIPAL - INVITACIÓN KAROL & MAURICIO
 *  Edita aquí fácilmente horarios, itinerario, canción,
 *  WhatsApp o textos sin tocar la lógica principal.
 * ============================================================
 */

const WEDDING_CONFIG = {
  // Nombres e iniciales
  coupleNames: "Karol & Mauricio",
  initials: { first: "K", second: "M" },

  // Fecha y hora del evento (formato ISO con zona horaria de México CST -06:00)
  eventDateISO: "2027-01-09T12:00:00-06:00",
  eventEndDateISO: "2027-01-10T00:30:00-06:00",

  // Música de fondo
  // 👉 Para poner "Mi Primer Amor" de Pesado:
  //    1. Copia tu archivo .mp3 dentro de la carpeta: assets/audio/
  //    2. Cambia `src` a: "assets/audio/mi-primer-amor.mp3"
  music: {
    title: "Mi Primer Amor",
    artist: "Grupo Pesado",
    src: "assets/audio/cancion-temporal.wav",
    volume: 0.65,
  },

  // Confirmación por WhatsApp (código de país + 10 dígitos sin espacios)
  whatsapp: {
    phone: "527861079714",
    // Plantilla dinámica: genera el mensaje automático con el nombre y pases del formulario
    buildMessage: (name, guests) => {
      const nombreInvitado = name && name.trim() ? name.trim() : "Invitado(s)";
      const personas = guests || "1 persona";
      return `¡Hola Karol y Mauricio! Confirmo con mucho gusto mi asistencia a su boda el 9 de enero de 2027.\n\n👤 Nombre: ${nombreInvitado}\n👥 Asistencia: ${personas}\n\n¡Ahí nos vemos con botas! 🤠👢`;
    },
    defaultMessage:
      "¡Hola Karol y Mauricio! Confirmo con mucho gusto mi asistencia a su boda el 9 de enero de 2027. ¡Ahí nos vemos con botas!",
  },

  // Ubicaciones
  locations: {
    ceremony: {
      name: "Parroquia de San José",
      time: "12:00 PM",
      mapUrl:
        "https://www.google.com/maps/place/Parroquia+de+San+Jos%C3%A9/@19.6869454,-100.5618225,16.75z/data=!4m6!3m5!1s0x85d2cbb41226497d:0xf58b7c30394ff9d4!8m2!3d19.6898135!4d-100.5567994!16s%2Fg%2F1tggn_98?entry=ttu&g_ep=EgoyMDI2MTExNy4wIKXMDSoASAFQAw%3D%3D",
    },
    reception: {
      name: "Salón Imperial",
      time: "3:00 PM",
      mapUrl:
        "https://www.google.com/maps/place/Imperial+Salon+Jardin/@19.6867108,-100.5311498,18z/data=!4m6!3m5!1s0x85d2c98046657e8d:0x2300a829b507c0a6!8m2!3d19.6846885!4d-100.5279006!16s%2Fg%2F11c2njrqfs?entry=ttu&g_ep=EgoyMDI2MTExNy4wIKXMDSoASAFQAw%3D%3D",
    },
  },

  // ==========================================================
  // ITINERARIO (100% EDITABLE EN CÓDIGO)
  // Puedes cambiar horas, títulos, subtítulos o agregar/quitar
  // bloques. Íconos disponibles:
  // "church", "camera", "rings", "dinner", "music", "car"
  // ==========================================================
  itinerary: [
    {
      time: "12:00 A 1:00 PM",
      title: "CEREMONIA RELIGIOSA",
      subtitle: "Parroquia de San José",
      icon: "church",
    },
    {
      time: "01:30 A 02:30 PM",
      title: "SESIÓN DE FOTOS",
      subtitle: "Recuerdos para siempre",
      icon: "camera",
    },
    {
      time: "03:00 A 03:30 PM",
      title: "BODA CIVIL",
      subtitle: "Salón Imperial",
      icon: "rings",
    },
    {
      time: "03:30 A 05:30 PM",
      title: "COMIDA",
      subtitle: "Brindis y banquete",
      icon: "dinner",
    },
    {
      time: "06:00 A 07:00 PM",
      title: "VALS",
      subtitle: "Nuestro primer baile",
      icon: "music",
    },
    {
      time: "12:30 AM",
      title: "FIN DEL EVENTO",
      subtitle: "¡Gracias por acompañarnos!",
      icon: "car",
    },
  ],

  // Galería de fotos (estilo collage simétrico y armónico sin huecos)
  // - Retratos verticales emparejados de dos en dos ("tall")
  // - Panorámicas destacadas de ancho completo ("wide")
  gallery: [
    // Par 1: Retratos verticales en exterior (Karol y Mauricio)
    { src: "assets/img/foto-portada.jpg", alt: "Karol y Mauricio - Retrato principal", span: "tall" },
    { src: "assets/img/foto-pareja-1.jpg", alt: "Karol y Mauricio en el jardín", span: "tall" },

    // Foto panorámica destacada (ancho completo)
    { src: "assets/img/foto-sobre.jpg", alt: "Karol y Mauricio sonriendo", span: "wide" },

    // Par 2: Retratos verticales (Camioneta & Save the Date)
    { src: "assets/img/foto-camioneta-2.jpg", alt: "Karol y Mauricio 09/01/27", span: "tall" },
    { src: "assets/img/foto-savethedate.jpg", alt: "Save the Date 09/01/27", span: "tall" },

    // Foto panorámica destacada de la camioneta roja
    { src: "assets/img/foto-camioneta-1.jpg", alt: "Karol y Mauricio con camioneta", span: "wide" },

    // Par 3: Dúo artístico en blanco y negro (sonrisa y reflejo)
    { src: "assets/img/foto-bn-sonrisa.jpg", alt: "Retrato en blanco y negro", span: "tall" },
    { src: "assets/img/foto-bn-espejo.jpg", alt: "Reflejo en blanco y negro", span: "tall" },
  ],
};
