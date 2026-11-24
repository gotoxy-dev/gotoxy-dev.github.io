import { useLayoutEffect, useRef, type ReactNode } from 'react'
import type { CaseOutcomeIcon, CaseShowcase } from '@/content/site'
import { gsap, prefersReducedMotion } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import styles from './CamOutcomes.module.css'

/*
 * Illustrations: one 128 × 64 viewBox per item, the manual "before" on the left (x 4–52, grey,
 * dashed where the work was messy), an arrow, and the "after" on the right (x 76–124, blue).
 * Strokes use `currentColor`; `data-draw` marks the strokes drawn in (pathLength 1), the dashed
 * ones fade in instead (both effects use stroke-dasharray). Coordinates are illustration geometry.
 */
const D = { 'data-draw': '', pathLength: 1 } as const
const DASH = { strokeDasharray: '2 3.5' } as const

const art: Record<CaseOutcomeIcon, { before: ReactNode; after: ReactNode }> = {
  // spreadsheet typed by hand → phone form with a check
  signup: {
    before: (
      <>
        <rect {...D} x="6" y="12" width="44" height="40" rx="2" />
        <path {...DASH} d="M6 22h44M6 32h44M6 42h44M20 12v40M35 12v40" />
        <path {...D} d="M38.5 35l6 5M44.5 35l-6 5" />
      </>
    ),
    after: (
      <>
        <rect {...D} x="88" y="8" width="24" height="48" rx="4" />
        <path {...D} d="M97 13h6" />
        <path {...D} d="M93 23h14M93 30h14" />
        <circle {...D} cx="100" cy="43" r="5.5" />
        <path {...D} d="M97.5 43.2l1.9 1.9 3.3-3.6" />
      </>
    ),
  },
  // forms loaded one by one → sync arrows into a graduation cap
  campus: {
    before: (
      <>
        <rect {...DASH} x="6" y="18" width="30" height="36" rx="2" />
        <rect {...DASH} x="11" y="14" width="30" height="36" rx="2" />
        <rect {...D} x="16" y="10" width="30" height="36" rx="2" />
        <path {...D} d="M21 19h20M21 25h14M21 31h20" />
        <path {...D} d="M21 37v5" />
      </>
    ),
    after: (
      <>
        <path {...D} d="M84 24l18-8 18 8-18 8z" />
        <path {...D} d="M90 27v7c0 4 24 4 24 0v-7" />
        <path {...D} d="M120 24v9" />
        <path {...D} d="M86 47q16 10 32 0" />
        <path {...D} d="M89.5 44l-3.5 3 4.5 1.5M114.5 44l3.5 3-4.5 1.5" />
      </>
    ),
  },
  // one chat bubble and an hourglass → many bubbles fanning out
  messages: {
    before: (
      <>
        <path
          {...D}
          d="M10 14h26a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H20l-6 6v-6h-4a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z"
        />
        <path {...DASH} d="M14 24h18" />
        <path {...D} d="M43 36h9M43 52h9M44.5 36l7 8-7 8M51.5 36l-7 8 7 8" />
      </>
    ),
    after: (
      <>
        <circle {...D} cx="82" cy="32" r="4" />
        <path {...D} d="M85.5 29.5L95 18M86 32h17M85.5 34.5L95 46" />
        <rect {...D} x="96" y="9" width="22" height="12" rx="3" />
        <rect {...D} x="104" y="26" width="20" height="12" rx="3" />
        <rect {...D} x="96" y="43" width="22" height="12" rx="3" />
      </>
    ),
  },
  // a paper receipt → three coins (marks of Gs, US$ and R$) into a phone
  payments: {
    before: (
      <>
        <path
          {...D}
          d="M14 10h26v38l-3.25 3-3.25-3-3.25 3-3.25-3-3.25 3-3.25-3-3.25 3L14 48z"
        />
        <path {...DASH} d="M19 18h16M19 25h12M19 32h16" />
        <path {...D} d="M19 40h8" />
      </>
    ),
    after: (
      <>
        <circle {...D} cx="87" cy="17" r="7" />
        <circle {...D} cx="87" cy="32" r="7" />
        <circle {...D} cx="87" cy="47" r="7" />
        <path {...D} strokeWidth="1.25" d="M89.6 15.2a3.2 3.2 0 1 0 0.6 3h-2.2" />
        <path {...D} strokeWidth="1.25" d="M89 29.6c-0.8-0.9-4-1-4 0.8 0 2.4 4 1.2 4 3.4 0 1.8-3.2 1.7-4 0.6M87 28v8" />
        <path {...D} strokeWidth="1.25" d="M85.4 50.2v-6.4h2.4a1.7 1.7 0 0 1 0 3.4h-2.4l3.4 3" />
        <path {...D} d="M97 32h5M100 29.5l2.5 2.5-2.5 2.5" />
        <rect {...D} x="106" y="10" width="17" height="44" rx="3.5" />
        <path {...D} d="M110.5 32.5l2.5 2.5 5-5.5" />
      </>
    ),
  },
  // no record (a question mark) → a shield with a history clock
  control: {
    before: (
      <>
        <path {...D} d="M14 22a8 8 0 1 1 11 7.4c-2 0.9-3 2.4-3 4.6v2.5" />
        <path {...D} d="M22 43.5v0.5" />
        <path {...DASH} d="M36 20h12M36 28h9M36 36h12M36 44h7" />
      </>
    ),
    after: (
      <>
        <path {...D} d="M100 8l18 6v14c0 12-8 20-18 24-10-4-18-12-18-24V14z" />
        <circle {...D} cx="100" cy="30" r="8" />
        <path {...D} d="M100 25.5V30l3 2" />
      </>
    ),
  },
}

