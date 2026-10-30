import { cta } from '@/content/site'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import styles from './Cta.module.css'

const { duration, distance } = tokens.motion
const stagger = (i: number) => `${i * parseFloat(duration.d100)}ms`

export function Cta() {
  const sectionRef = useReveal<HTMLElement>({ offset: 25 })
  const eyebrowRef = useReveal<HTMLParagraphElement>({ offset: 33 })
  const headlineRef = useReveal<HTMLHeadingElement>({ offset: 33 })

  return (
    <section ref={sectionRef} className="section" id="contact">
      <div
        className="container"
        data-reveal="y-fade"
        data-reveal-from={distance.block}
        data-reveal-dur={duration.d500}
        data-reveal-fade-dur={duration.d400}
      >
        {/* "move-in-scroll": lines y 7vw → 0, 700ms outSine, 100ms stagger */}
        <p ref={eyebrowRef} className={`${styles.eyebrow} t-caption`}>
          {cta.eyebrow.map((l, i) => (
            <span
              key={i}
              className={styles.line}
              data-reveal="y"
              data-reveal-from={distance.titleLine}
              data-reveal-dur={duration.d700}
              data-reveal-delay={stagger(i)}
            >
              {l}
            </span>
          ))}
        </p>
        {/* "move-in-scroll-2": lines y 7vw → 0, 700ms outCirc, 100ms stagger, clipped by the wrapper */}
        <h2 ref={headlineRef} className={`${styles.headline} t-h2`}>
          {cta.headline.map((l, i) => (
            <span
              key={i}
              className={styles.line}
              data-reveal="y"
              data-reveal-from={distance.titleLine}
              data-reveal-dur={duration.d700}
              data-reveal-ease="outCirc"
              data-reveal-delay={stagger(i)}
            >
              {l}
            </span>
          ))}
        </h2>
        {/* "hp-lets-talk-hoverIN": arrow rotates 0 → -90deg in 300ms ease, back in 200ms */}
        <a href={cta.button.href} className={styles.button}>
          {cta.button.label}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l16 16M20 8v12H8" />
          </svg>
        </a>
      </div>
    </section>
  )
}
