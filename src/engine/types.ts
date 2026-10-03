// Shared types between the UI thread and the processing worker.

export type ImageFormat = 'jpg' | 'png' | 'webp' | 'avif';
export type InputFormat = ImageFormat | 'heic' | 'gif' | 'bmp' | 'pdf' | 'unknown';

export interface ImageOptions {
  /** Output format, or 'same' to keep the input format. */
  format: ImageFormat | 'same';
  /** 1..100, used for JPEG, WebP and AVIF. */
  quality: number;
  /** Longest side in pixels; 0 keeps the original size. */
  maxSide: number;
  /** PNG: reduce to a 256-colour palette (like TinyPNG) instead of lossless only. */
  pngLossy: boolean;
}

export type PdfLevel = 'low' | 'medium' | 'high';

export interface PdfCompressOptions {
  level: PdfLevel;
  grayscale: boolean;
}

export type PageSize = 'fit' | 'a4' | 'letter';

export interface ImagesToPdfOptions {
  pageSize: PageSize;
  margin: boolean;
}

export interface PdfToImagesOptions {
  format: 'jpg' | 'png';
  dpi: number;
  quality: number;
}

export type ErrorCode = 'unsupported' | 'encrypted' | 'decode' | 'failed';

/** Raised inside the engine with a code the UI can translate. */
export class EngineError extends Error {
  constructor(
    public code: ErrorCode,
    detail?: string,
  ) {
    super(detail || code);
  }
}

export type ImageSource = ArrayBuffer | ImageBitmap;

export type WorkerJob =
  | { type: 'image'; input: ImageSource; inFormat: InputFormat; options: ImageOptions }
  | { type: 'pdf-compress'; input: ArrayBuffer; options: PdfCompressOptions }
  | {
      type: 'images-to-pdf';
      inputs: { data: ImageSource; format: InputFormat }[];
      options: ImagesToPdfOptions;
    };

export interface JobResult {
  data: ArrayBuffer;
  mime: string;
  ext: string;
  width?: number;
  height?: number;
  /** The output was not smaller, so the original bytes are returned. */
  keptOriginal?: boolean;
}

export type WorkerRequest = WorkerJob & { id: number };

export type WorkerResponse =
  | { id: number; kind: 'progress'; value: number }
  | { id: number; kind: 'done'; result: JobResult }
  | { id: number; kind: 'error'; code: ErrorCode; detail?: string };
