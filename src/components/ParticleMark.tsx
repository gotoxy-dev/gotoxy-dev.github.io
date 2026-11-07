import { useEffect, useRef } from 'react'
import { tokens } from '@/theme/tokens'
import { prefersReducedMotion } from '@/theme/motion'
import { requestCloud } from './markCloud'
import { MARK_HEIGHT, type MarkVariant } from './markSampling'
import { createDotRenderer, DOT_STRIDE } from './particleRenderer'

interface Props {
  className?: string
  /** How the mark is sampled into points (see markSampling.ts); the hero uses the default. */
  variant?: MarkVariant
  /** Keep turning on its own, as on touch devices (design previews). */
  autoRotate?: boolean
  /**
   * Size the mark by the viewport height and centre it in the visible part of its canvas
   * (the hero canvas is taller than the screen); otherwise it fills the canvas.
   */
  fitViewport?: boolean
  /** Called once the first frame has been drawn. */
  onReady?: () => void
}

const P = tokens.particles
const TAU = Math.PI * 2
/** Perspective of the former pre-rendered frames: focal length and camera distance, × square side. */
const FOCAL = 1.6
const CAMERA_PUSH = 0.4
/** Pointer velocity starts fading when no move event arrived for this long (ms). */
const POINTER_IDLE_MS = 40
/** Below these values the scene is at rest and the loop stops until the next input. */
const REST_SPEED = 0.5
const REST_ANGLE = 1e-4
/** Half the drawn mark's height (with the tilt and a margin), as a fraction of its box. */
const MARK_REACH = 0.42
/** The mark is sampled again when its size changes the point step by more than this. */
const RESAMPLE_CHANGE = 0.2

const LIGHT = (() => {
  const l = [-0.4, -0.7, -0.6]
  const len = Math.hypot(l[0], l[1], l[2])
  return [l[0] / len, l[1] / len, l[2] / len] as const
})()

/** Shortest signed angle from `a` to `b`. */
const angleDelta = (a: number, b: number) => {
  const d = (((b - a) % TAU) + TAU) % TAU
  return d > Math.PI ? d - TAU : d
}

/**
 * The brand "G" as a live 3D particle cloud behind the hero headline.
 *  - Pointer X turns it (one full turn across the viewport, facing the viewer
 *    with the pointer in the middle), through a rotation spring with inertia.
 *  - Its points keep the same on-screen spacing at any size (see `rebuild`).
 *  - Every point hangs on a spring at its place on the G. The pointer drags
 *    nearby points along with its velocity and pushes them outwards in
 *    proportion to its speed, so a slow pass barely ripples the surface and a
 *    fast swipe scatters it; heavier points react less and settle later.
 *  - Air drag makes points trail behind when the G spins fast.
 *  - Touch devices auto-rotate; reduced motion keeps the pointer rotation only,
 *    without inertia, intro or particle physics.
 */
