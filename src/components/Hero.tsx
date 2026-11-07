import { useCallback, useMemo, useState } from 'react'
import { useContent } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import { ParticleMark } from './ParticleMark'
import styles from './Hero.module.css'

const { duration, distance } = tokens.motion

/** Reference "HP LOADING": per-line delays of the four headline lines (desktop/tablet). */
const LINE_DELAYS = ['0ms', duration.d100, duration.d100, duration.d200]

/** Reference "M HOMEPAGE LOAD" (phones): the text block and the canvas move in as a whole. */
const MOBILE_QUERY = `(max-width: ${tokens.breakpoints.md - 1}px)`

export function Hero() {
  const { hero } = useContent()
  const ref = useReveal<HTMLElement>({ immediate: true })
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const mobile = useMemo(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches, [])

  // Flatten the content lines into the four animated rows of the reference.
  let lineIndex = 0
  const lineReveal = () => {
    if (mobile) return {}
    const delay = LINE_DELAYS[Math.min(lineIndex++, LINE_DELAYS.length - 1)]
    return { 'data-reveal': 'y', 'data-reveal-from': distance.heroLine, 'data-reveal-dur': duration.d700, 'data-reveal-delay': delay }
  }

  // Desktop: canvas fades in 300ms at +400ms. Phones: hero-bg x 100px → 0 and fades, 600ms outSine at +500ms.
  const canvasReveal = mobile
    ? { 'data-reveal': 'x-fade', 'data-reveal-from': '100px', 'data-reveal-dur': duration.d600, 'data-reveal-delay': duration.d500, 'data-reveal-fade-dur': duration.d600 }
    : { 'data-reveal': 'fade', 'data-reveal-fade-dur': duration.d300, 'data-reveal-fade-delay': duration.d400 }

  // Phones: the whole text wrapper moves y 20px → 0 and fades, 600ms outSine at +300ms.
  const contentReveal = mobile
    ? { 'data-reveal': 'y-fade', 'data-reveal-from': '20px', 'data-reveal-dur': duration.d600, 'data-reveal-delay': duration.d300, 'data-reveal-fade-dur': duration.d600 }
    : {}

  // Desktop: caption fades in 500ms at +500ms (part of the text wrapper on phones).
  const captionReveal = mobile ? {} : { 'data-reveal': 'fade', 'data-reveal-fade-dur': duration.d500, 'data-reveal-fade-delay': duration.d500 }

  return (
    <section ref={ref} className={styles.hero} id="top">
      <div className={styles.canvasWrap} {...canvasReveal}>
        <ParticleMark
          fitViewport
          className={`${styles.canvas} ${ready ? styles.ready : ''}`}
          onReady={onReady}
        />
      </div>

      <div className={`container ${styles.content}`} {...contentReveal}>
        <h1 className={`${styles.headline} t-display`}>
          {hero.lines.map((line, i) => (
            <span key={i} className={`${styles.row} ${line.align === 'right' ? styles.right : ''}`}>
              <span {...lineReveal()}>{line.text}</span>
              {line.trailing && <span {...lineReveal()}>{line.trailing}</span>}
            </span>
          ))}
        </h1>

        <p className={`${styles.caption} t-caption`} {...captionReveal}>
          {hero.caption.map((c, i) => (
            <span key={i} className={styles.captionLine}>
              {c}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
