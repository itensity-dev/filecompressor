import type { Dict, Plural } from './types';

const de: Dict = {
  meta: {
    homeTitle: 'PDF verkleinern, Bilder komprimieren & umwandeln – kostenlos',
    homeDescription:
      'PDF verkleinern, JPG, PNG und WebP komprimieren, HEIC in JPG umwandeln – kostenlos direkt im Browser. Ohne Upload, ohne Anmeldung, ohne Limits.',
    aboutTitle: 'So funktioniert {site} – privat und lokal im Browser',
    aboutDescription:
      'Erfahren Sie, wie {site} Dateien mit WebAssembly direkt im Browser komprimiert und umwandelt – und warum sie nie hochgeladen oder gespeichert werden.',
    notFoundTitle: 'Seite nicht gefunden',
  },
  nav: {
    allTools: 'Alle Tools',
    compress: 'Komprimieren',
    convert: 'Umwandeln',
    about: 'So funktioniert’s',
    language: 'Sprache',
    skip: 'Zum Inhalt springen',
  },
  badges: {
    private: 'Dateien verlassen nie Ihr Gerät',
    free: 'Kostenlos, ohne Anmeldung',
    unlimited: 'Ohne Limits',
    offline: 'Funktioniert offline',
  },
  drop: {
    title: 'Dateien hier ablegen',
    choose: 'Dateien auswählen',
    paste: 'oder mit Strg+V einfügen',
    supported: 'Unterstützt: {formats}',
    overlay: 'Loslassen, um Dateien hinzuzufügen',
    addMore: 'Weitere Dateien hinzufügen',
    local: 'Verarbeitung auf Ihrem Gerät – nichts wird hochgeladen.',
  },
  settings: {
    title: 'Einstellungen',
    quality: 'Qualität',
    qualityHint: 'Geringere Qualität = kleinere Datei',
    format: 'Ausgabeformat',
    keepFormat: 'Original beibehalten',
    resize: 'Größe ändern (längste Seite)',
    originalSize: 'Originalgröße',
    pngMode: 'PNG-Komprimierung',
    pngLossy: 'Smart (bis zu 80 % kleiner)',
    pngLossless: 'Verlustfrei',
    level: 'Komprimierungsstufe',
    levelLow: 'Leicht',
    levelLowHint: 'Beste Qualität',
    levelMedium: 'Empfohlen',
    levelMediumHint: 'Gute Qualität, viel kleiner',
    levelHigh: 'Stark',
    levelHighHint: 'Kleinste Datei',
    grayscale: 'Bilder in Schwarzweiß umwandeln',
    pageSize: 'Seitengröße',
    pageFit: 'An Bild anpassen',
    margin: 'Seitenränder hinzufügen',
    dpi: 'Auflösung',
    apply: 'Auf alle Dateien anwenden',
    changed: 'Einstellungen geändert.',
  },
  status: {
    queued: 'Wartet…',
    processing: 'Wird verarbeitet…',
    ready: 'Fertig',
    kept: 'Bereits optimiert – Original beibehalten',
    errors: {
      unsupported: 'Dieser Dateityp wird hier nicht unterstützt',
      encrypted: 'Passwortgeschütztes PDF – bitte zuerst das Passwort entfernen',
      decode: 'Die Datei ist beschädigt oder kann nicht gelesen werden',
      failed: 'Datei konnte nicht verarbeitet werden (evtl. zu groß für dieses Gerät)',
    },
  },
  results: {
    download: 'Herunterladen',
    downloadAll: 'Alle herunterladen',
    downloadZip: 'ZIP herunterladen',
    clear: 'Leeren',
    remove: 'Entfernen',
    compare: 'Vergleichen',
    before: 'Vorher',
    after: 'Nachher',
    close: 'Schließen',
    saved: '{size} gespart ({percent})',
    createPdf: 'PDF erstellen',
    creating: 'PDF wird erstellt…',
    pdfReady: 'Ihr PDF ist fertig',
    moveUp: 'Nach oben',
    moveDown: 'Nach unten',
    page: 'Seite {n}',
    files: { one: '{n} Datei', other: '{n} Dateien' } as Plural,
    pages: { one: '{n} Seite', other: '{n} Seiten' } as Plural,
    images: { one: '{n} Bild', other: '{n} Bilder' } as Plural,
  },
  home: {
    h1: 'PDF und Bilder komprimieren und umwandeln – privat in Ihrem Browser',
    subtitle:
      'PDF, JPG, PNG, WebP, AVIF und HEIC. Kostenlos, unbegrenzt – und Ihre Dateien verlassen nie Ihr Gerät.',
    compressTitle: 'Dateien komprimieren',
    convertTitle: 'Dateien umwandeln',
  },
  how: {
    title: '{tool} – in 3 einfachen Schritten',
    steps: [
      'Fügen Sie Dateien hinzu: per Drag & Drop, über die Dateiauswahl oder durch Einfügen aus der Zwischenablage.',
      'Die Verarbeitung startet sofort auf Ihrem Gerät. Passen Sie die Einstellungen an, wenn Sie Größe und Qualität anders gewichten möchten.',
      'Laden Sie jede Datei einzeln herunter – oder alle auf einmal als ZIP-Archiv.',
    ],
  },
  why: {
    title: 'Warum {site}?',
    items: [
      {
        title: 'Konsequent privat',
        text: 'Dateien werden mit WebAssembly auf Ihrem Gerät verarbeitet. Sie werden nie hochgeladen, gespeichert oder von jemandem eingesehen – nicht einmal von uns.',
      },
      {
        title: 'Kostenlos und ohne Limits',
        text: 'Keine Anmeldung, keine Wasserzeichen, keine Tageslimits und keine Begrenzung der Dateianzahl. Verarbeiten Sie so viel, wie Ihr Gerät schafft.',
      },
      {
        title: 'Erstklassige Komprimierung',
        text: 'Basierend auf MozJPEG, oxipng, libwebp und libavif – Open-Source-Encodern, denen Google und Mozilla vertrauen.',
      },
      {
        title: 'Schnelle Stapelverarbeitung',
        text: 'Dateien werden parallel auf allen CPU-Kernen verarbeitet, ohne Warten auf Uploads oder Downloads – selbst bei Hunderten von Dateien.',
      },
      {
        title: 'Funktioniert offline',
        text: 'Nach dem ersten Besuch funktioniert die Website auch ohne Internetverbindung. Installieren Sie sie als App auf Ihrem Smartphone oder Computer.',
      },
      {
        title: 'Keine Werbung, kein Tracking',
        text: 'Keine Cookies, keine Tracker, keine Werbung. Eine strenge Content Security Policy verhindert, dass die Seite Ihre Daten irgendwohin sendet.',
      },
    ],
  },
  faq: {
    title: 'Häufig gestellte Fragen',
    items: [
      {
        q: 'Werden meine Dateien auf einen Server hochgeladen?',
        a: 'Nein. {site} verarbeitet Dateien mit WebAssembly vollständig in Ihrem Browser. Ihre Dateien verlassen nie Ihr Gerät – es gibt also nichts, was gespeichert werden, in falsche Hände geraten oder gelöscht werden müsste. Sobald die Seite geladen ist, können Sie sogar die Internetverbindung trennen.',
      },
      {
        q: 'Ist „{tool}“ wirklich kostenlos? Gibt es Limits?',
        a: 'Ja. Das Tool ist komplett kostenlos – ohne Anmeldung, ohne Wasserzeichen und ohne Begrenzung der Dateianzahl. Die einzige Grenze ist der Arbeitsspeicher Ihres Geräts: Sehr große Dateien (mehrere Hundert MB) funktionieren auf älteren Smartphones möglicherweise nicht.',
      },
      {
        q: 'Verliere ich an Qualität?',
        a: 'Die Standardeinstellungen sind so abgestimmt, dass Dateien optisch identisch mit dem Original bleiben und trotzdem deutlich kleiner werden. Sie können die Qualität jederzeit erhöhen oder den verlustfreien Modus wählen. Lässt sich eine Datei nicht verkleinern, wird das Original beibehalten, statt eine schlechtere Version zu erzeugen.',
      },
      {
        q: 'Welche Geräte und Browser werden unterstützt?',
        a: 'Jeder moderne Browser: Chrome, Edge, Firefox, Safari und Opera unter Windows, macOS, Linux, Android und iOS. Sie müssen nichts installieren, können {site} aber für die Offline-Nutzung zu Ihrem Startbildschirm hinzufügen.',
      },
      {
        q: 'Werden persönliche Metadaten aus Fotos entfernt?',
        a: 'Ja. Beim Neucodieren von Bildern werden Metadaten wie GPS-Standort, Kameramodell und Zeitstempel entfernt. Die Ausrichtung wird direkt auf die Pixel angewendet, sodass Fotos weiterhin richtig herum angezeigt werden.',
      },
      {
        q: 'Warum ist eine Datei nicht kleiner geworden?',
        a: 'Manche Dateien sind bereits gut optimiert. In diesem Fall wird das Original beibehalten, statt eine größere Datei zu erzeugen. Bei PDFs entsteht die größte Ersparnis durch die enthaltenen Bilder – reine Text-PDFs sind meist schon kompakt.',
      },
    ],
  },
  sections: {
    formats: 'Über die Formate',
    related: 'Ähnliche Tools',
  },
  tools: {
    'compress-pdf': {
      name: 'PDF komprimieren',
      title: 'PDF verkleinern & komprimieren – kostenlos, ohne Upload',
      description:
        'PDF-Dateigröße um bis zu 90 % reduzieren – direkt im Browser. Kostenlos, ohne Anmeldung, ohne Limits. Ihre PDFs werden nie auf einen Server hochgeladen.',
      intro:
        'Machen Sie PDFs klein genug für E-Mails, Onlineformulare und Bewerbungsportale. Bilder im PDF werden mit MozJPEG neu komprimiert, ungenutzte Daten entfernt und die Dateistruktur neu gepackt – Text bleibt scharf und markierbar.',
      card: 'PDFs für E-Mail und Uploads verkleinern',
    },
    'compress-image': {
      name: 'Bilder komprimieren',
      title: 'Bilder komprimieren & verkleinern – JPG, PNG, WebP, AVIF',
      description:
        'JPG-, PNG-, WebP- und AVIF-Bilder kostenlos um bis zu 80 % verkleinern – ohne sichtbaren Qualitätsverlust. Stapelverarbeitung im Browser, ohne Upload.',
      intro:
        'Ziehen Sie einen ganzen Ordner mit Fotos oder Screenshots hinein. Jedes Bild wird mit den besten Open-Source-Encodern optimiert – MozJPEG, oxipng mit smarter Palettenreduktion, libwebp und libavif. Größe und Format können Sie dabei direkt mit ändern.',
      card: 'Alle Bildformate in einem Tool',
    },
    'compress-jpg': {
      name: 'JPG komprimieren',
      title: 'JPG verkleinern – JPEG-Bilder online komprimieren, kostenlos',
      description:
        'JPG/JPEG-Fotos mit MozJPEG um bis zu 80 % verkleinern – direkt im Browser. Ohne Upload, ohne Anmeldung, ohne Wasserzeichen. Hunderte Fotos auf einmal.',
      intro:
        'Fotos von Smartphones und Kameras sind oft 3–10 MB groß. MozJPEG codiert sie mit intelligenterer Quantisierung und progressiven Scans neu und reduziert die Größe meist um 60–80 % – ohne sichtbaren Unterschied. Standort- und Kameradaten werden zum Schutz Ihrer Privatsphäre entfernt.',
      card: 'Kleinere Fotos, gleiche Optik',
    },
    'compress-png': {
      name: 'PNG komprimieren',
      title: 'PNG komprimieren – PNG-Dateien um bis zu 80 % verkleinern',
      description:
        'PNG-Größe mit smarter Farbreduktion um bis zu 80 % verringern, Transparenz bleibt erhalten. Auch verlustfrei möglich. Läuft im Browser – ohne Upload.',
      intro:
        'Der Smart-Modus wandelt das Bild mit sorgfältigem Dithering in eine optimierte Palette mit bis zu 256 Farben um, anschließend packt oxipng es so kompakt wie möglich. Die Transparenz bleibt erhalten. Sie brauchen ein pixelgenaues Ergebnis? Wechseln Sie in den verlustfreien Modus.',
      card: 'Transparente Bilder, deutlich kleiner',
    },
    'compress-webp': {
      name: 'WebP komprimieren',
      title: 'WebP komprimieren & verkleinern – kostenlos und privat',
      description:
        'WebP-Bilder mit libwebp direkt im Browser verkleinern. Einstellbare Qualität, Größenänderung und Stapelverarbeitung. Ohne Upload, ohne Limits.',
      intro:
        'WebP ist bereits effizient, doch Bilder, die mit maximaler Qualität oder direkt aus Design-Tools exportiert wurden, lassen sich meist um weitere 30–60 % verkleinern – ohne sichtbaren Unterschied. Qualität wählen, bei Bedarf Größe ändern und herunterladen.',
      card: 'Leichtere WebP für schnellere Websites',
    },
    'jpg-to-pdf': {
      name: 'JPG in PDF',
      title: 'JPG in PDF umwandeln – Bilder zu einem PDF zusammenfügen',
      description:
        'JPG-, PNG-, HEIC- und WebP-Bilder kostenlos im Browser zu einem PDF zusammenfügen. Seiten sortieren, A4 oder Letter wählen. Ohne Upload, ohne Wasserzeichen.',
      intro:
        'Machen Sie aus Fotos von Dokumenten, Belegen oder Scans ein übersichtliches PDF. JPEG-Bilder werden ohne erneute Komprimierung eingebettet – also ganz ohne Qualitätsverlust. Reihenfolge festlegen, Seitengröße wählen und herunterladen.',
      card: 'Fotos zu einem PDF zusammenfügen',
    },
    'pdf-to-jpg': {
      name: 'PDF in JPG',
      title: 'PDF in JPG umwandeln – PDF-Seiten als Bilder, kostenlos',
      description:
        'Jede Seite eines PDFs direkt im Browser in hochwertige JPG-Bilder umwandeln. Auflösung bis 300 DPI wählbar. Ohne Upload, ohne Limits.',
      intro:
        'Jede Seite wird mit pdf.js – der Engine hinter dem PDF-Viewer von Firefox – in der gewählten Auflösung gerendert und als JPG gespeichert. Laden Sie die Seiten einzeln oder alle zusammen als ZIP herunter.',
      card: 'Jede Seite als Bild',
    },
    'pdf-to-png': {
      name: 'PDF in PNG',
      title: 'PDF in PNG umwandeln – PDF-Seiten als PNG, kostenlos',
      description:
        'PDF-Seiten direkt im Browser in verlustfreie PNG-Bilder umwandeln. Gestochen scharfer Text, bis 300 DPI, alles als ZIP herunterladen. Ohne Upload.',
      intro:
        'PNG gibt Text und Strichgrafiken perfekt scharf wieder – ideal für Folien, Diagramme und Dokumente, die Sie bearbeiten oder kommentieren möchten. Die Seiten werden lokal mit pdf.js gerendert.',
      card: 'Verlustfreie Bilder jeder Seite',
    },
  },
  converter: {
    name: '{from} in {to}',
    title: '{from} in {to} umwandeln – kostenloser Konverter, ohne Upload',
    description:
      '{from}-Bilder in Sekunden direkt im Browser in {to} umwandeln. Stapelkonvertierung, einstellbare Qualität, ohne Anmeldung – Ihre Dateien bleiben auf Ihrem Gerät.',
    intro:
      'Fügen Sie beliebig viele {from}-Dateien hinzu: Sie werden mit schnellen WebAssembly-Codecs auf Ihrem Gerät decodiert und als {to} neu codiert. Nichts wird hochgeladen – daher ist das auch für private Fotos und Dokumente sicher.',
    card: '{from}-Bilder in {to} umwandeln',
  },
  formats: {
    jpg: 'JPG (JPEG) ist das am weitesten verbreitete Fotoformat. Seine verlustbehaftete Komprimierung ist ideal für Fotos, unterstützt aber keine Transparenz und kann scharfen Text unscharf machen.',
    png: 'PNG ist ein verlustfreies Format mit Transparenz. Es eignet sich perfekt für Screenshots, Logos und Grafiken – als PNG gespeicherte Fotos sind jedoch meist sehr groß.',
    webp: 'WebP ist ein modernes Format von Google, das bei gleicher Qualität meist 25–35 % kleiner als JPG ist und Transparenz unterstützt. Alle aktuellen Browser können es anzeigen.',
    avif: 'AVIF ist ein Format der nächsten Generation auf Basis des Videocodecs AV1. Bei ähnlicher Qualität sind die Dateien oft rund 50 % kleiner als JPG, und alle aktuellen Browser unterstützen es.',
    heic: 'HEIC (HEIF) ist das Standard-Fotoformat auf iPhone und iPad. Es ist platzsparend, wird aber unter Windows, Android und auf Websites schlecht unterstützt – in JPG umgewandelt lassen sich Fotos problemlos teilen.',
    pdf: 'PDF ist das universelle Dokumentformat: Es sieht auf jedem Gerät gleich aus. Gescannte Dokumente und PDFs mit Fotos sind oft viel größer als nötig.',
  },
  about: {
    h1: 'So funktioniert {site}',
    sections: [
      {
        h: 'Ihre Dateien verlassen nie Ihr Gerät',
        p: 'Die meisten Online-Konverter laden Ihre Dateien auf ihre Server hoch, verarbeiten sie dort und bewahren Kopien stunden- oder tagelang auf. {site} funktioniert anders: Die Website liefert die Komprimierungssoftware an Ihren Browser, und die gesamte Verarbeitung findet lokal auf Ihrem Computer oder Smartphone statt. Der Server stellt nur statische Dateien bereit und erhält Ihre Dokumente nie.',
      },
      {
        h: 'Wie können Sie das überprüfen?',
        p: 'Öffnen Sie die Entwicklertools Ihres Browsers und beobachten Sie den Tab „Netzwerk“, während eine Datei verarbeitet wird: Es werden keine Upload-Anfragen gesendet. Sie können auch die Internetverbindung trennen, sobald die Seite geladen ist – alles funktioniert weiter. Zusätzlich verhindert eine strenge Content Security Policy, dass die Seite Daten an andere Websites sendet.',
      },
      {
        h: 'Die Technik',
        p: 'Bilder werden mit WebAssembly-Versionen von MozJPEG, oxipng, libwebp und libavif codiert. PNG-Dateien werden mit einer adaptiven Palette und Dithering verkleinert. PDFs werden mit pdf-lib optimiert: Eingebettete Bilder werden neu komprimiert, ungenutzte Objekte entfernt und die Struktur neu gepackt. PDF-Seiten werden mit pdf.js gerendert, HEIC-Fotos mit libheif decodiert.',
      },
      {
        h: 'Datenschutz',
        p: 'Es gibt keine Cookies, keine Analyse-Tracker, keine Werbung und keine Benutzerkonten. Da Dateien nie hochgeladen werden, haben wir keinen Zugriff darauf – und nichts, was wir löschen müssten. Ihre gewählten Einstellungen werden nur in Ihrem eigenen Browser gespeichert.',
      },
      {
        h: 'Dauerhaft kostenlos',
        p: 'Da Ihr Gerät die Arbeit erledigt, kostet der Betrieb von {site} fast nichts. Deshalb kann es kostenlos bleiben – ohne Limits, Wasserzeichen oder kostenpflichtige Upgrades.',
      },
    ],
  },
  footer: {
    tagline: 'Kostenlose, private Dateikomprimierung und -umwandlung. Alles läuft in Ihrem Browser.',
    tools: 'Tools',
    languages: 'Sprachen',
    privacy: 'Keine Uploads · Keine Cookies · Kein Tracking',
  },
  notFound: {
    title: 'Seite nicht gefunden',
    text: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    back: 'Zur Startseite',
  },
  langBanner: {
    text: 'Diese Seite ist auch auf Deutsch verfügbar.',
    action: 'Wechseln',
    dismiss: 'Schließen',
  },
};

export default de;