export function ParticleMark({ className, onReady, variant = 'pillow', autoRotate = false, fitViewport = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const canvas = canvasRef.current
    const renderer = canvas && createDotRenderer(canvas, tokens.color.heroParticle)
    if (!canvas || !renderer) return

    const reduced = prefersReducedMotion()
    const touch = window.matchMedia('(hover: none)').matches
    const spinning = touch || autoRotate

    // the cloud and its per-point state (canvas CSS px), rebuilt when the mark's size changes a lot
    let n = 0
    let pos: Float32Array = new Float32Array()
    let nrm: Float32Array = new Float32Array()
    let mass: Float32Array = new Float32Array()
    let px = new Float32Array()
    let py = new Float32Array()
    let vx = new Float32Array()
    let vy = new Float32Array()
    let hx = new Float32Array()
    let hy = new Float32Array()
    let dots = new Float32Array()
    let cloudStep = 0

    let width = 0
    let height = 0
    /** Side of the square box the mark is drawn in, and its centre in the canvas. */
    let side = 0
    let cx = 0
    let cy = 0
    let rect = canvas.getBoundingClientRect()
    let placed = false // home positions known
    let intro = !reduced
    let angle = reduced ? 0 : P.introAngle
    let angVel = 0
    let target = 0
    let raf = 0
    let last = 0
    let visible = true
    let ready = false
    let disposed = false

    const pointer = { inside: false, x: 0, y: 0, vx: 0, vy: 0, t: 0 }

    const schedule = () => {
      if (!raf && visible && side > 0 && n > 0) raf = requestAnimationFrame(frame)
    }

    /**
     * Samples the mark so its points sit `spacing` px apart on screen at this box size, the
     * same grain at any size (a bigger mark gets more points, not sparser ones).
     */
    const rebuild = (box: number) => {
      const unitPx = ((box * P.fill) / MARK_HEIGHT) * (FOCAL / (FOCAL + CAMERA_PUSH))
      const spacing = touch ? P.spacingTouch : P.spacing
      const step = Math.min(P.stepMax, Math.max(P.stepMin, spacing / unitPx))
      if (cloudStep && Math.abs(step - cloudStep) / cloudStep < RESAMPLE_CHANGE) return
      cloudStep = step
      // sampled off the main thread; the old cloud keeps drawing until the new one arrives
      requestCloud(step, variant).then((cloud) => {
        if (disposed || step !== cloudStep) return
        n = cloud.count
        ;({ pos, nrm, mass } = cloud)
        px = new Float32Array(n)
        py = new Float32Array(n)
        vx = new Float32Array(n)
        vy = new Float32Array(n)
        hx = new Float32Array(n)
        hy = new Float32Array(n)
        dots = new Float32Array(n * DOT_STRIDE)
        placed = false
        schedule()
      })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      renderer.resize(width, height, dpr)
      let box = Math.min(width, height)
      cx = width / 2
      cy = height / 2
      if (fitViewport) {
        box = Math.min(box, window.innerHeight * P.viewportFit)
        if (height > box) {
          // centre on the visible part of the screen, without leaving the canvas
          const want = window.innerHeight * P.viewportCenter - (rect.top + window.scrollY)
          const reach = box * MARK_REACH
          cy = Math.min(height - reach, Math.max(reach, want))
        }
      }
      side = box
      if (side > 0) rebuild(side)
      placed = false // snap every point to its new home
      schedule()
    }

    function frame(t: number) {
      raf = 0
      const dt = last ? Math.min(1 / 30, Math.max(1 / 240, (t - last) / 1000)) : 1 / 60
      last = t

      // pointer velocity fades out once the pointer stops sending moves
      if (t - pointer.t > POINTER_IDLE_MS) {
        const k = Math.exp(-P.pointerDecay * dt)
        pointer.vx *= k
        pointer.vy *= k
      }

      // rotation
      if (spinning && !reduced) target += P.autoRotate * dt
      const diff = angleDelta(angle, target)
      if (reduced) {
        angle = target
        angVel = 0
      } else {
        angVel += (P.spin * diff - P.spinDamping * angVel) * dt
        angle += angVel * dt
      }

      const cA = Math.cos(angle)
      const sA = Math.sin(angle)
      const cT = Math.cos(P.tilt)
      const sT = Math.sin(P.tilt)
      const unit = (side * P.fill) / MARK_HEIGHT
      const focal = FOCAL * side
      const push = CAMERA_PUSH * side
      const dotScale = P.dotSize / (focal / (focal + push))

      const radius = P.radius * side
      const radius2 = radius * radius
      const maxOffset = P.maxOffset * side
      const speed = Math.hypot(pointer.vx, pointer.vy)
      const stirring = !reduced && pointer.inside && speed > 1
      const mx = pointer.x - rect.left
      const my = pointer.y - rect.top
      const alphaSpan = P.alphaMax - P.alphaMin
      let fastest = 0

      for (let i = 0; i < n; i++) {
        const j = i * 3
        // rotate (Y spin, then forward tilt) and project the point's home
        const x0 = pos[j] * unit
        const y0 = pos[j + 1] * unit
        const z0 = pos[j + 2] * unit
        const x1 = x0 * cA + z0 * sA
        const z1 = -x0 * sA + z0 * cA
        const y2 = y0 * cT - z1 * sT
        const z2 = y0 * sT + z1 * cT
        const s = focal / (focal + z2 + push)
        const homeX = cx + x1 * s
        const homeY = cy + y2 * s

        if (!placed) {
          const a = Math.random() * TAU
          const r = intro ? Math.sqrt(Math.random()) * P.introScatter * side : 0
          px[i] = homeX + Math.cos(a) * r
          py[i] = homeY + Math.sin(a) * r
          vx[i] = 0
          vy[i] = 0
          hx[i] = homeX
          hy[i] = homeY
        }

        if (reduced) {
          px[i] = homeX
          py[i] = homeY
        } else {
          const hvx = (homeX - hx[i]) / dt
          const hvy = (homeY - hy[i]) / dt
          const m = mass[i]
          let ax = -P.stiffness * (px[i] - homeX) - P.damping * (vx[i] - hvx) - P.airDrag * vx[i]
          let ay = -P.stiffness * (py[i] - homeY) - P.damping * (vy[i] - hvy) - P.airDrag * vy[i]
          if (stirring) {
            const dx = px[i] - mx
            const dy = py[i] - my
            const d2 = dx * dx + dy * dy
            if (d2 < radius2) {
              const d = Math.sqrt(d2) || 1
              const fall = (1 - d / radius) * (1 - d / radius)
              ax += P.flow * fall * (pointer.vx - vx[i]) + (dx / d) * speed * P.push * fall
              ay += P.flow * fall * (pointer.vy - vy[i]) + (dy / d) * speed * P.push * fall
            }
          }
          vx[i] += (ax / m) * dt
          vy[i] += (ay / m) * dt
          px[i] += vx[i] * dt
          py[i] += vy[i] * dt

          const ox = px[i] - homeX
          const oy = py[i] - homeY
          const off = Math.hypot(ox, oy)
          if (off > maxOffset) {
            px[i] = homeX + (ox / off) * maxOffset
            py[i] = homeY + (oy / off) * maxOffset
          }
        }
        hx[i] = homeX
        hy[i] = homeY

        // shading: key light on the rotated normal, dimmer when the face looks away
        const nx = nrm[j]
        const ny = nrm[j + 1]
        const nz = nrm[j + 2]
        const nx1 = nx * cA + nz * sA
        const nz1 = -nx * sA + nz * cA
        const ny2 = ny * cT - nz1 * sT
        const nz2 = ny * sT + nz1 * cT
        const lambert = Math.max(0, nx1 * LIGHT[0] + ny2 * LIGHT[1] + nz2 * LIGHT[2])
        let alpha = P.alphaMin + alphaSpan * (0.2 + 0.8 * lambert)
        if (nz2 > 0) alpha *= P.backFace
        const rel = Math.hypot(vx[i], vy[i])
        if (rel > fastest) fastest = rel
        alpha += P.glow * Math.min(1, rel / P.glowSpeed)
        const k = i * DOT_STRIDE
        dots[k] = px[i]
        dots[k + 1] = py[i]
        dots[k + 2] = Math.min(1, alpha)
        dots[k + 3] = dotScale * s
      }
      placed = true
      intro = false

      renderer!.draw(dots, n)

      if (!ready) {
        ready = true
        onReadyRef.current?.()
      }

      // keep animating while anything moves; touch devices and previews spin forever
      const resting =
        fastest < REST_SPEED && speed < 1 && Math.abs(diff) < REST_ANGLE && Math.abs(angVel) < REST_ANGLE
      if (!reduced && (spinning || !resting)) schedule()
      else last = 0
    }

    const onMove = (e: PointerEvent) => {
      if (pointer.t && e.pointerType !== 'touch') {
        const dt = Math.max(1, e.timeStamp - pointer.t) / 1000
        // smoothed, clamped pointer velocity (px/s)
        let ivx = 0.6 * pointer.vx + 0.4 * ((e.clientX - pointer.x) / dt)
        let ivy = 0.6 * pointer.vy + 0.4 * ((e.clientY - pointer.y) / dt)
        const sp = Math.hypot(ivx, ivy)
        if (sp > P.maxPointerSpeed) {
          ivx *= P.maxPointerSpeed / sp
          ivy *= P.maxPointerSpeed / sp
        }
        pointer.vx = ivx
        pointer.vy = ivy
      }
      pointer.inside = true
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.t = e.timeStamp
      rect = canvas.getBoundingClientRect()
      // one full turn across the viewport: the G faces the viewer with the pointer in the middle,
      // and moving right turns it backwards
      if (e.pointerType !== 'touch' && !autoRotate) target = -TAU * (e.clientX / window.innerWidth - 0.5)
      schedule()
    }
    const onLeave = () => {
      pointer.inside = false
      pointer.t = 0
    }

    const host = canvas.closest('section') ?? window
    host.addEventListener('pointermove', onMove as EventListener, { passive: true })
    host.addEventListener('pointerleave', onLeave)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)
    // the viewport height sizes the mark even when the canvas keeps its size
    if (fitViewport) window.addEventListener('resize', resize)
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
        last = 0
      }
    })
    viewObserver.observe(canvas)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove as EventListener)
      host.removeEventListener('pointerleave', onLeave)
      sizeObserver.disconnect()
      viewObserver.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [variant, autoRotate, fitViewport])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
