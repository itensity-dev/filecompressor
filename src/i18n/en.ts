// English source strings. Every other locale implements the same `Dict` shape.
// Placeholders in braces ({site}, {tool}, {from}, {to}, {n}...) are filled at
// render time; plural forms follow Intl.PluralRules categories.

import type { Plural } from './types';

const en = {
  meta: {
    homeTitle: 'Compress PDF, JPG, PNG & convert images — free, no upload',
    homeDescription:
      'Free online file compressor and converter that runs in your browser. Compress PDF, JPG, PNG, WebP, convert HEIC to JPG and more. No upload, no limits.',
    aboutTitle: 'How {site} works — private, in-browser file processing',
    aboutDescription:
      'Learn how {site} compresses and converts files entirely in your browser with WebAssembly, and why your files are never uploaded or stored.',
    notFoundTitle: 'Page not found',
  },
  nav: {
    allTools: 'All tools',
    compress: 'Compress',
    convert: 'Convert',
    about: 'How it works',
    language: 'Language',
    skip: 'Skip to content',
  },
  badges: {
    private: 'Files never leave your device',
    free: 'Free, no sign-up',
    unlimited: 'No limits',
    offline: 'Works offline',
  },
  drop: {
    title: 'Drop files here',
    choose: 'Choose files',
    paste: 'or paste with Ctrl+V',
    supported: 'Supported: {formats}',
    overlay: 'Drop to add files',
    addMore: 'Add more files',
    local: 'Processed on your device — nothing is uploaded.',
  },
  settings: {
    title: 'Settings',
    quality: 'Quality',
    qualityHint: 'Lower quality = smaller file',
    format: 'Output format',
    keepFormat: 'Keep original',
    resize: 'Resize (longest side)',
    originalSize: 'Original size',
    pngMode: 'PNG compression',
    pngLossy: 'Smart (up to 80% smaller)',
    pngLossless: 'Lossless',
    level: 'Compression level',
    levelLow: 'Light',
    levelLowHint: 'Best quality',
    levelMedium: 'Recommended',
    levelMediumHint: 'Good quality, much smaller',
    levelHigh: 'Strong',
    levelHighHint: 'Smallest file',
    grayscale: 'Convert images to black & white',
    pageSize: 'Page size',
    pageFit: 'Same as image',
    margin: 'Add margins',
    dpi: 'Resolution',
    apply: 'Apply to all files',
    changed: 'Settings changed.',
  },
  status: {
    queued: 'Waiting…',
    processing: 'Processing…',
    ready: 'Ready',
    kept: 'Already optimized — original kept',
    errors: {
      unsupported: 'This file type is not supported here',
      encrypted: 'Password-protected PDF — remove the password first',
      decode: 'The file is damaged or cannot be read',
      failed: 'Could not process this file (it may be too large for this device)',
    },
  },
  results: {
    download: 'Download',
    downloadAll: 'Download all',
    downloadZip: 'Download ZIP',
    clear: 'Clear',
    remove: 'Remove',
    compare: 'Compare',
    before: 'Before',
    after: 'After',
    close: 'Close',
    saved: 'Saved {size} ({percent})',
    createPdf: 'Create PDF',
    creating: 'Creating PDF…',
    pdfReady: 'Your PDF is ready',
    moveUp: 'Move up',
    moveDown: 'Move down',
    page: 'Page {n}',
    files: { one: '{n} file', other: '{n} files' } as Plural,
    pages: { one: '{n} page', other: '{n} pages' } as Plural,
    images: { one: '{n} image', other: '{n} images' } as Plural,
  },
  home: {
    h1: 'Compress and convert files — privately, in your browser',
    subtitle:
      'PDF, JPG, PNG, WebP, AVIF and HEIC. Free, unlimited, and your files never leave your device.',
    compressTitle: 'Compress files',
    convertTitle: 'Convert files',
  },
  how: {
    title: '{tool} in 3 simple steps',
    steps: [
      'Add files: drag and drop them, choose them from your device or paste from the clipboard.',
      'Processing starts instantly on your device. Adjust the settings if you want a different balance of size and quality.',
      'Download each file, or everything at once as a ZIP archive.',
    ],
  },
  why: {
    title: 'Why {site}?',
    items: [
      {
        title: 'Private by design',
        text: 'Files are processed on your device with WebAssembly. They are never uploaded, stored or seen by anyone — not even by us.',
      },
      {
        title: 'Free, without limits',
        text: 'No sign-up, no watermarks, no daily quotas and no caps on the number of files. Process as much as your device can handle.',
      },
      {
        title: 'Best-in-class compression',
        text: 'Powered by MozJPEG, oxipng, libwebp and libavif — open-source encoders trusted by Google and Mozilla.',
      },
      {
        title: 'Fast batch processing',
        text: 'Files are processed in parallel on all CPU cores, with no waiting for uploads or downloads — even for hundreds of files.',
      },
      {
        title: 'Works offline',
        text: 'After the first visit the site works without an internet connection. Install it as an app on your phone or computer.',
      },
      {
        title: 'No ads, no tracking',
        text: 'No cookies, no trackers and no ads. A strict Content Security Policy stops the page from sending your data anywhere.',
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Are my files uploaded to a server?',
        a: 'No. {site} processes files entirely in your browser using WebAssembly. Your files never leave your device, so there is nothing to store, leak or delete. You can even disconnect from the internet after the page has loaded.',
      },
      {
        q: 'Is {tool} really free? Are there any limits?',
        a: 'Yes. It is completely free, with no sign-up, no watermarks and no limit on the number of files. The only limit is your device’s memory: very large files (hundreds of MB) may not work on older phones.',
      },
      {
        q: 'Will I lose quality?',
        a: 'The default settings are tuned to keep files visually identical to the original while making them much smaller. You can raise the quality or choose lossless mode at any time. If a file cannot be made smaller, the original is kept instead of producing a worse one.',
      },
      {
        q: 'Which devices and browsers are supported?',
        a: 'Any modern browser: Chrome, Edge, Firefox, Safari and Opera on Windows, macOS, Linux, Android and iOS. Nothing needs to be installed, but you can add {site} to your home screen for offline use.',
      },
      {
        q: 'Is personal metadata removed from photos?',
        a: 'Yes. When images are re-encoded, metadata such as GPS location, camera model and timestamps is removed. The orientation is applied to the pixels, so photos still display the right way up.',
      },
      {
        q: 'Why did a file not get smaller?',
        a: 'Some files are already well optimized. In that case the original is kept rather than producing a bigger file. With PDFs, most savings come from images — PDFs that contain only text are usually compact already.',
      },
    ],
  },
  sections: {
    formats: 'About the formats',
    related: 'Related tools',
  },
  tools: {
    'compress-pdf': {
      name: 'Compress PDF',
      title: 'Compress PDF — reduce PDF file size, free & no upload',
      description:
        'Reduce PDF file size by up to 90% right in your browser. Free, no sign-up, no limits — your PDFs are never uploaded to any server.',
      intro:
        'Make PDFs small enough for email, online forms and job portals. Images inside the PDF are recompressed with MozJPEG, unused data is removed and the file structure is repacked — text stays sharp and selectable.',
      card: 'Shrink PDFs for email and uploads',
    },
    'compress-image': {
      name: 'Compress images',
      title: 'Compress images — JPG, PNG, WebP, AVIF online, free',
      description:
        'Compress JPG, PNG, WebP and AVIF images by up to 80% without visible quality loss. Batch processing in your browser — no upload, no limits.',
      intro:
        'Drop in a whole folder of photos or screenshots. Each image is optimized with the best open-source encoders — MozJPEG, oxipng with smart palette reduction, libwebp and libavif — and you can resize or change the format on the fly.',
      card: 'JPG, PNG, WebP and AVIF in one place',
    },
    'compress-jpg': {
      name: 'Compress JPG',
      title: 'Compress JPG — reduce JPEG size online, free',
      description:
        'Make JPG/JPEG photos up to 80% smaller with MozJPEG, right in your browser. No upload, no sign-up, no watermark. Batch-compress hundreds of photos.',
      intro:
        'Photos from phones and cameras are often 3–10 MB. MozJPEG re-encodes them with smarter quantization and progressive scans, typically cutting the size by 60–80% with no visible difference. Location and camera metadata are removed for privacy.',
      card: 'Smaller photos, same look',
    },
    'compress-png': {
      name: 'Compress PNG',
      title: 'Compress PNG — shrink PNG files up to 80%, free',
      description:
        'Reduce PNG size by up to 80% with smart colour reduction while keeping transparency. Lossless mode available. Runs in your browser — no upload.',
      intro:
        'Smart mode converts the image to an optimized palette of up to 256 colours with careful dithering, then oxipng packs it as tightly as possible. Transparency is preserved. Need pixel-perfect output? Switch to lossless mode.',
      card: 'Transparent images, much lighter',
    },
    'compress-webp': {
      name: 'Compress WebP',
      title: 'Compress WebP images online — free and private',
      description:
        'Reduce WebP image size with libwebp right in your browser. Adjustable quality, resizing and batch processing. No upload, no limits.',
      intro:
        'WebP is already efficient, but images exported at maximum quality or straight from design tools can usually lose another 30–60% without any visible change. Pick a quality level, resize if needed and download.',
      card: 'Lighter WebP for faster websites',
    },
    'jpg-to-pdf': {
      name: 'JPG to PDF',
      title: 'JPG to PDF — combine images into one PDF, free',
      description:
        'Convert JPG, PNG, HEIC and WebP images into a single PDF in your browser. Reorder pages, choose A4 or Letter. No upload, no watermark.',
      intro:
        'Turn photos of documents, receipts or scans into one tidy PDF. JPEG images are embedded without recompression, so there is no quality loss. Arrange the order, pick a page size and download.',
      card: 'Combine photos into a PDF',
    },
    'pdf-to-jpg': {
      name: 'PDF to JPG',
      title: 'PDF to JPG — convert PDF pages to images, free',
      description:
        'Convert every page of a PDF into high-quality JPG images in your browser. Choose a resolution up to 300 DPI. No upload, no limits.',
      intro:
        'Each page is rendered with pdf.js — the engine behind Firefox’s PDF viewer — at the resolution you choose and saved as a JPG. Download pages one by one or all together as a ZIP.',
      card: 'Every page as an image',
    },
    'pdf-to-png': {
      name: 'PDF to PNG',
      title: 'PDF to PNG — convert PDF pages to PNG, free',
      description:
        'Convert PDF pages to lossless PNG images right in your browser. Sharp text, up to 300 DPI, download everything as a ZIP. No upload.',
      intro:
        'PNG keeps text and line art perfectly crisp, which makes it ideal for slides, diagrams and documents you want to edit or annotate. Pages are rendered locally with pdf.js.',
      card: 'Lossless page images',
    },
  },
  converter: {
    name: '{from} to {to}',
    title: 'Convert {from} to {to} — free online converter, no upload',
    description:
      'Convert {from} images to {to} in seconds, right in your browser. Batch conversion, adjustable quality, no sign-up — your files never leave your device.',
    intro:
      'Add as many {from} files as you like: they are decoded and re-encoded to {to} on your device with fast WebAssembly codecs. Nothing is uploaded, so it is safe even for private photos and documents.',
    card: 'Convert {from} images to {to}',
  },
  formats: {
    jpg: 'JPG (JPEG) is the most widely supported photo format. Its lossy compression is ideal for photographs, but it does not support transparency and can blur sharp text.',
    png: 'PNG is a lossless format with transparency support. It is perfect for screenshots, logos and graphics, but photos saved as PNG are usually very large.',
    webp: 'WebP is a modern format from Google that is typically 25–35% smaller than JPG at the same quality and supports transparency. All current browsers can display it.',
    avif: 'AVIF is a next-generation format based on the AV1 video codec. It often produces files around 50% smaller than JPG at similar quality and is supported by all current browsers.',
    heic: 'HEIC (HEIF) is the default photo format on iPhone and iPad. It is compact but poorly supported on Windows, Android and websites, so converting to JPG makes photos easy to share.',
    pdf: 'PDF is the universal document format: it looks the same on every device. Scanned documents and PDFs with photos are often far larger than they need to be.',
  },
  about: {
    h1: 'How {site} works',
    sections: [
      {
        h: 'Your files never leave your device',
        p: 'Most online converters upload your files to their servers, process them there and keep copies for hours or days. {site} works differently: the website delivers the compression software to your browser, and all processing happens locally on your computer or phone. The server only hosts static files and never receives your documents.',
      },
      {
        h: 'How can you check this?',
        p: 'Open your browser’s developer tools and watch the Network tab while a file is being processed: no upload requests are made. You can also disconnect from the internet after the page has loaded — everything keeps working. A strict Content Security Policy also prevents the page from sending data to any other website.',
      },
      {
        h: 'The technology',
        p: 'Images are encoded with WebAssembly builds of MozJPEG, oxipng, libwebp and libavif. PNG files are reduced with an adaptive palette and dithering. PDFs are optimized with pdf-lib: embedded images are recompressed, unused objects are removed and the structure is repacked. PDF pages are rendered with pdf.js, and HEIC photos are decoded with libheif.',
      },
      {
        h: 'Privacy',
        p: 'There are no cookies, analytics trackers, ads or accounts. Because files are never uploaded, we have no access to them and nothing to delete. The settings you choose are remembered only in your own browser.',
      },
      {
        h: 'Free for good',
        p: 'Because your device does the work, running {site} costs almost nothing. That is why it can stay free, without limits, watermarks or upsells.',
      },
    ],
  },
  footer: {
    tagline: 'Free, private file compression and conversion. Everything runs in your browser.',
    tools: 'Tools',
    languages: 'Languages',
    privacy: 'No uploads · No cookies · No tracking',
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has been moved.',
    back: 'Go to the homepage',
  },
  compat: {
    outdated:
      'Your browser is too old to process files on your device. Please update it, or open this page in a recent Chrome, Safari, Firefox or Edge.',
    noWasm:
      'WebAssembly is turned off in your browser (for example by iPhone Lockdown Mode), and it is needed to process files on your device. Add this site as an exception or use another browser.',
  },
  langBanner: {
    text: 'This page is available in English.',
    action: 'Switch',
    dismiss: 'Dismiss',
  },
};

export default en;
