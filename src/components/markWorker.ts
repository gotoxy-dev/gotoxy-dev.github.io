/**
 * Samples the particle mark off the main thread (see markCloud.ts): the distance field and the
 * point scatter take a few hundred milliseconds, which would otherwise freeze the page as the
 * hero mounts.
 */
import { sampleMark, type MarkVariant } from './markSampling'

interface Request {
  id: number
  step: number
  variant: MarkVariant
}

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null
  postMessage: (message: unknown, transfer: Transferable[]) => void
}

scope.onmessage = ({ data }) => {
  const cloud = sampleMark(data.step, data.variant)
  scope.postMessage({ id: data.id, cloud }, [cloud.pos.buffer, cloud.nrm.buffer, cloud.mass.buffer])
}
