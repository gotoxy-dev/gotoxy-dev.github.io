import { tokens } from '@/theme/tokens'
import { LOGO_MARK_PATHS } from './logoMark'

/**
 * Point clouds of the brand "G" as a 3D solid, for ParticleMark.
 *
 *  - `grid`: jittered grid on the faces, grid outline repeated through the depth (the first hero).
 *  - `contour`: the same slab, but the walls follow the real outline of the logo and the faces
 *    are filled evenly without rows or columns.
 *  - `pillow`: the edge rolls from the faces into the walls (a rounded profile), so the light
 *    slides over the curves instead of breaking on sharp edges. The hero's (ParticleMark default).
 *  - `rings`: no fill; lines of points parallel to the outline on both faces, plus the outer
 *    outline through the depth.
 *
 * Every variant but `grid` reads a distance field of the logo mask: the distance from each
 * point to the outline gives the walls, the rounded profile and the rings, and its gradient
 * gives the outward normals. The mask and the field are computed once and kept.
 *
 * Runs in the page or in a Web Worker (markWorker.ts): it only needs a 2D canvas, an
 * OffscreenCanvas where there is no document.
 */
export type MarkVariant = 'grid' | 'contour' | 'pillow' | 'rings'

export interface Cloud {
  count: number
  /** x, y, z per point, centred, in viewBox units. */
  pos: Float32Array
  /** Outward unit normal per point. */
  nrm: Float32Array
  mass: Float32Array
}

/** Height of the mark in viewBox units (y 14 → 112). */
export const MARK_HEIGHT = 98

const P = tokens.particles
const TAU = Math.PI * 2
/** Logo viewBox side and visual centre of the mark, in viewBox units. */
const VIEWBOX = 128
const CENTER_X = 62.5
const CENTER_Y = 63
/** Mask resolution used to sample the mark (px per viewBox unit). */
const MASK_RES = 4
/** Directions probed around an edge point to find its outward normal (grid variant). */
const NORMAL_PROBES = 16
/** Cell size (viewBox units) of the fine scatter used for walls, bevels and rings. */
const FINE_CELL = 0.3
/** Squared distance standing for "far inside" in the distance transform. */
const FAR = 1e20

const EMPTY: Cloud = { count: 0, pos: new Float32Array(), nrm: new Float32Array(), mass: new Float32Array() }

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

/** Alpha channel of the logo mark drawn at MASK_RES px per unit. */
function rasterize(): Uint8ClampedArray | null {
  const side = VIEWBOX * MASK_RES
  const mask: OffscreenCanvas | HTMLCanvasElement =
    typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(side, side) : document.createElement('canvas')
  mask.width = mask.height = side
  const mctx = mask.getContext('2d', { willReadFrequently: true }) as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null
  if (!mctx) return null
  mctx.scale(MASK_RES, MASK_RES)
  for (const d of LOGO_MARK_PATHS) mctx.fill(new Path2D(d))
  return mctx.getImageData(0, 0, side, side).data
}

/** Collects points and normals, centred on the mark. */
function collector() {
  const pos: number[] = []
  const nrm: number[] = []
  return {
    add(x: number, y: number, z: number, nx: number, ny: number, nz: number) {
      pos.push(x - CENTER_X, y - CENTER_Y, z)
      nrm.push(nx, ny, nz)
    },
    done(rnd: () => number): Cloud {
      const count = pos.length / 3
      const mass = new Float32Array(count)
      for (let i = 0; i < count; i++) mass[i] = P.massMin + rnd() * (P.massMax - P.massMin)
      return { count, pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), mass }
    },
  }
}

/**
 * The hero's sampler: a jittered grid fills the front and back faces, and grid points on the
 * outline are repeated through the depth to build the side walls.
 */
