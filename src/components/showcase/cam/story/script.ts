import { gsap } from '@/theme/motion'
import { tokens } from '@/theme/tokens'

/**
 * The story film's script: where every set stands in the 3D world, what the virtual camera does in
 * every shot, and the whip pans between sets. Everything is a pure function of the film's
 * time, so seeking, restarting and reduced-motion stills all land on the same frame.
 *
 * World units are em of the film viewport, where 1em = 1 % of the frame's width; the camera's
 * perspective is `layout.showcase.filmPerspective` em. A pose is the camera's target (x, y, z), its
 * distance from the target (`d`: at 0 the target plane is drawn 1:1, so text laid out at its
 * close-up size stays crisp and wider shots are downscales), its orbit (yaw, pitch, roll, degrees)
 * and the amount of hand-held shake. Shots aim at named focus points (`Focus`), measured on the
 * laid-out screens, so a push-in lands on the exact row, button or chart that tells the step.
 */

const M = tokens.motion.showcase
const L = tokens.layout.showcase

/** Segment starts (s): problem, signup, cross-check, campaigns, payments, reports, results, end */
export const SEG = M.filmSegmentsSec.reduce<number[]>((acc, sec) => [...acc, acc[acc.length - 1] + sec], [0])
export const TOTAL = SEG[SEG.length - 1]
export const SEGMENTS = M.filmSegmentsSec.length
const WHIP = M.filmWhipSec

/** Sets, one per segment, side by side so a whip pan travels from one to the next (the problem set holds five beats) */
const SET_X = [0, 1700, 2200, 2700, 3200, 3700, 4200]
export const setX = (i: number) => SET_X[i] ?? 0

/**
 * The x of the set nearest to `x`. The world is drawn relative to it every frame (sets at
 * `setX(i) - base`, camera at `x - base`), so its transforms stay in small numbers instead of tens
 * of thousands of px (coordinate hygiene; the unpainted-tiles fix is the flat world, Film.module.css).
 */
export const nearestSetX = (x: number) =>
  SET_X.reduce((best, sx) => (Math.abs(sx - x) < Math.abs(best - x) ? sx : best), SET_X[0])

export interface Vec {
  x: number
  y: number
  z: number
}

export interface Pose extends Vec {
  d: number
  yaw: number
  pitch: number
  roll: number
  shake: number
}

/** Named points of the film the camera aims at, measured on the screens once laid out */
export type FocusName =
  | 'sheet'
  | 'sheet-bad'
  | 'hook-group'
  | 'moodle'
  | 'moodle-submit'
  | 'paper'
  | 'versions'
  | 'signup-phone'
  | 'signup-submit'
  | 'students'
  | 'students-rows'
  | 'audit'
  | 'audit-flag'
  | 'assign'
  | 'assign-send'
  | 'campaign'
  | 'ring-all'
  | 'ring-hero'
  | 'payment'
  | 'pay-save'
  | 'pay-phone'
  | 'report'
  | 'report-chart'
  | 'incidents'
  | 'incidents-rows'
  | 'platform'

/** A focus point: its centre in the world and its size (world em) */
export interface Box extends Vec {
  w: number
  h: number
}
export type Focus = (name: FocusName) => Box

/**
 * The visible area of the frame below the title band, in world em (1em = 1 % of the frame's
 * width, so its width is always 100), and the height the results' stats band takes at the bottom.
 */
export interface View {
  height: number
  stats: number
}

interface Shot {
  start: number
  end: number
  from: Pose
  to: Pose
  ease: (p: number) => number
  /** Whip pans blur the lens */
  whip?: number
}

const ease = (name: string) => gsap.parseEase(name) as (p: number) => number
const none = (p: number) => p

/** A time inside segment `seg` */
const s = (seg: number, offset: number) => SEG[seg] + offset
/** The last `WHIP` seconds of a segment pan to the next set */
const whipStart = (seg: number) => SEG[seg + 1] - WHIP

const H = 0
const R = 1
const C = 2
const W = 3
const P = 4
const I = 5
const F = 6

