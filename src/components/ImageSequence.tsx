import { useEffect, useRef } from 'react'

interface Props {
  dir: string
  ext: string
  frameCount: number
  pad?: number
  className?: string
  /** Called once the first frame has been drawn. */
  onReady?: () => void
}

/** Reference draws the first frame 100 ms after it loads. */
const FIRST_FRAME_DELAY_MS = 100

/**
 * Canvas image-sequence player, mirroring the reference hero behaviour:
 *  1. preloads all frames and draws the first one as soon as it is available,
 *  2. on pointer move over the hero section, maps pointer X to a frame index
 *     with the reference formula (direction inverted around the left edge,
 *     no easing, no intro playback).
 *
 * Drop your rendered frames in `public/<dir>/frame_001.<ext>` … and update `frameCount`.
 */
export function ImageSequence({ dir, ext, frameCount, pad = 3, className, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const images: HTMLImageElement[] = []
    let current = 0
    let disposed = false
    let firstTimer = 0

    const src = (i: number) => `${dir}/frame_${String(i + 1).padStart(pad, '0')}.${ext}`

    const draw = (index: number) => {
      const img = images[Math.max(0, Math.min(frameCount - 1, index))]
      if (!img || !img.complete || !img.naturalWidth) return
      const { width, height } = canvas.getBoundingClientRect()
      // "cover" fit
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(current)
    }

    /**
     * Reference mapping: the viewport is split into `frameCount` segments; the
     * pointer segment is mirrored so the first frame sits at the left edge and
     * the sequence runs backwards as the pointer moves right.
     */
    const frameForX = (x: number) => {
      const segment = Math.floor((x / window.innerWidth) * frameCount)
      return (frameCount - segment) % frameCount
    }

    const onMove = (e: PointerEvent) => {
      const next = frameForX(e.clientX)
      if (next === current) return
      current = next
      draw(current)
    }

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = src(i)
      images.push(img)
    }
    images[0].onload = () => {
      firstTimer = window.setTimeout(() => {
        if (disposed) return
        resize()
        onReady?.()
      }, FIRST_FRAME_DELAY_MS)
    }

    const host = canvas.closest('section') ?? window
    host.addEventListener('pointermove', onMove as EventListener, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      disposed = true
      window.clearTimeout(firstTimer)
      host.removeEventListener('pointermove', onMove as EventListener)
      window.removeEventListener('resize', resize)
    }
  }, [dir, ext, frameCount, pad, onReady])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
