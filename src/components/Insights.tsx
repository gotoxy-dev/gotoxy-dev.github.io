import { insights } from '@/content/site'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import styles from './Insights.module.css'

const { duration, distance } = tokens.motion

export function Insights() {
  const ref = useReveal<HTMLElement>({ offset: 25 })

  return (
    <section ref={ref} className={styles.section} id="services">
      <div
        className="container"
        data-reveal="y-fade"
        data-reveal-from={distance.block}
        data-reveal-dur={duration.d500}
        data-reveal-fade-dur={duration.d400}
      >
        <div className={styles.head}>
          <h2 className={styles.title}>{insights.title}</h2>
          <a href={insights.moreHref} target="_blank" rel="noreferrer" className={`${styles.more} alink`}>
            {insights.moreLabel}
            <span className="alink-arrow">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 12L12 2M4 2h8v8" />
              </svg>
            </span>
          </a>
        </div>

        {/*
          "insights-hover-IN/OUT": at rest the text sits over the image slot
          (translateX(-31vw)) and the image is hidden at translateX(-27vw);
          on hover both slide to 0 in 800ms ease and the image fades in 400ms.
        */}
        <ul className={styles.list}>
          {insights.items.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer" className={styles.item}>
                <div className={styles.thumb}>
                  <img src={item.image} alt="" loading="lazy" />
                </div>
                <div className={styles.text}>
                  <h3 className={`${styles.itemTitle} t-h3`}>{item.title}</h3>
                  <span className="pill">{item.category}</span>
                </div>
                <svg className={styles.arrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <path d="M2 12L12 2M4 2h8v8" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
