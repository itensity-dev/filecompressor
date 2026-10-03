import type { Dict, Plural } from './types';

const fr: Dict = {
  meta: {
    homeTitle: 'Compresser PDF, JPG, PNG et convertir des images – gratuit',
    homeDescription:
      'Compressez vos PDF, JPG, PNG et WebP, convertissez HEIC en JPG, gratuitement et directement dans votre navigateur. Aucun fichier envoyé, aucune limite.',
    aboutTitle: 'Comment fonctionne {site} – traitement 100 % local',
    aboutDescription:
      'Découvrez comment {site} compresse et convertit vos fichiers dans votre navigateur grâce à WebAssembly, sans jamais les envoyer ni les stocker.',
    notFoundTitle: 'Page introuvable',
  },
  nav: {
    allTools: 'Tous les outils',
    compress: 'Compresser',
    convert: 'Convertir',
    about: 'Comment ça marche',
    language: 'Langue',
    skip: 'Aller au contenu',
    theme: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeSystem: 'Auto',
  },
  badges: {
    private: 'Vos fichiers restent sur votre appareil',
    free: 'Gratuit, sans inscription',
    unlimited: 'Sans limite',
    offline: 'Fonctionne hors ligne',
  },
  drop: {
    title: 'Déposez vos fichiers ici',
    choose: 'Choisir des fichiers',
    paste: 'ou collez-les avec Ctrl+V',
    supported: 'Formats pris en charge : {formats}',
    overlay: 'Déposez pour ajouter les fichiers',
    addMore: 'Ajouter des fichiers',
    local: 'Traitement sur cet appareil. Aucun fichier n’est envoyé.',
  },
  settings: {
    title: 'Paramètres',
    convertTo: 'Convertir en',
    quality: 'Qualité',
    qualityHint: 'Qualité plus basse = fichier plus léger',
    format: 'Format de sortie',
    keepFormat: 'Format d’origine',
    resize: 'Redimensionner (côté le plus long)',
    originalSize: 'Taille d’origine',
    pngMode: 'Compression PNG',
    pngLossy: 'Intelligente (jusqu’à 80 % plus léger)',
    pngLossless: 'Sans perte',
    level: 'Niveau de compression',
    levelLow: 'Légère',
    levelLowHint: 'Meilleure qualité',
    levelMedium: 'Recommandée',
    levelMediumHint: 'Bonne qualité, bien plus léger',
    levelHigh: 'Forte',
    levelHighHint: 'Fichier le plus léger',
    grayscale: 'Convertir les images en noir et blanc',
    pageSize: 'Format de page',
    pageFit: 'Identique à l’image',
    margin: 'Ajouter des marges',
    dpi: 'Résolution',
    apply: 'Appliquer à tous les fichiers',
    changed: 'Paramètres modifiés.',
  },
  status: {
    queued: 'En attente…',
    processing: 'Traitement en cours…',
    ready: 'Terminé',
    kept: 'Déjà optimisé, original conservé',
    errors: {
      unsupported: 'Ce type de fichier n’est pas pris en charge ici',
      encrypted: 'PDF protégé par mot de passe. Retirez d’abord le mot de passe.',
      decode: 'Le fichier est endommagé ou illisible',
      failed: 'Impossible de traiter ce fichier (il est peut-être trop lourd pour cet appareil)',
    },
  },
  results: {
    download: 'Télécharger',
    downloadAll: 'Tout télécharger',
    downloadZip: 'Télécharger le ZIP',
    clear: 'Tout effacer',
    remove: 'Retirer',
    compare: 'Comparer',
    before: 'Avant',
    after: 'Après',
    close: 'Fermer',
    saved: 'Gain : {size} ({percent})',
    createPdf: 'Créer le PDF',
    creating: 'Création du PDF…',
    pdfReady: 'Votre PDF est prêt',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    page: 'Page {n}',
    files: { one: '{n} fichier', other: '{n} fichiers' } as Plural,
    pages: { one: '{n} page', other: '{n} pages' } as Plural,
    images: { one: '{n} image', other: '{n} images' } as Plural,
  },
  home: {
    h1: 'Compresser et convertir des fichiers sans les envoyer en ligne',
    subtitle:
      'PDF, JPG, PNG, WebP, AVIF et HEIC. Tout se passe dans votre navigateur, vos fichiers restent donc sur votre ordinateur ou votre téléphone.',
    compressTitle: 'Compresser',
    convertTitle: 'Convertir',
    convertHint: 'Repérez à gauche le format que vous avez, et en haut celui dont vous avez besoin.',
    matrixFrom: 'De',
    matrixTo: 'Vers',
  },
  how: {
    title: '{tool} : comment faire en 3 étapes',
    steps: [
      'Ajoutez vos fichiers : glissez-déposez-les, sélectionnez-les sur votre appareil ou collez-les depuis le presse-papiers.',
      'Le traitement démarre aussitôt sur votre appareil. Ajustez les paramètres si vous souhaitez un autre équilibre entre taille et qualité.',
      'Téléchargez chaque fichier séparément, ou tous d’un coup dans une archive ZIP.',
    ],
  },
  why: {
    title: 'Comment ça marche',
    items: [
      {
        title: 'Rien n’est envoyé',
        text: 'À l’ouverture de la page, le code de compression est chargé dans votre navigateur. Les fichiers sont lus, traités et enregistrés sur votre appareil, sans jamais être envoyés ailleurs.',
      },
      {
        title: 'Ni compte ni limite',
        text: 'Pas d’inscription, pas de filigrane, pas de quota quotidien. La seule limite est la mémoire de votre appareil.',
      },
      {
        title: 'Des encodeurs open source éprouvés',
        text: 'MozJPEG, oxipng, libwebp, libavif, pdf-lib et pdf.js, compilés en WebAssembly et exécutés sur tous les cœurs du processeur.',
      },
      {
        title: 'Fonctionne hors ligne',
        text: 'Une fois chargé, un outil continue de fonctionner sans connexion. Vous pouvez aussi installer le site comme une application.',
      },
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        q: 'Mes fichiers sont-ils envoyés sur un serveur ?',
        a: 'Non. {site} traite les fichiers entièrement dans votre navigateur grâce à WebAssembly. Vos fichiers ne quittent jamais votre appareil : il n’y a donc rien à stocker, rien qui puisse fuiter et rien à supprimer. Vous pouvez même vous déconnecter d’Internet une fois la page chargée.',
      },
      {
        q: 'L’outil « {tool} » est-il vraiment gratuit ? Y a-t-il des limites ?',
        a: 'Oui. Il est entièrement gratuit, sans inscription, sans filigrane et sans limite sur le nombre de fichiers. La seule limite est la mémoire de votre appareil : les très gros fichiers (plusieurs centaines de Mo) peuvent ne pas passer sur les téléphones anciens.',
      },
      {
        q: 'Vais-je perdre en qualité ?',
        a: 'Les réglages par défaut sont conçus pour que les fichiers restent visuellement identiques à l’original tout en étant beaucoup plus légers. Vous pouvez à tout moment augmenter la qualité ou choisir le mode sans perte. Si un fichier ne peut pas être allégé, l’original est conservé plutôt que de produire un résultat moins bon.',
      },
      {
        q: 'Quels appareils et navigateurs sont pris en charge ?',
        a: 'Tous les navigateurs récents : Chrome, Edge, Firefox, Safari et Opera sous Windows, macOS, Linux, Android et iOS. Rien à installer, mais vous pouvez ajouter {site} à votre écran d’accueil pour l’utiliser hors ligne.',
      },
      {
        q: 'Les métadonnées personnelles sont-elles supprimées des photos ?',
        a: 'Oui. Lors du réencodage des images, les métadonnées comme la position GPS, le modèle d’appareil photo et la date de prise de vue sont supprimées. L’orientation est appliquée directement aux pixels : les photos s’affichent donc toujours dans le bon sens.',
      },
      {
        q: 'Pourquoi un fichier n’a-t-il pas été réduit ?',
        a: 'Certains fichiers sont déjà bien optimisés. Dans ce cas, l’original est conservé plutôt que de produire un fichier plus lourd. Pour les PDF, l’essentiel du gain vient des images – les PDF qui ne contiennent que du texte sont généralement déjà compacts.',
      },
    ],
  },
  sections: {
    formats: 'À propos des formats',
    related: 'Outils similaires',
  },
  tools: {
    'compress-pdf': {
      name: 'Compresser PDF',
      title: 'Compresser PDF – réduire la taille d’un PDF gratuitement',
      description:
        'Réduisez la taille de vos PDF jusqu’à 90 % directement dans votre navigateur. Gratuit, sans inscription, sans limite : vos PDF ne sont jamais envoyés.',
      intro:
        'Allégez vos PDF pour les envoyer par e-mail, via des formulaires en ligne ou sur des sites de recrutement. Les images du PDF sont recompressées avec MozJPEG, les données inutiles supprimées et la structure du fichier réorganisée – le texte reste net et sélectionnable.',
      card: 'PDF allégés pour e-mail et formulaires',
    },
    'compress-image': {
      name: 'Compresser des images',
      title: 'Compresser une image – JPG, PNG, WebP, AVIF en ligne, gratuit',
      description:
        'Compressez vos images JPG, PNG, WebP et AVIF jusqu’à 80 % sans perte de qualité visible. Traitement par lots dans le navigateur, sans envoi ni limite.',
      intro:
        'Déposez un dossier entier de photos ou de captures d’écran. Chaque image est optimisée avec les meilleurs encodeurs open source – MozJPEG, oxipng avec réduction de palette intelligente, libwebp et libavif – et vous pouvez la redimensionner ou changer de format à la volée.',
      card: 'JPG, PNG, WebP et AVIF réunis',
    },
    'compress-jpg': {
      name: 'Compresser JPG',
      title: 'Compresser JPG – réduire la taille d’un JPEG en ligne, gratuit',
      description:
        'Allégez vos photos JPG/JPEG jusqu’à 80 % avec MozJPEG, dans votre navigateur. Sans envoi, sans inscription, sans filigrane. Des centaines de photos à la fois.',
      intro:
        'Les photos de smartphones et d’appareils photo pèsent souvent de 3 à 10 Mo. MozJPEG les réencode avec une quantification plus fine et un balayage progressif, ce qui réduit généralement leur taille de 60 à 80 % sans différence visible. Les données de localisation et d’appareil sont supprimées pour protéger votre vie privée.',
      card: 'Photos plus légères, même rendu',
    },
    'compress-png': {
      name: 'Compresser PNG',
      title: 'Compresser PNG – réduire vos PNG jusqu’à 80 %, gratuit',
      description:
        'Réduisez vos PNG jusqu’à 80 % grâce à une réduction intelligente des couleurs, transparence préservée. Mode sans perte disponible. Sans envoi de fichiers.',
      intro:
        'Le mode intelligent convertit l’image en une palette optimisée de 256 couleurs maximum avec un tramage soigné, puis oxipng la compresse au maximum. La transparence est préservée. Besoin d’un résultat identique au pixel près ? Passez en mode sans perte.',
      card: 'Images transparentes, bien plus légères',
    },
    'compress-webp': {
      name: 'Compresser WebP',
      title: 'Compresser des images WebP en ligne – gratuit et privé',
      description:
        'Réduisez la taille de vos images WebP avec libwebp, dans votre navigateur. Qualité réglable, redimensionnement, traitement par lots. Sans envoi ni limite.',
      intro:
        'Le WebP est déjà efficace, mais les images exportées en qualité maximale ou directement depuis des outils de design peuvent généralement perdre encore 30 à 60 % sans changement visible. Choisissez un niveau de qualité, redimensionnez si besoin et téléchargez.',
      card: 'WebP plus légers, sites plus rapides',
    },
    'image-converter': {
      name: 'Convertisseur d’images',
      title: 'Convertisseur d’images – JPG, PNG, WebP, AVIF, HEIC, gratuit',
      description:
        'Convertissez vos images entre JPG, PNG, WebP et AVIF, et ouvrez les photos HEIC de l’iPhone. Conversion par lots dans le navigateur, sans envoi.',
      intro:
        'Déposez des images dans n’importe quel format pris en charge et choisissez le format voulu. Vous pouvez en changer à tout moment, les fichiers sont aussitôt reconvertis.',
      card: 'Toute image en JPG, PNG, WebP ou AVIF',
    },
    'jpg-to-pdf': {
      name: 'JPG en PDF',
      title: 'JPG en PDF – fusionner des images en un seul PDF, gratuit',
      description:
        'Convertissez vos images JPG, PNG, HEIC et WebP en un seul PDF dans votre navigateur. Réorganisez les pages, choisissez A4 ou Letter. Sans envoi, sans filigrane.',
      intro:
        'Transformez des photos de documents, de reçus ou de scans en un PDF propre et bien ordonné. Les images JPEG sont intégrées sans recompression, donc sans aucune perte de qualité. Choisissez l’ordre et le format de page, puis téléchargez.',
      card: 'Réunissez vos photos en un PDF',
    },
    'pdf-to-jpg': {
      name: 'PDF en JPG',
      title: 'PDF en JPG – convertir les pages d’un PDF en images, gratuit',
      description:
        'Convertissez chaque page d’un PDF en images JPG de haute qualité dans votre navigateur. Résolution jusqu’à 300 DPI. Sans envoi, sans limite.',
      intro:
        'Chaque page est rendue avec pdf.js – le moteur du lecteur PDF de Firefox – à la résolution de votre choix, puis enregistrée en JPG. Téléchargez les pages une par une ou toutes ensemble dans un ZIP.',
      card: 'Chaque page en image',
    },
    'pdf-to-png': {
      name: 'PDF en PNG',
      title: 'PDF en PNG – convertir les pages d’un PDF en PNG, gratuit',
      description:
        'Convertissez les pages d’un PDF en images PNG sans perte, directement dans votre navigateur. Texte net, jusqu’à 300 DPI, export en ZIP. Sans envoi.',
      intro:
        'Le PNG garde le texte et les tracés parfaitement nets : idéal pour les diapositives, les schémas et les documents que vous souhaitez modifier ou annoter. Les pages sont rendues localement avec pdf.js.',
      card: 'Des pages en images sans perte',
    },
  },
  toPdf: {
    name: '{from} en PDF',
    title: 'Convertir {from} en PDF – gratuit et sans envoi',
    description:
      'Transformez vos images {from} en PDF dans votre navigateur. Réunissez plusieurs images en un seul document, en pages A4 ou Letter. Rien n’est envoyé.',
    intro:
      'Ajoutez un ou plusieurs fichiers {from}, placez-les dans le bon ordre et créez un seul PDF. Tout se passe sur votre appareil, vous pouvez donc l’utiliser sans crainte pour des scans de documents ou de reçus.',
    card: 'Vos images {from} en un seul PDF',
  },
  converter: {
    name: '{from} en {to}',
    title: 'Convertir {from} en {to} – convertisseur gratuit, sans envoi',
    description:
      'Convertissez vos images {from} en {to} en quelques secondes, dans votre navigateur. Conversion par lots, qualité réglable, sans inscription : tout reste chez vous.',
    intro:
      'Ajoutez autant de fichiers {from} que vous le souhaitez : ils sont décodés puis réencodés en {to} sur votre appareil grâce à des codecs WebAssembly rapides. Rien n’est envoyé, c’est donc sans risque même pour vos photos et documents privés.',
    card: 'Convertir des images {from} en {to}',
  },
  formats: {
    jpg: 'Le JPG (JPEG) est le format photo le plus répandu. Sa compression avec perte est idéale pour les photographies, mais il ne gère pas la transparence et peut rendre flou un texte net.',
    png: 'Le PNG est un format sans perte qui gère la transparence. Il est parfait pour les captures d’écran, les logos et les graphismes, mais les photos enregistrées en PNG sont généralement très lourdes.',
    webp: 'Le WebP est un format moderne créé par Google, généralement 25 à 35 % plus léger que le JPG à qualité égale, et compatible avec la transparence. Tous les navigateurs actuels savent l’afficher.',
    avif: 'L’AVIF est un format de nouvelle génération basé sur le codec vidéo AV1. Il produit souvent des fichiers environ 50 % plus légers que le JPG à qualité comparable et il est pris en charge par tous les navigateurs actuels.',
    heic: 'Le HEIC (HEIF) est le format photo par défaut de l’iPhone et de l’iPad. Compact, il est pourtant mal pris en charge sous Windows, sous Android et sur le Web : le convertir en JPG permet de partager vos photos facilement.',
    pdf: 'Le PDF est le format de document universel : il s’affiche de la même façon sur tous les appareils. Les documents scannés et les PDF contenant des photos sont souvent bien plus lourds que nécessaire.',
  },
  about: {
    h1: 'Comment fonctionne {site}',
    sections: [
      {
        h: 'Vos fichiers ne quittent jamais votre appareil',
        p: 'La plupart des convertisseurs en ligne envoient vos fichiers sur leurs serveurs, les y traitent et en conservent des copies pendant des heures, voire des jours. {site} fonctionne autrement : le site transmet le logiciel de compression à votre navigateur, et tout le traitement se fait localement sur votre ordinateur ou votre téléphone. Le serveur héberge uniquement des fichiers statiques et ne reçoit jamais vos documents.',
      },
      {
        h: 'Comment le vérifier ?',
        p: 'Ouvrez les outils de développement de votre navigateur et observez l’onglet « Réseau » pendant le traitement d’un fichier : aucune requête d’envoi n’est effectuée. Vous pouvez aussi vous déconnecter d’Internet une fois la page chargée – tout continue de fonctionner. En outre, une Content Security Policy stricte empêche la page d’envoyer des données vers un autre site.',
      },
      {
        h: 'La technologie',
        p: 'Les images sont encodées avec des versions WebAssembly de MozJPEG, oxipng, libwebp et libavif. Les fichiers PNG sont allégés grâce à une palette adaptative et au tramage. Les PDF sont optimisés avec pdf-lib : les images intégrées sont recompressées, les objets inutilisés supprimés et la structure réorganisée. Les pages PDF sont rendues avec pdf.js, et les photos HEIC décodées avec libheif.',
      },
      {
        h: 'Confidentialité',
        p: 'Pas de cookies, pas de traceurs d’audience, pas de publicité, pas de compte. Comme les fichiers ne sont jamais envoyés, nous n’y avons pas accès et n’avons rien à supprimer. Les paramètres que vous choisissez sont mémorisés uniquement dans votre propre navigateur.',
      },
      {
        h: 'Gratuit pour de bon',
        p: 'Comme c’est votre appareil qui fait le travail, faire fonctionner {site} ne coûte presque rien. C’est pourquoi le service peut rester gratuit, sans limite, sans filigrane et sans offre payante à vous vendre.',
      },
    ],
  },
  footer: {
    tagline: 'Compression et conversion de fichiers, gratuites et privées. Tout se passe dans votre navigateur.',
    tools: 'Outils',
    languages: 'Langues',
    privacy: 'Aucun envoi · Aucun cookie · Aucun pistage',
  },
  notFound: {
    title: 'Page introuvable',
    text: 'La page que vous recherchez n’existe pas ou a été déplacée.',
    back: 'Retour à l’accueil',
  },
  compat: {
    outdated:
      'Votre navigateur est trop ancien pour traiter des fichiers sur votre appareil. Mettez-le à jour ou ouvrez cette page dans une version récente de Chrome, Safari, Firefox ou Edge.',
    noWasm:
      'WebAssembly est désactivé dans votre navigateur (par exemple par le mode Isolement de l’iPhone), alors qu’il est nécessaire pour traiter les fichiers sur votre appareil. Ajoutez ce site aux exceptions ou utilisez un autre navigateur.',
  },
  langBanner: {
    text: 'Cette page est disponible en français.',
    action: 'Changer',
    dismiss: 'Fermer',
  },
};

export default fr;
