import { useState } from 'react'
import { awards } from '@/content/site'
import { useReveal } from '@/hooks/useReveal'
import { tokens } from '@/theme/tokens'
import styles from './Awards.module.css'

const { duration, distance } = tokens.motion

/** Reference: the 12-entry Awwwards list expands in 1000ms, the short lists in 500ms. */
const LONG_LIST_MIN_ENTRIES = 10
/** Entry rows start drawing 200ms after the click and stagger 100ms. */
const ENTRY_BASE_DELAY = parseFloat(duration.d200)
const ENTRY_STAGGER = parseFloat(duration.d100)

/** Reference `.awards-arrow` at rest is rotated 90° (↘) and points ↗ when open. */
const ArrowIcon = () => (
  <svg className={styles.arrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M2 12L12 2M4 2h8v8" />
  </svg>
)

export function Awards() {
  const ref = useReveal<HTMLElement>({ offset: 25 })
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section ref={ref} className={styles.section} id="awards">
      <div
        className="container"
        data-reveal="y-fade"
        data-reveal-from={distance.block}
        data-reveal-dur={duration.d500}
        data-reveal-fade-dur={duration.d400}
      >
        <p className={`${styles.intro} t-lead`}>{awards.intro}</p>

        <div className={styles.rows}>
          {awards.groups.map((g) => {
            const expandable = g.entries.length > 0
            const open = openId === g.id
            const long = g.entries.length >= LONG_LIST_MIN_ENTRIES
            return (
              <div key={g.id} className={`${styles.row} ${open ? styles.open : ''} ${long ? styles.long : ''}`}>
                {/* "reddot-in/out": the preview sits beside the row and fades/slides in on hover */}
                {g.image && <img src={g.image} alt="" className={styles.preview} aria-hidden="true" />}
                <div className={styles.summary}>
                  <span className={styles.name}>
                    {g.name}
                    {expandable && <span className={styles.count}>/ {String(g.entries.length).padStart(2, '0')}</span>}
                  </span>
                  {expandable && (
                    <button
                      className={styles.toggle}
                      onClick={() => setOpenId(open ? null : g.id)}
                      aria-expanded={open}
                      aria-label={`${open ? 'Collapse' : 'Expand'} ${g.name}`}
                    >
                      <ArrowIcon />
                    </button>
                  )}
                </div>
                {expandable && (
                  <div className={styles.body}>
                    <div className={styles.bodyInner}>
                      <ul className={styles.entries}>
                        {g.entries.map((e, i) => (
                          <li
                            key={i}
                            className={styles.entry}
                            style={{ '--entry-delay': open ? `${ENTRY_BASE_DELAY + i * ENTRY_STAGGER}ms` : '0ms' } as React.CSSProperties}
                          >
                            <span className={styles.entryLine} />
                            <span className={styles.entryText}>
                              <span>{e.title}</span>
                              <span>{e.year}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className={`${styles.more} t-caption`}>
          {awards.moreLabel.map((l, i) => (
            <span key={i} className={styles.moreLine}>
              {l}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
