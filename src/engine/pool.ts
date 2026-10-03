// A small pool of processing workers so batches use several CPU cores.

import {
  EngineError,
  type JobResult,
  type WorkerJob,
  type WorkerRequest,
  type WorkerResponse,
} from './types';

interface Task {
  id: number;
  job: WorkerJob;
  transfer: Transferable[];
  onProgress?: (v: number) => void;
  resolve: (r: JobResult) => void;
  reject: (e: unknown) => void;
}

interface Slot {
  worker: Worker;
  task: Task | null;
}

const createWorker = () =>
  new Worker(new URL('./processor.worker.ts', import.meta.url), { type: 'module' });

export class WorkerPool {
  private slots: Slot[] = [];
  private queue: Task[] = [];
  private nextId = 1;

  constructor(private size = defaultPoolSize()) {}

  run(job: WorkerJob, transfer: Transferable[] = [], onProgress?: (v: number) => void) {
    const id = this.nextId++;
    const promise = new Promise<JobResult>((resolve, reject) => {
      this.queue.push({ id, job, transfer, onProgress, resolve, reject });
    });
    this.pump();
    return { id, promise };
  }

  /** Drops a queued task, or stops the worker running it. */
  cancel(id: number) {
    const queued = this.queue.findIndex((t) => t.id === id);
    if (queued >= 0) {
      this.queue[queued].reject(new DOMException('Cancelled', 'AbortError'));
      this.queue.splice(queued, 1);
      return;
    }
    const slot = this.slots.find((s) => s.task?.id === id);
    if (slot) {
      slot.task!.reject(new DOMException('Cancelled', 'AbortError'));
      this.replace(slot);
    }
  }

  cancelAll() {
    for (const t of this.queue) t.reject(new DOMException('Cancelled', 'AbortError'));
    this.queue = [];
    for (const slot of this.slots) {
      if (slot.task) {
        slot.task.reject(new DOMException('Cancelled', 'AbortError'));
        this.replace(slot);
      }
    }
  }

  private replace(slot: Slot) {
    slot.worker.terminate();
    slot.task = null;
    slot.worker = this.spawn(slot);
    this.pump();
  }

  private spawn(slot: Slot): Worker {
    const worker = createWorker();
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      const task = slot.task;
      if (!task || task.id !== msg.id) return;
      if (msg.kind === 'progress') {
        task.onProgress?.(msg.value);
        return;
      }
      slot.task = null;
      if (msg.kind === 'done') task.resolve(msg.result);
      else task.reject(new EngineError(msg.code, msg.detail));
      this.pump();
    };
    // A crash (e.g. out of memory on a huge file) only fails the current task.
    worker.onerror = (e) => {
      e.preventDefault();
      const task = slot.task;
      if (task) task.reject(new EngineError('failed', e.message));
      this.replace(slot);
    };
    return worker;
  }

  private pump() {
    while (this.queue.length) {
      let slot = this.slots.find((s) => !s.task);
      if (!slot && this.slots.length < this.size) {
        slot = { worker: null as unknown as Worker, task: null };
        slot.worker = this.spawn(slot);
        this.slots.push(slot);
      }
      if (!slot) return;
      const task = this.queue.shift()!;
      slot.task = task;
      const req = { ...task.job, id: task.id } as WorkerRequest;
      slot.worker.postMessage(req, task.transfer);
    }
  }
}

function defaultPoolSize(): number {
  if (typeof navigator === 'undefined') return 1;
  const nav = navigator as Navigator & { deviceMemory?: number };
  // Leave a core for the UI; cap memory use on big batches.
  let size = Math.min(4, (nav.hardwareConcurrency || 2) - 1);
  // Phones and tablets get far less memory per tab (iOS reloads a tab that
  // goes over its limit), and a 24 MP photo needs ~100 MB per copy.
  // iPadOS reports a Mac user agent; touch support gives it away.
  const mobile =
    /Android|iPhone|iPad|iPod/i.test(nav.userAgent) ||
    (/Macintosh/.test(nav.userAgent) && nav.maxTouchPoints > 1);
  if (mobile) size = Math.min(size, 2);
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) size = 1;
  else if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) size = Math.min(size, 2);
  return Math.max(1, size);
}
