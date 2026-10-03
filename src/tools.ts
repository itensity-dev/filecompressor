// Every tool gets its own indexable landing page in every language.

import type { ImageFormat } from './engine/types';

export type ToolKind = 'image' | 'pdf-compress' | 'images-to-pdf' | 'pdf-to-images';
export type FormatKey = 'jpg' | 'png' | 'webp' | 'avif' | 'heic' | 'pdf';

export interface Tool {
  id: string;
  kind: ToolKind;
  category: 'compress' | 'convert';
  /** Formats accepted as input; the first one is the page's main format. */
  from: FormatKey[];
  /** Output format; 'same' keeps the input format. */
  to: FormatKey | 'same';
  /** Generated converter pages share a localized text template. */
  template?: 'image' | 'pdf';
  related: string[];
}

const imageInputs: FormatKey[] = ['jpg', 'png', 'webp', 'avif', 'heic'];

/** Rows and columns of the conversion table. */
export const MATRIX_FROM: FormatKey[] = ['heic', 'jpg', 'png', 'webp', 'avif', 'pdf'];
export const MATRIX_TO: FormatKey[] = ['jpg', 'png', 'webp', 'avif', 'pdf'];

const conversionId = (from: FormatKey, to: FormatKey) => `${from}-to-${to}`;

function converter(from: FormatKey, to: FormatKey): Tool {
  // HEIC can be read but not written, so there is no "jpg-to-heic".
  const back = to !== 'pdf' && MATRIX_TO.includes(from) ? [conversionId(to, from)] : [];
  const sibling = MATRIX_TO.filter((t) => t !== to && t !== from && t !== 'pdf')
    .slice(0, 1)
    .map((t) => conversionId(from, t));
  const compress = to === 'pdf' ? 'compress-pdf' : `compress-${to === 'avif' ? 'image' : to}`;
  if (to === 'pdf') {
    return {
      id: conversionId(from, to),
      kind: 'images-to-pdf',
      category: 'convert',
      from: [from, ...imageInputs.filter((f) => f !== from)],
      to: 'pdf',
      template: from === 'jpg' ? undefined : 'pdf',
      related: ['compress-pdf', 'pdf-to-jpg', from === 'jpg' ? 'heic-to-pdf' : 'jpg-to-pdf'],
    };
  }
  return {
    id: conversionId(from, to),
    kind: 'image',
    category: 'convert',
    from: [from],
    to,
    template: 'image',
    related: [...back, ...sibling, compress, 'image-converter'].slice(0, 3),
  };
}

const imageConverters = MATRIX_FROM.filter((f) => f !== 'pdf').flatMap((from) =>
  MATRIX_TO.filter((to) => to !== from).map((to) => converter(from, to)),
);

export const TOOLS: Tool[] = [
  {
    id: 'compress-pdf',
    kind: 'pdf-compress',
    category: 'compress',
    from: ['pdf'],
    to: 'pdf',
    related: ['jpg-to-pdf', 'pdf-to-jpg', 'compress-image'],
  },
  {
    id: 'compress-image',
    kind: 'image',
    category: 'compress',
    from: imageInputs,
    to: 'same',
    related: ['compress-jpg', 'compress-png', 'image-converter'],
  },
  {
    id: 'compress-jpg',
    kind: 'image',
    category: 'compress',
    from: ['jpg'],
    to: 'jpg',
    related: ['compress-png', 'jpg-to-webp', 'compress-image'],
  },
  {
    id: 'compress-png',
    kind: 'image',
    category: 'compress',
    from: ['png'],
    to: 'png',
    related: ['compress-jpg', 'png-to-webp', 'png-to-jpg'],
  },
  {
    id: 'compress-webp',
    kind: 'image',
    category: 'compress',
    from: ['webp'],
    to: 'webp',
    related: ['compress-image', 'webp-to-jpg', 'webp-to-png'],
  },
  {
    id: 'image-converter',
    kind: 'image',
    category: 'convert',
    from: imageInputs,
    to: 'jpg',
    related: ['heic-to-jpg', 'png-to-jpg', 'compress-image'],
  },
  ...imageConverters,
  {
    id: 'pdf-to-jpg',
    kind: 'pdf-to-images',
    category: 'convert',
    from: ['pdf'],
    to: 'jpg',
    related: ['pdf-to-png', 'compress-pdf', 'jpg-to-pdf'],
  },
  {
    id: 'pdf-to-png',
    kind: 'pdf-to-images',
    category: 'convert',
    from: ['pdf'],
    to: 'png',
    related: ['pdf-to-jpg', 'compress-pdf', 'compress-png'],
  },
];

export const TOOL_IDS = TOOLS.map((t) => t.id);
export const getTool = (id: string) => TOOLS.find((t) => t.id === id);

/** The page converting `from` into `to`, if there is one. */
export const findConversion = (from: FormatKey, to: FormatKey) =>
  from === to ? undefined : getTool(conversionId(from, to));

export const FORMAT_LABEL: Record<FormatKey, string> = {
  jpg: 'JPG',
  png: 'PNG',
  webp: 'WebP',
  avif: 'AVIF',
  heic: 'HEIC',
  pdf: 'PDF',
};

export const ACCEPT: Record<FormatKey, string> = {
  jpg: '.jpg,.jpeg,.jfif,image/jpeg',
  png: '.png,image/png',
  webp: '.webp,image/webp',
  avif: '.avif,image/avif',
  heic: '.heic,.heif,image/heic,image/heif',
  pdf: '.pdf,application/pdf',
};

export const isImageFormat = (f: string): f is ImageFormat =>
  f === 'jpg' || f === 'png' || f === 'webp' || f === 'avif';
