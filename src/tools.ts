// Every tool gets its own indexable landing page in every language.

import type { ImageFormat } from './engine/types';

export type ToolKind = 'image' | 'pdf-compress' | 'images-to-pdf' | 'pdf-to-images';
export type FormatKey = 'jpg' | 'png' | 'webp' | 'avif' | 'heic' | 'pdf';

export interface Tool {
  id: string;
  kind: ToolKind;
  category: 'compress' | 'convert';
  /** Formats accepted as input. */
  from: FormatKey[];
  /** Output format; 'same' keeps the input format. */
  to: FormatKey | 'same';
  /** Converter pages share a localized text template. */
  template?: boolean;
  related: string[];
}

const imageInputs: FormatKey[] = ['jpg', 'png', 'webp', 'avif', 'heic'];

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
    related: ['compress-jpg', 'compress-png', 'png-to-webp'],
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
  ...(
    [
      ['heic', 'jpg', ['heic-to-png', 'jpg-to-pdf', 'compress-jpg']],
      ['heic', 'png', ['heic-to-jpg', 'compress-png', 'jpg-to-pdf']],
      ['png', 'jpg', ['jpg-to-png', 'compress-jpg', 'png-to-webp']],
      ['jpg', 'png', ['png-to-jpg', 'compress-png', 'jpg-to-webp']],
      ['webp', 'jpg', ['webp-to-png', 'jpg-to-webp', 'compress-jpg']],
      ['webp', 'png', ['webp-to-jpg', 'png-to-webp', 'compress-png']],
      ['jpg', 'webp', ['png-to-webp', 'webp-to-jpg', 'compress-webp']],
      ['png', 'webp', ['jpg-to-webp', 'webp-to-png', 'compress-png']],
      ['jpg', 'avif', ['avif-to-jpg', 'jpg-to-webp', 'compress-jpg']],
      ['avif', 'jpg', ['jpg-to-avif', 'webp-to-jpg', 'compress-jpg']],
    ] as [FormatKey, FormatKey, string[]][]
  ).map(
    ([from, to, related]): Tool => ({
      id: `${from}-to-${to}`,
      kind: 'image',
      category: 'convert',
      from: [from],
      to,
      template: true,
      related,
    }),
  ),
  {
    id: 'jpg-to-pdf',
    kind: 'images-to-pdf',
    category: 'convert',
    from: imageInputs,
    to: 'pdf',
    related: ['compress-pdf', 'pdf-to-jpg', 'heic-to-jpg'],
  },
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