function sampleGrid(alpha: Uint8ClampedArray, step: number): Cloud {
  const side = VIEWBOX * MASK_RES
  const inside = (x: number, y: number) => {
    const px = Math.round(x * MASK_RES)
    const py = Math.round(y * MASK_RES)
    return px >= 0 && py >= 0 && px < side && py < side && alpha[(py * side + px) * 4 + 3] > 127
  }

  const rnd = seeded(7)
  const out = collector()
  const half = P.depth / 2
  const layers = Math.max(2, Math.round(P.depth / step))

  for (let gy = step / 2; gy < VIEWBOX; gy += step) {
    for (let gx = step / 2; gx < VIEWBOX; gx += step) {
      if (!inside(gx, gy)) continue
      const jx = gx + (rnd() - 0.5) * step * P.jitter
      const jy = gy + (rnd() - 0.5) * step * P.jitter
      const [x, y] = inside(jx, jy) ? [jx, jy] : [gx, gy]
      out.add(x, y, -half, 0, 0, -1)
      out.add(x, y, half, 0, 0, 1)

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
        out.add(x, y, z, nx / len, ny / len, 0)
      }
    }
  }
  return out.done(rnd)
}

/** Exact 1D squared distance transform (Felzenszwalb & Huttenlocher). */
function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
  }
}

/** Distance (viewBox units) from every inside pixel of the mask to the outline; 0 outside. */
interface Field {
  dist(x: number, y: number): number
  /** Outward unit normal of the outline nearest to (x, y). */
  normal(x: number, y: number): [number, number]
}

function distanceField(alpha: Uint8ClampedArray): Field {
  const side = VIEWBOX * MASK_RES
  const grid = new Float64Array(side * side)
  for (let i = 0; i < grid.length; i++) grid[i] = alpha[i * 4 + 3] > 127 ? FAR : 0

  const f = new Float64Array(side)
  const d = new Float64Array(side)
  const v = new Int32Array(side)
  const z = new Float64Array(side + 1)
  for (let x = 0; x < side; x++) {
    for (let y = 0; y < side; y++) f[y] = grid[y * side + x]
    edt1d(f, side, d, v, z)
    for (let y = 0; y < side; y++) grid[y * side + x] = d[y]
  }
  for (let y = 0; y < side; y++) {
    const row = y * side
    for (let x = 0; x < side; x++) f[x] = grid[row + x]
    edt1d(f, side, d, v, z)
    for (let x = 0; x < side; x++) grid[row + x] = d[x]
  }

  const dist = new Float32Array(side * side)
  for (let i = 0; i < dist.length; i++) dist[i] = Math.sqrt(grid[i]) / MASK_RES

  const at = (x: number, y: number) => {
    const px = Math.round(x * MASK_RES)
    const py = Math.round(y * MASK_RES)
    return px >= 0 && py >= 0 && px < side && py < side ? dist[py * side + px] : 0
  }
  const h = 0.75
  return {
    dist: at,
    normal(x, y) {
      // the distance grows inwards: the outline normal points down its gradient
      const gx = at(x - h, y) - at(x + h, y)
      const gy = at(x, y - h) - at(x, y + h)
      const len = Math.hypot(gx, gy) || 1
      return [gx / len, gy / len]
    },
  }
}

/**
 * Stratified scatter: one random candidate per cell; `density(d)` is the expected number of
 * points the cell keeps (fractions are kept at random), each at its own random spot.
 */
function scatter(
  field: Field,
  cell: number,
  rnd: () => number,
  density: (d: number) => number,
  emit: (x: number, y: number, d: number) => void,
) {
  for (let cy = 0; cy < VIEWBOX; cy += cell) {
    for (let cx = 0; cx < VIEWBOX; cx += cell) {
      // cells on the outline have their centre outside (d = 0): they still draw candidates,
      // and only the ones that land inside are kept
      const n = density(field.dist(cx + cell / 2, cy + cell / 2))
      let k = Math.floor(n)
      if (rnd() < n - k) k++
      for (let i = 0; i < k; i++) {
        const x = cx + rnd() * cell
        const y = cy + rnd() * cell
        const d = field.dist(x, y)
        if (d > 0) emit(x, y, d)
      }
    }
  }
}

/** Faces filled evenly: one point per step-sized cell, anywhere inside it (no rows or columns). */
function fillFaces(field: Field, step: number, rnd: () => number, z: number, keep: (d: number) => boolean, out: ReturnType<typeof collector>) {
  scatter(field, step, rnd, (d) => (keep(d) ? 1 : 0), (x, y, d) => {
    if (keep(d)) out.add(x, y, z, 0, 0, Math.sign(z))
  })
}