/**
 * How the camera frames a focus: `k` scales the resting framing (1 = the box fits the view with
 * margin: about 62 % of the width or 88 % of the height under the title band, never above 1:1, so
 * text stays crisp); `d` overrides the distance. Offsets nudge the target.
 */
type Aim = Partial<Omit<Pose, 'x' | 'y' | 'z' | 'd'>> & { k?: number; d?: number; dx?: number; dy?: number; dz?: number; stats?: boolean; fitW?: number }

/** Share of the view a focus fills at rest */
const FIT_W = 0.62
const FIT_H = 0.88

function shotList(focus: Focus, view: View): Shot[] {
  const persp = L.filmPerspective
  const on = (name: FocusName, a: Aim = {}): Pose => {
    const box = focus(name)
    // results: keep the platform above the stats band (the target moves down, the content up)
    const height = a.stats ? view.height - view.stats : view.height
    const fit = Math.min(((a.fitW ?? FIT_W) * 100) / Math.max(1, box.w), (FIT_H * height) / Math.max(1, box.h))
    const scale = Math.min(1, fit * (a.k ?? 1))
    const d = a.d ?? persp / scale - persp
    const lift = a.stats ? view.stats / 2 / scale : 0
    return {
      x: box.x + (a.dx ?? 0),
      y: box.y + (a.dy ?? 0) + lift,
      z: box.z + (a.dz ?? 0),
      d,
      yaw: a.yaw ?? 0,
      pitch: a.pitch ?? 0,
      roll: a.roll ?? 0,
      shake: a.shake ?? 0,
    }
  }
  const crash = ease(M.filmCrashEase)
  const io = ease('power2.inOut')
  const out = ease('power2.out')
  const out3 = ease('power3.out')
  const io3 = ease('power3.inOut')
  const io1 = ease('power1.inOut')
  const shot = (start: number, end: number, from: Pose, to: Pose, e: (p: number) => number): Shot => ({ start, end, from, to, ease: e })
  /** Push in on a detail and back to the resting framing: in, a short hold, out (≤ 1.5 s close) */
  const detail = (at: number, rest: Pose, close: Pose, hold: number, back: Pose = rest): Shot[] => [
    shot(at, at + 0.45, rest, close, crash),
    shot(at + 0.45, at + 0.45 + hold, close, { ...close, d: close.d * 0.92 }, none),
    shot(at + 0.45 + hold, at + 0.95 + hold, { ...close, d: close.d * 0.92 }, back, io),
  ]

  // resting framings
  const sheet = on('sheet', { yaw: 4, pitch: -3, roll: -1, shake: 0.6 })
  const students = on('students', { yaw: 2 })
  const audit = on('audit', { yaw: -4, pitch: 4 })
  const assign = on('assign', { yaw: 6 })
  const payment = on('payment', { yaw: 2, pitch: -4 })
  const report = on('report', { yaw: 4 })
  const incidents = on('incidents', { yaw: 6 })

  const shots: Shot[] = [
    // 0 · problem, five beats: the hand-typed sheet and its bad cells, one WhatsApp at a time,
    // Moodle accounts by hand, payments on paper, copies of the list nobody can trace
    shot(0, 1.6, on('sheet', { k: 0.9, yaw: 10, pitch: -6, roll: -2, shake: 0.8 }), sheet, out),
    ...detail(1.6, sheet, on('sheet-bad', { k: 0.7, yaw: -4, shake: 0.4 }), 0.9),
    shot(3.4, 6.8, on('hook-group', { k: 0.92, yaw: -16, pitch: 4, roll: 2, shake: 0.6 }), on('hook-group', { yaw: -4, pitch: 1, shake: 0.6 }), io1),
    shot(6.8, 8.6, on('moodle', { k: 0.9, yaw: 14, pitch: -4, shake: 0.4 }), on('moodle', { yaw: 4, shake: 0.4 }), io),
    ...detail(8.6, on('moodle', { yaw: 4, shake: 0.4 }), on('moodle-submit', { k: 0.8, shake: 0.4 }), 0.6),
    shot(10.2, 13.2, on('paper', { k: 0.9, yaw: -10, pitch: -34, roll: -5, shake: 0.4 }), on('paper', { yaw: 6, pitch: -18, shake: 0.4 }), io),
    shot(13.2, whipStart(H), on('versions', { k: 0.92, yaw: -22, dy: -8, shake: 0.5 }), on('versions', { yaw: 12, dy: 6, shake: 0.5 }), io),
    // 1 · signup: the phone fills the form and sends it, the record lands in the students panel
    shot(s(R, 0), s(R, 2.4), on('signup-phone', { k: 0.94, yaw: -20, pitch: 3, roll: -2 }), on('signup-phone', { yaw: 8, pitch: -2, roll: 1 }), io),
    ...detail(s(R, 2.4), on('signup-phone', { yaw: 8, pitch: -2, roll: 1 }), on('signup-submit', { k: 0.85, yaw: 4 }), 0.6, on('students', { k: 0.9, yaw: -6 })),
    shot(s(R, 4.35), s(R, 7.6), on('students', { k: 0.9, yaw: -6 }), students, io),
    ...detail(s(R, 7.6), students, on('students-rows', { k: 0.85 }), 0.5),
    // 2 · cross-check: the commissions sort and the scan runs, push in on a flagged row turning green
    shot(s(C, 0), s(C, 3.4), on('audit', { k: 0.9, yaw: -16, pitch: 8 }), audit, io),
    ...detail(s(C, 3.4), audit, on('audit-flag', { k: 0.6 }), 1),
    shot(s(C, 5.35), whipStart(C), audit, on('audit', { k: 0.94, yaw: 8, pitch: -2 }), io),
    // 3 · campaigns: assign and send, the progress runs, the burst, a quick reveal, one student's phone
    shot(s(W, 0), s(W, 2.1), on('assign', { k: 0.9, yaw: -14, pitch: 3 }), assign, out),
    ...detail(s(W, 2.1), assign, on('assign-send', { k: 0.6 }), 0.4),
    shot(s(W, 3.45), s(W, 5.6), on('campaign', { k: 1.05 }), on('campaign', { k: 0.9, yaw: 6 }), out),
    shot(s(W, 5.6), s(W, 6.4), on('campaign', { k: 0.9, yaw: 6 }), on('ring-all', { yaw: 20, pitch: -8 }), crash),
    shot(s(W, 6.4), whipStart(W), on('ring-hero', { k: 0.85, yaw: -10, pitch: -3 }), on('ring-hero', { yaw: 0 }), io),
    // 4 · payments: crane down as the payments drop in, push to the save button, follow the receipt
    shot(s(P, 0), s(P, 3), on('payment', { k: 0.9, yaw: -8, pitch: -20, dy: -12 }), payment, io),
    ...detail(s(P, 3), payment, on('pay-save', { k: 0.75 }), 1),
    shot(s(P, 4.95), s(P, 5.9), payment, on('pay-phone', { yaw: -12 }), io3),
    shot(s(P, 5.9), whipStart(P), on('pay-phone', { yaw: -12 }), on('pay-phone', { k: 1.04, yaw: -4 }), out),
    // 5 · reports: the report assembles, push to the chart, whip to the incidents and their breakdown
    shot(s(I, 0), s(I, 2.6), on('report', { k: 0.9, yaw: 22, pitch: -6 }), report, out),
    ...detail(s(I, 2.6), report, on('report-chart', { k: 0.8 }), 0.7),
    shot(s(I, 4.75), s(I, 6.8), on('incidents', { k: 0.9, yaw: 16 }), incidents, out),
    ...detail(s(I, 6.8), incidents, on('incidents-rows', { k: 0.8 }), 0.9),
    // 6 · results: the whole platform above the stats, settling into the final frame
    shot(s(F, 0), TOTAL, on('platform', { k: 1.15, yaw: -10, pitch: -3, stats: true, fitW: 0.9 }), on('platform', { yaw: 3, pitch: -4, stats: true, fitW: 0.9 }), out3),
  ]
  // Whip pans fill the gaps: from where the last shot ends to where the next one starts
  const filled: Shot[] = []
  for (const sh of shots) {
    const prev = filled[filled.length - 1]
    if (prev && sh.start > prev.end + 1e-6) {
      // a pan to the next set blurs fully; a pan inside a set (report → incidents) a little
      const crossesCut = segmentAt(prev.end) !== segmentAt(sh.start)
      filled.push({ start: prev.end, end: sh.start, from: prev.to, to: sh.from, ease: ease(M.filmWhipEase), whip: crossesCut ? 1 : 0.55 })
    }
    filled.push(sh)
  }
  return filled
}