/**
 * Chapter 3 of the Instituto CAM case: what the team did by hand before and what it does now,
 * one row per area, each with a before → after line drawing. The CSS holds the final state;
 * every time `active` turns true the rows rise in and the drawings draw from the start, and
 * when it turns false (or on unmount) the animation is reverted to that final state.
 */
export function CamOutcomes({
  outcomes,
  active,
  className,
}: {
  outcomes: CaseShowcase['outcomes']
  active: boolean
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!active || !root || prefersReducedMotion()) return
    const m = tokens.motion.showcase
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: m.ease } })
      root.querySelectorAll<HTMLElement>('[data-outcome]').forEach((row, i) => {
        const at = i * m.outcomeStaggerSec
        const before = row.querySelector('[data-art="before"]')
        const arrow = row.querySelector('[data-art="arrow"]')
        const after = row.querySelector('[data-art="after"]')
        const beforeText = row.querySelector('[data-text="before"]')
        const afterText = row.querySelector('[data-text="after"]')
        // the before drawing starts in the text colour and dims to its grey (its CSS colour)
        const dim = before ? String(gsap.getProperty(before, 'color')) : ''
        const draw = (el: Element | null, start: number, duration: number) => {
          if (!el) return
          const strokes = el.querySelectorAll('[data-draw]')
          const stagger = duration / 10
          tl.fromTo(
            strokes,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration, stagger, ease: 'power2.inOut' },
            start,
          )
          // hidden until its own draw starts: a round cap would leave a dot at offset 1
          tl.fromTo(strokes, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger, ease: 'none' }, start)
        }

        tl.fromTo(row, { opacity: 0, y: m.outcomeLiftPx }, { opacity: 1, y: 0, duration: m.outcomeRiseSec }, at)
        if (beforeText) tl.fromTo(beforeText, { opacity: 0 }, { opacity: 1, duration: m.outcomeRiseSec }, at + m.outcomeRiseSec * 0.25)
        if (before) {
          tl.fromTo(before, { opacity: 0 }, { opacity: 1, duration: m.outcomeDrawSec * 0.2, ease: 'none' }, at)
          draw(before, at, m.outcomeDrawSec * 0.35)
          tl.fromTo(
            before,
            { color: tokens.color.text },
            { color: dim, duration: m.outcomeDrawSec * 0.4 },
            at + m.outcomeDrawSec * 0.4,
          )
        }
        draw(arrow, at + m.outcomeDrawSec * 0.3, m.outcomeDrawSec * 0.15)
        draw(after, at + m.outcomeDrawSec * 0.4, m.outcomeDrawSec * 0.6)
        if (afterText) {
          tl.fromTo(
            afterText,
            { opacity: 0, y: m.outcomeLiftPx / 2 },
            { opacity: 1, y: 0, duration: m.outcomeRiseSec },
            at + m.outcomeDrawSec * 0.45,
          )
        }
      })
    }, root)
    return () => ctx.revert()
  }, [active])

  return (
    <div ref={rootRef} className={`${styles.root}${className ? ` ${className}` : ''}`}>
      <div className={styles.inner}>
        <ul className={styles.list}>
          {outcomes.items.map((item) => (
            <li key={item.icon} className={styles.item} data-outcome="">
              <svg
                className={styles.art}
                viewBox="0 0 128 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <g className={styles.artBefore} data-art="before">
                  {art[item.icon].before}
                </g>
                <g className={styles.artArrow} data-art="arrow">
                  <path {...D} d="M57 32h12M65.5 28.5L69 32l-3.5 3.5" />
                </g>
                <g className={styles.artAfter} data-art="after">
                  {art[item.icon].after}
                </g>
              </svg>
              <p className={styles.title}>{item.title}</p>
              <dl className={styles.pairs}>
                <div className={styles.pair} data-text="before">
                  <dt className={styles.label}>{outcomes.before}</dt>
                  <dd className={styles.beforeText}>{item.before}</dd>
                </div>
                <div className={styles.pair} data-text="after">
                  <dt className={`${styles.label} ${styles.labelAfter}`}>{outcomes.after}</dt>
                  <dd className={styles.afterText}>{item.after}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
