import { useCallback, useState } from 'react'
import { useContent } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import { ImageSequence } from './ImageSequence'
import styles from './Hero.module.css'

/** Reference "HP LOADING": per-line delays of the four headline lines. */
const LINE_DELAYS = ['0ms', tokens.motion.duration.d100, tokens.motion.duration.d100, tokens.motion.duration.d200]

export function Hero() {
  const { hero } = useContent()
  const ref = useReveal<HTMLElement>({ immediate: true })
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  // Flatten the content lines into the four animated rows of the reference.
  let lineIndex = 0
  const nextDelay = () => LINE_DELAYS[Math.min(lineIndex++, LINE_DELAYS.length - 1)]

  return (
    <section ref={ref} className={styles.hero} id="top">
      <div
        className={styles.canvasWrap}
        data-reveal="fade"
        data-reveal-fade-dur={tokens.motion.duration.d300}
        data-reveal-fade-delay={tokens.motion.duration.d400}
      >
        <ImageSequence
          dir={hero.sequence.dir}
          ext={hero.sequence.ext}
          frameCount={hero.sequence.frameCount}
          pad={hero.sequence.pad}
          className={`${styles.canvas} ${ready ? styles.ready : ''}`}
          onReady={onReady}
        />
      </div>

      <div className={`container ${styles.content}`}>
        <h1 className={`${styles.headline} t-display`}>
          {hero.lines.map((line, i) => (
            <span key={i} className={`${styles.row} ${line.align === 'right' ? styles.right : ''}`}>
              <span
                data-reveal="y"
                data-reveal-from={tokens.motion.distance.heroLine}
                data-reveal-dur={tokens.motion.duration.d700}
                data-reveal-delay={nextDelay()}
              >
                {line.text}
              </span>
              {line.trailing && (
                <span
                  data-reveal="y"
                  data-reveal-from={tokens.motion.distance.heroLine}
                  data-reveal-dur={tokens.motion.duration.d700}
                  data-reveal-delay={nextDelay()}
                >
                  {line.trailing}
                </span>
              )}
            </span>
          ))}
        </h1>

        <p
          className={`${styles.caption} t-caption`}
          data-reveal="fade"
          data-reveal-fade-dur={tokens.motion.duration.d500}
          data-reveal-fade-delay={tokens.motion.duration.d500}
        >
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