const KEYS = ['x', 'y', 'z', 'd', 'yaw', 'pitch', 'roll', 'shake'] as const

export interface Script {
  /** The camera at time `t`: the shot that holds `t`, eased between its poses */
  poseAt(t: number, out: Pose): Pose
  /** Lens blur (0–1) of the whip pan holding `t`, a bell over the pan */
  whipAt(t: number): number
}

export function createScript(focus: Focus, view: View): Script {
  const list = shotList(focus, view)
  return {
    poseAt(t, out) {
      let sh = list[list.length - 1]
      for (const candidate of list) {
        if (t < candidate.end) {
          sh = candidate
          break
        }
      }
      const p = sh.ease(Math.min(1, Math.max(0, (t - sh.start) / (sh.end - sh.start))))
      for (const k of KEYS) out[k] = sh.from[k] + (sh.to[k] - sh.from[k]) * p
      return out
    },
    whipAt(t) {
      for (const sh of list) {
        if (sh.whip && t >= sh.start && t < sh.end) return sh.whip * Math.sin((Math.PI * (t - sh.start)) / (sh.end - sh.start))
      }
      return 0
    },
  }
}

/** Which segment `t` falls in */
export function segmentAt(t: number) {
  for (let i = 1; i <= SEGMENTS; i++) if (t < SEG[i]) return i - 1
  return SEGMENTS - 1
}