/** Side wall on the real outline, `height` tall around z = 0, at the faces' density. */
function wall(field: Field, step: number, rnd: () => number, height: number, out: ReturnType<typeof collector>) {
  if (height <= 0) return
  const band = P.wallBand
  // points per unit of outline: height / step² ; the band is `band` wide
  const perCell = ((FINE_CELL * FINE_CELL) / band) * (height / (step * step))
  scatter(field, FINE_CELL, rnd, (d) => (d < band ? perCell : 0), (x, y, d) => {
    if (d >= band) return
    const [nx, ny] = field.normal(x, y)
    out.add(x, y, (rnd() - 0.5) * height, nx, ny, 0)
  })
}

function sampleContour(field: Field, step: number): Cloud {
  const rnd = seeded(11)
  const out = collector()
  const half = P.depth / 2
  fillFaces(field, step, rnd, -half, () => true, out)
  fillFaces(field, step, rnd, half, () => true, out)
  wall(field, step, rnd, P.depth, out)
  return out.done(rnd)
}

function samplePillow(field: Field, step: number): Cloud {
  const rnd = seeded(13)
  const out = collector()
  const half = P.depth / 2
  const r = Math.min(half, half * P.bevel)
  const flat = half - r // straight part of the wall, above and below the middle
  fillFaces(field, step, rnd, -half, (d) => d >= r, out)
  fillFaces(field, step, rnd, half, (d) => d >= r, out)
  wall(field, step, rnd, flat * 2, out)

  // Rounded edge: a quarter circle of radius r rolls from each face into the wall. Seen from
  // the front it gets steep near the outline, so it takes more points there (by its slope).
  const base = (FINE_CELL * FINE_CELL) / (step * step)
  const slope = (d: number) => r / Math.max(r / P.bevelMaxSlope, Math.sqrt(Math.max(0, r * r - (r - d) * (r - d))))
  scatter(field, FINE_CELL, rnd, (d) => (d < r ? base * slope(d) : 0), (x, y, d) => {
    if (d >= r) return
    const lift = Math.sqrt(Math.max(0, r * r - (r - d) * (r - d))) // 0 on the outline, r where the face starts
    const tilt = (r - d) / r // how much the surface faces outwards
    const facing = Math.sqrt(1 - tilt * tilt)
    const [nx, ny] = field.normal(x, y)
    for (const s of [-1, 1]) out.add(x, y, s * (flat + lift), nx * tilt, ny * tilt, s * facing)
  })
  return out.done(rnd)
}

function sampleRings(field: Field): Cloud {
  const rnd = seeded(17)
  const out = collector()
  const half = P.depth / 2
  const width = P.ringWidth
  const ringOf = (d: number) => {
    const k = Math.round((d - width) / P.ringGap)
    return k >= 0 && Math.abs(d - width - k * P.ringGap) < width / 2 ? k : -1
  }
  // points along a ring every `ringSpacing`; the ring is `width` wide
  const perCell = (FINE_CELL * FINE_CELL) / (width * P.ringSpacing)
  scatter(field, FINE_CELL, rnd, (d) => (ringOf(d) >= 0 ? perCell : 0), (x, y, d) => {
    const k = ringOf(d)
    if (k < 0) return
    out.add(x, y, -half, 0, 0, -1)
    out.add(x, y, half, 0, 0, 1)
    if (k > 0) return
    // the outer ring also runs through the depth, so the turning G keeps its sides
    const [nx, ny] = field.normal(x, y)
    const layers = Math.max(2, Math.round(P.depth / P.ringGap))
    for (let i = 1; i < layers; i++) out.add(x, y, -half + (P.depth * i) / layers, nx, ny, 0)
  })
  return out.done(rnd)
}

let maskCache: Uint8ClampedArray | null = null
let fieldCache: Field | null = null

export function sampleMark(step: number, variant: MarkVariant = 'pillow'): Cloud {
  const alpha = (maskCache ??= rasterize())
  if (!alpha) return EMPTY
  if (variant === 'grid') return sampleGrid(alpha, step)
  const field = (fieldCache ??= distanceField(alpha))
  if (variant === 'contour') return sampleContour(field, step)
  if (variant === 'pillow') return samplePillow(field, step)
  return sampleRings(field)
}
