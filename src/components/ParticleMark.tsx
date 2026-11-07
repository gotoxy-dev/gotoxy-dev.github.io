import { useEffect, useRef } from 'react'
import { tokens } from '@/theme/tokens'
import { prefersReducedMotion } from '@/theme/motion'
import { LOGO_MARK_PATHS } from './Logo'
import { createDotRenderer, DOT_STRIDE } from './particleRenderer'

interface Props {
  className?: string
  /** Called once the first frame has been drawn. */
  onReady?: () => void
}

const P = tokens.particles
const TAU = Math.PI * 2
/** Logo viewBox side, visual centre and height of the mark (y 14 → 112), in viewBox units. */
const VIEWBOX = 128
const CENTER_X = 62.5
const CENTER_Y = 63
const MARK_HEIGHT = 98
/** Mask resolution used to sample the mark (px per viewBox unit). */
const MASK_RES = 4
/** Directions probed around an edge point to find its outward normal. */
const NORMAL_PROBES = 16
/** Perspective of the former pre-rendered frames: focal length and camera distance, × square side. */
const FOCAL = 1.6
const CAMERA_PUSH = 0.4
/** Pointer velocity starts fading when no move event arrived for this long (ms). */
const POINTER_IDLE_MS = 40
/** Below these values the scene is at rest and the loop stops until the next input. */
const REST_SPEED = 0.5
const REST_ANGLE = 1e-4

const LIGHT = (() => {
  const l = [-0.4, -0.7, -0.6]
  const len = Math.hypot(l[0], l[1], l[2])
  return [l[0] / len, l[1] / len, l[2] / len] as const
})()

interface Cloud {
  count: number
  /** x, y, z per point, centred, in viewBox units. */
  pos: Float32Array
  /** Outward unit normal per point. */
  nrm: Float32Array
  mass: Float32Array
}

/** Small seeded PRNG so the cloud looks the same on every load. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Samples the logo mark as an extruded solid: a jittered grid fills the front
 * and back faces, and grid points on the outline are repeated through the depth
 * to build the side walls.
 */
function sampleMark(step: number): Cloud {
  const side = VIEWBOX * MASK_RES
  const mask = document.createElement('canvas')
  mask.width = mask.height = side
  const mctx = mask.getContext('2d', { willReadFrequently: true })
  if (!mctx) return { count: 0, pos: new Float32Array(), nrm: new Float32Array(), mass: new Float32Array() }
  mctx.scale(MASK_RES, MASK_RES)
  for (const d of LOGO_MARK_PATHS) mctx.fill(new Path2D(d))
  const alpha = mctx.getImageData(0, 0, side, side).data

  const inside = (x: number, y: number) => {
    const px = Math.round(x * MASK_RES)
    const py = Math.round(y * MASK_RES)
    return px >= 0 && py >= 0 && px < side && py < side && alpha[(py * side + px) * 4 + 3] > 127
  }

  const rnd = seeded(7)
  const pos: number[] = []
  const nrm: number[] = []
  const half = P.depth / 2
  const layers = Math.max(2, Math.round(P.depth / step))
  const add = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
    pos.push(x - CENTER_X, y - CENTER_Y, z)
    nrm.push(nx, ny, nz)
  }

  for (let gy = step / 2; gy < VIEWBOX; gy += step) {
    for (let gx = step / 2; gx < VIEWBOX; gx += step) {
      if (!inside(gx, gy)) continue
      const jx = gx + (rnd() - 0.5) * step * P.jitter
      const jy = gy + (rnd() - 0.5) * step * P.jitter
      const [x, y] = inside(jx, jy) ? [jx, jy] : [gx, gy]
      add(x, y, -half, 0, 0, -1)
      add(x, y, half, 0, 0, 1)

      const edge = !inside(gx + step, gy) || !inside(gx - step, gy) || !inside(gx, gy + step) || !inside(gx, gy - step)
      if (!edge) continue
      let nx = 0
      let ny = 0
      for (let k = 0; k < NORMAL_PROBES; k++) {
        const a = (k / NORMAL_PROBES) * TAU
        if (!inside(x + Math.cos(a) * step * 1.5, y + Math.sin(a) * step * 1.5)) {
          nx += Math.cos(a)
          ny += Math.sin(a)
        }
      }
      const len = Math.hypot(nx, ny) || 1
      for (let k = 1; k < layers; k++) {
        const z = -half + (P.depth * k) / layers + (rnd() - 0.5) * (P.depth / layers) * P.jitter
        add(x, y, z, nx / len, ny / len, 0)
      }
    }
  }

  const count = pos.length / 3
  const mass = new Float32Array(count)
  for (let i = 0; i < count; i++) mass[i] = P.massMin + rnd() * (P.massMax - P.massMin)
  return { count, pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), mass }
}

/** Shortest signed angle from `a` to `b`. */
const angleDelta = (a: number, b: number) => {
  const d = (((b - a) % TAU) + TAU) % TAU
  return d > Math.PI ? d - TAU : d
}

/**
 * The brand "G" as a live 3D particle cloud behind the hero headline.
 *  - Pointer X turns it (same mapping as the former image sequence: one full
 *    turn across the viewport), through a rotation spring with inertia.
 *  - Every point hangs on a spring at its place on the G. The pointer drags
 *    nearby points along with its velocity and pushes them outwards in
 *    proportion to its speed, so a slow pass barely ripples the surface and a
 *    fast swipe scatters it; heavier points react less and settle later.
 *  - Air drag makes points trail behind when the G spins fast.
 *  - Touch devices auto-rotate; reduced motion keeps the pointer rotation only,
 *    without inertia, intro or particle physics.
 */
export function ParticleMark({ className, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const canvas = canvasRef.current
    const renderer = canvas && createDotRenderer(canvas, tokens.color.heroParticle)
    if (!canvas || !renderer) return

    const reduced = prefersReducedMotion()
    const touch = window.matchMedia('(hover: none)').matches
    const cloud = sampleMark(touch ? P.stepTouch : P.step)
    const n = cloud.count
    const { pos, nrm, mass } = cloud

    // per-point state, in canvas CSS px
    const px = new Float32Array(n)
    const py = new Float32Array(n)
    const vx = new Float32Array(n)
    const vy = new Float32Array(n)
    const hx = new Float32Array(n)
    const hy = new Float32Array(n)
    const dots = new Float32Array(n * DOT_STRIDE)

    let width = 0
    let height = 0
    let side = 0
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

    const pointer = { inside: false, x: 0, y: 0, vx: 0, vy: 0, t: 0 }

    const schedule = () => {
      if (!raf && visible && side > 0) raf = requestAnimationFrame(frame)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      renderer.resize(width, height, dpr)
      side = Math.min(width, height)
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
      if (touch && !reduced) target += P.autoRotate * dt
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
      const cx = width / 2
      const cy = height / 2

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

      // keep animating while anything moves; touch devices spin forever
      const resting =
        fastest < REST_SPEED && speed < 1 && Math.abs(diff) < REST_ANGLE && Math.abs(angVel) < REST_ANGLE
      if (!reduced && (touch || !resting)) schedule()
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
      // one full turn across the viewport; moving right turns the G backwards
      if (e.pointerType !== 'touch') target = -TAU * (e.clientX / window.innerWidth)
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
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove as EventListener)
      host.removeEventListener('pointerleave', onLeave)
      sizeObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