/** Sets are only rendered around their own segment (plus the whip pan that arrives) */
export const setVisible = (set: number, t: number) => t >= SEG[set] - WHIP - 1e-6 && t <= SEG[set + 1] + 1e-6

/** Hand-held shake: a sum of sines, so it is a pure function of time too */
const shake = (t: number, amount: number) => {
  const a = amount * M.filmShakeDeg
  return {
    yaw: a * (Math.sin(t * 7.1) * 0.6 + Math.sin(t * 13.7) * 0.4),
    pitch: a * (Math.sin(t * 5.3 + 1.2) * 0.5 + Math.sin(t * 11.9) * 0.3),
    roll: a * Math.sin(t * 3.7 + 0.4) * 0.5,
  }
}

/** The world's transform for a pose: the inverse of the camera */
export function worldTransform(p: Pose, t: number): string {
  const k = shake(t, p.shake)
  const n = (v: number) => v.toFixed(3)
  return (
    `translateZ(${n(-p.d)}em) rotateZ(${n(p.roll + k.roll)}deg) rotateX(${n(p.pitch + k.pitch)}deg) ` +
    `rotateY(${n(p.yaw + k.yaw)}deg) translate3d(${n(-p.x)}em, ${n(-p.y)}em, ${n(-p.z)}em)`
  )
}

/** Segment buttons seek to their cut; reduced-motion stills hold on a composed frame of each */
export const SEEK = SEG.slice(0, SEGMENTS)
export const HOLD = [2.8, s(R, 6.6), s(C, 8.6), s(W, 8.9), s(P, 8.2), s(I, 8.6), TOTAL]

/** Particle window: records converge into the students panel */
export const RECORDS_WINDOW = { start: s(R, 4.4), end: s(R, 8.6) }


/** Small deterministic PRNG for layouts that look random but never change */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let r = Math.imul(a ^ (a >>> 15), 1 | a)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
