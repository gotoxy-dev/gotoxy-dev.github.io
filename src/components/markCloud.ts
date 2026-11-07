import { sampleMark, type Cloud, type MarkVariant } from './markSampling'

/**
 * Point clouds of the mark, sampled in one shared Web Worker (markWorker.ts) so the page never
 * freezes while they are built. Browsers without workers that can draw (no OffscreenCanvas)
 * sample on the main thread, one task later.
 */

let worker: Worker | null | undefined
let nextId = 1
const pending = new Map<number, { step: number; variant: MarkVariant; resolve: (cloud: Cloud) => void }>()

const sampleLater = (step: number, variant: MarkVariant, resolve: (cloud: Cloud) => void) =>
  setTimeout(() => resolve(sampleMark(step, variant)))

function getWorker(): Worker | null {
  if (worker !== undefined) return worker
  try {
    if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') throw new Error('no worker canvas')
    worker = new Worker(new URL('./markWorker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }: MessageEvent<{ id: number; cloud: Cloud }>) => {
      const request = pending.get(data.id)
      pending.delete(data.id)
      if (!request) return
      // an empty cloud means the worker could not draw the mask: try on the main thread
      if (data.cloud.count > 0) request.resolve(data.cloud)
      else sampleLater(request.step, request.variant, request.resolve)
    }
    worker.onerror = () => {
      // the worker failed (could not load or draw): sample on the main thread from now on
      worker?.terminate()
      worker = null
      pending.forEach(({ step, variant, resolve }) => sampleLater(step, variant, resolve))
      pending.clear()
    }
  } catch {
    worker = null
  }
  return worker
}

export function requestCloud(step: number, variant: MarkVariant): Promise<Cloud> {
  const w = getWorker()
  if (!w) return new Promise((resolve) => sampleLater(step, variant, resolve))
  const id = nextId++
  return new Promise((resolve) => {
    pending.set(id, { step, variant, resolve })
    w.postMessage({ id, step, variant })
  })
}
