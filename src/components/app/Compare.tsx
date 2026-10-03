import { useEffect, useRef, useState } from 'preact/hooks';
import { CloseIcon } from './icons';

interface Props {
  before: string;
  after: string;
  labels: { before: string; after: string; close: string };
  beforeSize: string;
  afterSize: string;
  onClose: () => void;
}

/** Before/after slider in a modal dialog. */
export function Compare({ before, after, labels, beforeSize, afterSize, onClose }: Props) {
  const [pos, setPos] = useState(50);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const move = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <dialog
      ref={dialog}
      class="compare"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
    >
      <div class="compare-head">
        <span>
          {labels.before}: <b>{beforeSize}</b> → {labels.after}: <b>{afterSize}</b>
        </span>
        <button
          type="button"
          class="icon-btn"
          aria-label={labels.close}
          onClick={() => dialog.current?.close()}
        >
          <CloseIcon />
        </button>
      </div>
      <div
        ref={frame}
        class="compare-frame"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && move(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
      >
        <img src={before} alt={labels.before} draggable={false} />
        <img
          src={after}
          alt={labels.after}
          draggable={false}
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        />
        <div class="compare-line" style={{ left: `${pos}%` }} />
        <span class="compare-tag left">{labels.before}</span>
        <span class="compare-tag right">{labels.after}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-label={`${labels.before} / ${labels.after}`}
        onInput={(e) => setPos(Number((e.target as HTMLInputElement).value))}
      />
    </dialog>
  );
}
