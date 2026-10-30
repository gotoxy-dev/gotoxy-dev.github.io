import { footer } from '@/content/site'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import styles from './Footer.module.css'

const { duration, distance } = tokens.motion

const ArrowUpRight = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M2 12L12 2M4 2h8v8" />
  </svg>
)

const ArrowUp = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path d="M4 7V1M1 4l3-3 3 3" />
  </svg>
)

export function Footer() {
  // "p-scroll-in": text blocks move y 2vw → 0 in 600ms outCirc once 50% in view
  const ref = useReveal<HTMLElement>({ offset: 50 })

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const textReveal = {
    'data-reveal': 'y',
    'data-reveal-from': distance.text,
    'data-reveal-dur': duration.d600,
    'data-reveal-ease': 'outCirc',
  }

  return (
    <footer ref={ref} className={styles.footer} id="footer">
      <div className="container">
        <div className={styles.top}>
          <ul className={styles.socials}>
            {footer.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="alink">
                  {s.label}
                  <span className="alink-arrow">
                    <ArrowUpRight />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {/* "back to top hover": the arrow leaves upwards (y -30px) while a second one enters from below (y 30px → 0), 300ms outCirc */}
          <a href="#top" className={styles.backTop} onClick={toTop}>
            <span className={styles.circle}>
              <span className={styles.arrowOut}>
                <ArrowUp />
              </span>
              <span className={styles.arrowIn}>
                <ArrowUp />
              </span>
            </span>
            {footer.backToTop}
          </a>
        </div>

        <div className={styles.touchWrap} {...textReveal}>
          <a href={`mailto:${footer.email}`} className={`${styles.touch} t-h2`}>
            {footer.headline}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20L20 4M8 4h12v12" />
            </svg>
          </a>
          <br />
          <a href={`mailto:${footer.email}`} className={`${styles.email} ulink`}>
            {footer.email}
          </a>
        </div>
      </div>
      <div className="container">
        <div className={styles.bottom} {...textReveal}>
          {footer.copyright}
        </div>
      </div>
    </footer>
  )
}
