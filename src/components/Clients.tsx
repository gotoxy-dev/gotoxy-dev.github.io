import { useState } from 'react'
import { clients, type Testimonial } from '@/content/site'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import styles from './Clients.module.css'

const { duration, distance } = tokens.motion

/** Reference "HP-what_clients_say-SCROLL_IN": the "see more" block fades after the title and list are in (step 3). */
const SEE_MORE_DELAY = `${parseFloat(duration.d300) + parseFloat(duration.d500)}ms`

export function Clients() {
  const sectionRef = useReveal<HTMLElement>({ offset: 15 })
  const titleRef = useReveal<HTMLHeadingElement>({ offset: 33 })
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section ref={sectionRef} className="section" id="story">
      <div className="container">
        <div
          className={styles.head}
          data-reveal="y-fade"
          data-reveal-from={distance.block}
          data-reveal-dur={duration.d500}
          data-reveal-fade-dur={duration.d400}
        >
          <h2 ref={titleRef} className={`${styles.title} t-h2`}>
            {clients.title.map((line, i) => (
              <span
                key={i}
                className={styles.titleLine}
                data-reveal="y"
                data-reveal-from={distance.titleLine}
                data-reveal-dur={duration.d700}
                data-reveal-delay={`${i * parseFloat(duration.d100)}ms`}
              >
                {line}
              </span>
            ))}
          </h2>
          <a
            href="#"
            className={`${styles.seeMore} t-caption alink`}
            data-reveal="fade"
            data-reveal-fade-dur={duration.d300}
            data-reveal-fade-delay={SEE_MORE_DELAY}
          >
            {clients.seeMoreLabel}
            <img src={clients.seeMoreLogo} alt="" />
            <span className="alink-arrow">
              <ArrowUpRight />
            </span>
          </a>
        </div>

        <div
          className={styles.rows}
          data-reveal="y-fade"
          data-reveal-from={distance.block}
          data-reveal-dur={duration.d500}
          data-reveal-delay={duration.d200}
          data-reveal-fade-dur={duration.d500}
          data-reveal-fade-delay={duration.d300}
        >
          {clients.testimonials.map((t) => (
            <TestimonialRow
              key={t.id}
              item={t}
              open={openId === t.id}
              onToggle={() => setOpenId(openId === t.id ? null : t.id)}
            />
          ))}
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[...clients.logos, ...clients.logos].map((l, i) => (
            <div key={`${l.id}-${i}`} className={styles.logoItem}>
              <img src={l.src} alt={l.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 12L12 2M4 2h8v8" />
    </svg>
  )
}

/**
 * Reference "SHOW/HIDE Faq Item": the answer height animates in 350ms ease and the
 * READ / CLOSE buttons swap. Only one item is open at a time.
 */
function TestimonialRow({ item, open, onToggle }: { item: Testimonial; open: boolean; onToggle: () => void }) {
  return (
    <div className={`${styles.row} ${open ? styles.open : ''}`}>
      <button className={`${styles.summary} t-small`} onClick={onToggle} aria-expanded={open}>
        <span className={styles.author}>
          <span>{item.author}</span>
          <span className={styles.role}>{item.role}</span>
        </span>
        <span className={styles.company}>{item.company}</span>
        <span className={styles.readBtn}>
          <span className="pill">{open ? clients.closeLabel : clients.readLabel}</span>
        </span>
      </button>
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          <div className={styles.bodyGrid}>
            <p className={`${styles.scope} t-small`}>{item.scope}</p>
            <p className={`${styles.quote} t-body`}>“{item.quote}”</p>
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}
