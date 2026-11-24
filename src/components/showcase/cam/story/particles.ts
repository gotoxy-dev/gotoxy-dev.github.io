import { gsap } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import { DOT_STRIDE } from '@/components/particleRenderer'
import { RECORDS_WINDOW, seeded } from './script'

/**
 * Screen-space particles over the film, in closed form: every dot's position is a function of its
 * seed and the film's time (no velocity integration), so a seek or a still draws the right frame.
 *
 * - Records: signups converge from all around into the students panel (the camera's target sits
 *   at the frame's centre during that shot).
 * - Dust: a slow drift across the whole film, for depth.
 */

const M = tokens.motion.showcase
const L = tokens.layout.showcase

const RECORDS = RECORDS_WINDOW

interface Flight {
  delay: number
  dur: number
  angle: number
  radius: number
  swirl: number
  size: number
}

const flights = (count: number, seed: number, window: { start: number; end: number }, dur: [number, number]) => {
  const rand = seeded(seed)
  const span = window.end - window.start
  return Array.from({ length: count }, (): Flight => {
    const d = dur[0] + rand() * (dur[1] - dur[0])
    return {
      dur: d,
      delay: rand() * Math.max(0, span - d),
      angle: rand() * Math.PI * 2,
      radius: 0.45 + rand() * 0.55,
      swirl: (rand() - 0.5) * 2.4,
      size: 0.7 + rand() * 0.8,
    }
  })
}

export interface FilmParticles {
  /** Writes the dots for time `t` into `out` (DOT_STRIDE floats each) and returns how many */
  fill(t: number, width: number, height: number, out: Float32Array): number
  capacity: number
}

export function createFilmParticles(phone: boolean): FilmParticles {
  const total = phone ? M.filmParticlesPhone : M.filmParticles
  const records = flights(total, 7, RECORDS, [0.9, 1.6])
  const rand = seeded(23)
  const dust = Array.from({ length: phone ? M.filmDustPhone : M.filmDust }, () => ({
    x: rand(),
    y: rand(),
    vx: (rand() - 0.5) * 0.02,
    vy: -0.004 - rand() * 0.012,
    alpha: 0.06 + rand() * 0.18,
    size: 0.4 + rand() * 0.5,
  }))
  const easeIn = gsap.parseEase('power2.in') as (p: number) => number
  const dot = L.filmDotPx

  return {
    capacity: records.length + dust.length,
    fill(t, width, height, out) {
      const cx = width / 2
      const cy = height / 2
      const reach = Math.hypot(width, height) / 2
      let n = 0
      const put = (x: number, y: number, alpha: number, size: number) => {
        const j = n * DOT_STRIDE
        out[j] = x
        out[j + 1] = y
        out[j + 2] = alpha
        out[j + 3] = size
        n++
      }
      for (const d of dust) {
        const x = (((d.x + d.vx * t) % 1) + 1) % 1
        const y = (((d.y + d.vy * t) % 1) + 1) % 1
        put(x * width, y * height, d.alpha, d.size * dot)
      }
      if (t >= RECORDS.start && t < RECORDS.end) {
        for (const f of records) {
          const p = (t - RECORDS.start - f.delay) / f.dur
          if (p <= 0 || p >= 1) continue
          const e = easeIn(p)
          const r = reach * (0.35 + f.radius * 0.75) * (1 - e)
          const a = f.angle + f.swirl * e
          put(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8, Math.min(1, p * 5) * (1 - e * 0.4), f.size * dot)
        }
      }
      return n
    },
  }
}
