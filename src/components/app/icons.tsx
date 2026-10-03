// Inline SVG icons (no icon font, no external requests).

type P = { size?: number };

const svg = (path: preact.ComponentChildren, size = 20) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {path}
  </svg>
);

export const UploadIcon = ({ size }: P) =>
  svg(
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </>,
    size,
  );

export const DownloadIcon = ({ size }: P) =>
  svg(
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>,
    size,
  );

export const TrashIcon = ({ size }: P) =>
  svg(
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </>,
    size,
  );

export const CompareIcon = ({ size }: P) =>
  svg(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M12 4v16" />
    </>,
    size,
  );

export const UpIcon = ({ size }: P) => svg(<path d="M18 15l-6-6-6 6" />, size);
export const DownIcon = ({ size }: P) => svg(<path d="M6 9l6 6 6-6" />, size);
export const CloseIcon = ({ size }: P) => svg(<path d="M18 6L6 18M6 6l12 12" />, size);
export const PlusIcon = ({ size }: P) => svg(<path d="M12 5v14M5 12h14" />, size);

export const LockIcon = ({ size }: P) =>
  svg(
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>,
    size,
  );

export const FileIcon = ({ size }: P) =>
  svg(
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
    </>,
    size,
  );

export const AlertIcon = ({ size }: P) =>
  svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>,
    size,
  );
