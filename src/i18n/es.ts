import type { Dict, Plural } from './types';

const es: Dict = {
  meta: {
    homeTitle: 'Comprimir PDF, JPG, PNG y convertir imágenes online gratis',
    homeDescription:
      'Compresor y conversor de archivos online gratis que funciona en tu navegador. Comprime PDF, JPG, PNG, WebP, convierte HEIC a JPG y más. Sin subidas ni límites.',
    aboutTitle: 'Cómo funciona {site} — todo se procesa en tu navegador',
    aboutDescription:
      'Descubre cómo {site} comprime y convierte archivos por completo en tu navegador con WebAssembly, y por qué tus archivos nunca se suben ni se guardan.',
    notFoundTitle: 'Página no encontrada',
  },
  nav: {
    allTools: 'Todas las herramientas',
    compress: 'Comprimir',
    convert: 'Convertir',
    about: 'Cómo funciona',
    language: 'Idioma',
    skip: 'Saltar al contenido',
  },
  badges: {
    private: 'Tus archivos no salen de tu dispositivo',
    free: 'Gratis, sin registro',
    unlimited: 'Sin límites',
    offline: 'Funciona sin conexión',
  },
  drop: {
    title: 'Suelta los archivos aquí',
    choose: 'Elegir archivos',
    paste: 'o pégalos con Ctrl+V',
    supported: 'Formatos admitidos: {formats}',
    overlay: 'Suelta para añadir archivos',
    addMore: 'Añadir más archivos',
    local: 'Se procesan en tu dispositivo: no se sube nada.',
  },
  settings: {
    title: 'Ajustes',
    quality: 'Calidad',
    qualityHint: 'Menos calidad = archivo más pequeño',
    format: 'Formato de salida',
    keepFormat: 'Mantener original',
    resize: 'Redimensionar (lado mayor)',
    originalSize: 'Tamaño original',
    pngMode: 'Compresión PNG',
    pngLossy: 'Inteligente (hasta un 80% menos)',
    pngLossless: 'Sin pérdida',
    level: 'Nivel de compresión',
    levelLow: 'Ligera',
    levelLowHint: 'Máxima calidad',
    levelMedium: 'Recomendada',
    levelMediumHint: 'Buena calidad, mucho más ligero',
    levelHigh: 'Fuerte',
    levelHighHint: 'Archivo más pequeño',
    grayscale: 'Convertir imágenes a blanco y negro',
    pageSize: 'Tamaño de página',
    pageFit: 'Igual que la imagen',
    margin: 'Añadir márgenes',
    dpi: 'Resolución',
    apply: 'Aplicar a todos los archivos',
    changed: 'Ajustes modificados.',
  },
  status: {
    queued: 'En espera…',
    processing: 'Procesando…',
    ready: 'Listo',
    kept: 'Ya optimizado: se conserva el original',
    errors: {
      unsupported: 'Este tipo de archivo no es compatible aquí',
      encrypted: 'PDF protegido con contraseña: quítale la contraseña primero',
      decode: 'El archivo está dañado o no se puede leer',
      failed: 'No se pudo procesar el archivo (puede ser demasiado grande para este dispositivo)',
    },
  },
  results: {
    download: 'Descargar',
    downloadAll: 'Descargar todo',
    downloadZip: 'Descargar ZIP',
    clear: 'Limpiar',
    remove: 'Quitar',
    compare: 'Comparar',
    before: 'Antes',
    after: 'Después',
    close: 'Cerrar',
    saved: 'Ahorro: {size} ({percent})',
    createPdf: 'Crear PDF',
    creating: 'Creando PDF…',
    pdfReady: 'Tu PDF está listo',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    page: 'Página {n}',
    files: { one: '{n} archivo', other: '{n} archivos' } as Plural,
    pages: { one: '{n} página', other: '{n} páginas' } as Plural,
    images: { one: '{n} imagen', other: '{n} imágenes' } as Plural,
  },
  home: {
    h1: 'Comprimir y convertir archivos online — en privado, en tu navegador',
    subtitle:
      'PDF, JPG, PNG, WebP, AVIF y HEIC. Gratis, sin límites y tus archivos nunca salen de tu dispositivo.',
    compressTitle: 'Comprimir archivos',
    convertTitle: 'Convertir archivos',
  },
  how: {
    title: '{tool} en 3 sencillos pasos',
    steps: [
      'Añade tus archivos: arrástralos, elígelos desde tu dispositivo o pégalos desde el portapapeles.',
      'El procesamiento empieza al instante en tu dispositivo. Cambia los ajustes si quieres otro equilibrio entre tamaño y calidad.',
      'Descarga cada archivo por separado o todos a la vez en un archivo ZIP.',
    ],
  },
  why: {
    title: '¿Por qué {site}?',
    items: [
      {
        title: 'Privado por diseño',
        text: 'Los archivos se procesan en tu dispositivo con WebAssembly. Nunca se suben ni se guardan, y nadie los ve, ni siquiera nosotros.',
      },
      {
        title: 'Gratis y sin límites',
        text: 'Sin registro, sin marcas de agua, sin cuotas diarias y sin límite de archivos. Procesa todo lo que tu dispositivo aguante.',
      },
      {
        title: 'La mejor compresión',
        text: 'Con la tecnología de MozJPEG, oxipng, libwebp y libavif: codificadores de código abierto en los que confían Google y Mozilla.',
      },
      {
        title: 'Procesamiento por lotes rápido',
        text: 'Los archivos se procesan en paralelo en todos los núcleos del procesador, sin esperar subidas ni descargas, incluso si son cientos.',
      },
      {
        title: 'Funciona sin conexión',
        text: 'Después de la primera visita, el sitio funciona sin conexión a internet. Instálalo como app en tu teléfono o en tu PC.',
      },
      {
        title: 'Sin anuncios ni rastreo',
        text: 'Sin cookies, sin rastreadores y sin anuncios. Una política de seguridad de contenido (CSP) estricta impide que la página envíe tus datos a ningún sitio.',
      },
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Se suben mis archivos a un servidor?',
        a: 'No. {site} procesa los archivos por completo en tu navegador con WebAssembly. Tus archivos nunca salen de tu dispositivo, así que no hay nada que guardar, filtrar ni borrar. Incluso puedes desconectarte de internet una vez cargada la página.',
      },
      {
        q: '¿La herramienta {tool} es realmente gratis? ¿Tiene límites?',
        a: 'Sí. Es totalmente gratis, sin registro, sin marcas de agua y sin límite de archivos. El único límite es la memoria de tu dispositivo: los archivos muy grandes (cientos de MB) pueden no funcionar en teléfonos antiguos.',
      },
      {
        q: '¿Perderé calidad?',
        a: 'Los ajustes predeterminados están pensados para que los archivos se vean idénticos al original y ocupen mucho menos. Puedes subir la calidad o elegir el modo sin pérdida en cualquier momento. Si un archivo no se puede reducir, se conserva el original en lugar de generar uno peor.',
      },
      {
        q: '¿Qué dispositivos y navegadores son compatibles?',
        a: 'Cualquier navegador moderno: Chrome, Edge, Firefox, Safari y Opera en Windows, macOS, Linux, Android e iOS. No hace falta instalar nada, pero puedes añadir {site} a tu pantalla de inicio para usarlo sin conexión.',
      },
      {
        q: '¿Se eliminan los metadatos personales de las fotos?',
        a: 'Sí. Al recodificar las imágenes se eliminan metadatos como la ubicación GPS, el modelo de la cámara y la fecha y hora. La orientación se aplica a los píxeles, así que las fotos se siguen viendo en la posición correcta.',
      },
      {
        q: '¿Por qué un archivo no reduce su tamaño?',
        a: 'Algunos archivos ya están bien optimizados. En ese caso se conserva el original en lugar de generar un archivo más grande. En los PDF, la mayor parte del ahorro viene de las imágenes: los PDF que solo contienen texto ya suelen ser compactos.',
      },
    ],
  },
  sections: {
    formats: 'Sobre los formatos',
    related: 'Herramientas relacionadas',
  },
  tools: {
    'compress-pdf': {
      name: 'Comprimir PDF',
      title: 'Comprimir PDF online — reducir tamaño de PDF gratis, sin subirlo',
      description:
        'Reduce el tamaño de tus PDF hasta un 90% en el navegador. Gratis, sin registro y sin límites: tus PDF nunca se suben a ningún servidor.',
      intro:
        'Haz tus PDF lo bastante ligeros para enviarlos por correo, formularios online o portales de empleo. Las imágenes del PDF se recomprimen con MozJPEG, se eliminan los datos sin usar y se reorganiza la estructura del archivo. El texto sigue nítido y seleccionable.',
      card: 'PDF ligeros para correo y formularios',
    },
    'compress-image': {
      name: 'Comprimir imágenes',
      title: 'Comprimir imágenes JPG, PNG, WebP y AVIF online gratis',
      description:
        'Comprime imágenes JPG, PNG, WebP y AVIF hasta un 80% sin pérdida visible de calidad. Procesamiento por lotes en tu navegador, sin subidas ni límites.',
      intro:
        'Arrastra una carpeta entera de fotos o capturas de pantalla. Cada imagen se optimiza con los mejores codificadores de código abierto (MozJPEG, oxipng con reducción inteligente de paleta, libwebp y libavif) y puedes redimensionarla o cambiar el formato al momento.',
      card: 'JPG, PNG, WebP y AVIF juntos',
    },
    'compress-jpg': {
      name: 'Comprimir JPG',
      title: 'Comprimir JPG — reducir el peso de fotos JPEG online gratis',
      description:
        'Reduce tus fotos JPG/JPEG hasta un 80% con MozJPEG directamente en el navegador. Sin subidas, sin registro y sin marca de agua. Cientos de fotos a la vez.',
      intro:
        'Las fotos de teléfonos y cámaras suelen pesar entre 3 y 10 MB. MozJPEG las recodifica con una cuantización más inteligente y escaneo progresivo, y normalmente reduce su tamaño un 60–80% sin diferencia visible. Por privacidad, se eliminan la ubicación y los datos de la cámara.',
      card: 'Fotos más ligeras, mismo aspecto',
    },
    'compress-png': {
      name: 'Comprimir PNG',
      title: 'Comprimir PNG online — reducir PNG hasta un 80% gratis',
      description:
        'Reduce el tamaño de tus PNG hasta un 80% con una reducción inteligente de colores, manteniendo la transparencia. Con modo sin pérdida. Sin subir nada.',
      intro:
        'El modo inteligente convierte la imagen a una paleta optimizada de hasta 256 colores con un tramado cuidadoso y luego oxipng la comprime al máximo. La transparencia se conserva. ¿Necesitas un resultado idéntico píxel a píxel? Cambia al modo sin pérdida.',
      card: 'Imágenes transparentes, mucho más ligeras',
    },
    'compress-webp': {
      name: 'Comprimir WebP',
      title: 'Comprimir WebP online — gratis, privado y sin subir archivos',
      description:
        'Reduce el tamaño de tus imágenes WebP con libwebp en el navegador. Calidad ajustable, redimensionado y procesamiento por lotes. Sin subidas ni límites.',
      intro:
        'WebP ya es eficiente, pero las imágenes exportadas a máxima calidad o directamente desde herramientas de diseño suelen poder reducirse otro 30–60% sin ningún cambio visible. Elige un nivel de calidad, redimensiona si hace falta y descarga.',
      card: 'WebP más ligero, webs más rápidas',
    },
    'jpg-to-pdf': {
      name: 'JPG a PDF',
      title: 'Convertir JPG a PDF — unir imágenes en un solo PDF gratis',
      description:
        'Convierte imágenes JPG, PNG, HEIC y WebP en un solo PDF desde tu navegador. Reordena las páginas y elige A4 o Letter. Sin subidas ni marca de agua.',
      intro:
        'Convierte fotos de documentos, recibos o escaneos en un único PDF ordenado. Las imágenes JPEG se insertan sin recomprimir, así que no se pierde calidad. Ordena las páginas, elige un tamaño de página y descarga.',
      card: 'Une tus fotos en un PDF',
    },
    'pdf-to-jpg': {
      name: 'PDF a JPG',
      title: 'Convertir PDF a JPG online — páginas de PDF a imágenes gratis',
      description:
        'Convierte cada página de un PDF en imágenes JPG de alta calidad desde tu navegador. Elige una resolución de hasta 300 DPI. Sin subidas ni límites.',
      intro:
        'Cada página se renderiza con pdf.js (el motor del visor de PDF de Firefox) a la resolución que elijas y se guarda como JPG. Descarga las páginas una a una o todas juntas en un ZIP.',
      card: 'Cada página, una imagen',
    },
    'pdf-to-png': {
      name: 'PDF a PNG',
      title: 'Convertir PDF a PNG online — páginas de PDF a PNG gratis',
      description:
        'Convierte páginas de PDF en imágenes PNG sin pérdida directamente en el navegador. Texto nítido, hasta 300 DPI y todo en un ZIP. Sin subidas.',
      intro:
        'PNG mantiene el texto y los trazos perfectamente nítidos, por eso es ideal para diapositivas, diagramas y documentos que quieras editar o anotar. Las páginas se renderizan localmente con pdf.js.',
      card: 'Páginas como imágenes sin pérdida',
    },
  },
  converter: {
    name: '{from} a {to}',
    title: 'Convertir {from} a {to} — conversor online gratis, sin subidas',
    description:
      'Convierte imágenes {from} a {to} en segundos, en tu navegador. Conversión por lotes, calidad ajustable y sin registro: tus archivos no salen de tu dispositivo.',
    intro:
      'Añade tantos archivos {from} como quieras: se decodifican y se recodifican a {to} en tu dispositivo con rápidos códecs WebAssembly. No se sube nada, así que es seguro incluso para fotos y documentos privados.',
    card: 'Convierte imágenes {from} a {to}',
  },
  formats: {
    jpg: 'JPG (JPEG) es el formato de foto más compatible. Su compresión con pérdida es ideal para fotografías, pero no admite transparencia y puede desenfocar el texto nítido.',
    png: 'PNG es un formato sin pérdida que admite transparencia. Es perfecto para capturas de pantalla, logotipos y gráficos, pero las fotos guardadas en PNG suelen ocupar muchísimo.',
    webp: 'WebP es un formato moderno de Google que suele ocupar un 25–35% menos que JPG con la misma calidad y admite transparencia. Todos los navegadores actuales lo muestran.',
    avif: 'AVIF es un formato de nueva generación basado en el códec de video AV1. A menudo genera archivos alrededor de un 50% más pequeños que JPG con una calidad similar y es compatible con todos los navegadores actuales.',
    heic: 'HEIC (HEIF) es el formato de foto predeterminado en iPhone y iPad. Es compacto, pero tiene poca compatibilidad en Windows, Android y sitios web, así que convertirlo a JPG facilita compartir las fotos.',
    pdf: 'PDF es el formato universal de documentos: se ve igual en cualquier dispositivo. Los documentos escaneados y los PDF con fotos suelen ocupar mucho más de lo necesario.',
  },
  about: {
    h1: 'Cómo funciona {site}',
    sections: [
      {
        h: 'Tus archivos nunca salen de tu dispositivo',
        p: 'La mayoría de los conversores online suben tus archivos a sus servidores, los procesan allí y guardan copias durante horas o días. {site} funciona de otra manera: el sitio envía el software de compresión a tu navegador y todo el procesamiento ocurre localmente en tu equipo o teléfono. El servidor solo aloja archivos estáticos y nunca recibe tus documentos.',
      },
      {
        h: '¿Cómo puedes comprobarlo?',
        p: 'Abre las herramientas para desarrolladores de tu navegador y observa la pestaña Red (Network) mientras se procesa un archivo: no se hace ninguna solicitud de subida. También puedes desconectarte de internet después de cargar la página y todo sigue funcionando. Además, una política de seguridad de contenido (CSP) estricta impide que la página envíe datos a cualquier otro sitio web.',
      },
      {
        h: 'La tecnología',
        p: 'Las imágenes se codifican con versiones en WebAssembly de MozJPEG, oxipng, libwebp y libavif. Los PNG se reducen con una paleta adaptativa y tramado. Los PDF se optimizan con pdf-lib: las imágenes incrustadas se recomprimen, se eliminan los objetos sin usar y se reorganiza la estructura. Las páginas de los PDF se renderizan con pdf.js y las fotos HEIC se decodifican con libheif.',
      },
      {
        h: 'Privacidad',
        p: 'No hay cookies, rastreadores de analítica, anuncios ni cuentas. Como los archivos nunca se suben, no tenemos acceso a ellos ni nada que borrar. Los ajustes que elijas solo se guardan en tu propio navegador.',
      },
      {
        h: 'Gratis para siempre',
        p: 'Como el trabajo lo hace tu dispositivo, mantener {site} no cuesta casi nada. Por eso puede seguir siendo gratis, sin límites, sin marcas de agua y sin versiones de pago.',
      },
    ],
  },
  footer: {
    tagline: 'Compresión y conversión de archivos gratis y privada. Todo funciona en tu navegador.',
    tools: 'Herramientas',
    languages: 'Idiomas',
    privacy: 'Sin subidas · Sin cookies · Sin rastreo',
  },
  notFound: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o se ha movido.',
    back: 'Volver al inicio',
  },
  compat: {
    outdated:
      'Tu navegador es demasiado antiguo para procesar archivos en tu dispositivo. Actualízalo o abre esta página en una versión reciente de Chrome, Safari, Firefox o Edge.',
    noWasm:
      'WebAssembly está desactivado en tu navegador (por ejemplo, por el modo de aislamiento del iPhone) y es necesario para procesar archivos en tu dispositivo. Añade este sitio como excepción o usa otro navegador.',
  },
  langBanner: {
    text: 'Esta página está disponible en español.',
    action: 'Cambiar',
    dismiss: 'Cerrar',
  },
};

export default es;
