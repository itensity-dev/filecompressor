/// <reference lib="webworker" />
// Processing worker: every byte of user data is handled here, on the user's
// own device. Nothing is sent over the network (the site's CSP forbids it).

import { EngineError, type JobResult, type WorkerRequest, type WorkerResponse } from './types';

const scope = self as unknown as DedicatedWorkerGlobalScope;

function post(msg: WorkerResponse, transfer: Transferable[] = []) {
  scope.postMessage(msg, transfer);
}

async function run(req: WorkerRequest, progress: (v: number) => void): Promise<JobResult> {
  switch (req.type) {
    case 'image': {
      const { processImage } = await import('./image');
      return processImage(req.input, req.inFormat, req.options, progress);
    }
    case 'pdf-compress': {
      const { compressPdf } = await import('./pdf');
      return compressPdf(req.input, req.options, progress);
    }
    case 'images-to-pdf': {
      const { imagesToPdf } = await import('./pdf');
      return imagesToPdf(req.inputs, req.options, progress);
    }
  }
}

scope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const req = event.data;
  let last = 0;
  const progress = (value: number) => {
    // Throttle progress messages to meaningful steps.
    if (value - last >= 0.02 || value >= 1) {
      last = value;
      post({ id: req.id, kind: 'progress', value });
    }
  };
  try {
    const result = await run(req, progress);
    post({ id: req.id, kind: 'done', result }, [result.data]);
  } catch (e) {
    if (e instanceof EngineError) {
      post({ id: req.id, kind: 'error', code: e.code, detail: e.message });
    } else {
      const detail = e instanceof Error ? e.message : String(e);
      post({ id: req.id, kind: 'error', code: 'failed', detail });
    }
  }
};
