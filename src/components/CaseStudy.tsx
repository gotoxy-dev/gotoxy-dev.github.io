import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import type { CaseStudy as CaseStudyContent } from '@/content/site'
import { useLanguage } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { useScrub } from '@/hooks/useScrub'
import { tokens } from '@/theme/tokens'
import styles from './CaseStudy.module.css'

const { duration } = tokens.motion

const ArrowIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.7487 1.12203H0.832031V0.288696H9.58203V9.02141H8.7487V1.12203Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0.851562 8.58363L8.86924 0.396545L9.46462 0.979609L1.44695 9.16669L0.851562 8.58363Z" fill="currentColor" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path d="M1 1l20 20M21 1L1 21" />
  </svg>
)

/**
 * Reference "SN-case-scroll": one scroll-progress timeline (0..1) cross-fades the three
 * right-hand pages, moves their content ±60px, advances the pager dash and swaps the labels.
 */
function buildCaseScrub(tl: gsap.core.Timeline, root: HTMLElement) {
  const q = (sel: string) => root.querySelector<HTMLElement>(sel)
  const page = [1, 2, 3].map((n) => q(`[data-case="page-${n}"]`))
  const content = [1, 2, 3].map((n) => q(`[data-case="content-${n}"]`))
  const label = [1, 2, 3].map((n) => q(`[data-case="label-${n}"]`))
  const dash = q('[data-case="dash"]')
  const total = q('[data-case="total"]')
  const lift = 60

  // 33% → 66%: page 1 out, page 2 in
  if (page[0] && content[0]) {
    tl.fromTo(page[0], { opacity: 1 }, { opacity: 0, duration: 0.33 }, 0.33)
    tl.fromTo(content[0], { y: 0 }, { y: -lift, duration: 0.33 }, 0.33)
  }
  if (page[1] && content[1]) {
    tl.fromTo(page[1], { opacity: 0 }, { opacity: 1, duration: 0.33 }, 0.33)
    tl.fromTo(content[1], { y: lift }, { y: 0, duration: 0.33 }, 0.33)
    // 75% → 100%: page 2 out, page 3 in
    tl.to(page[1], { opacity: 0, duration: 0.25 }, 0.75)
    tl.to(content[1], { y: -lift, duration: 0.25 }, 0.75)
  }
  if (page[2] && content[2]) {
    tl.fromTo(page[2], { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.75)
    tl.fromTo(content[2], { y: lift }, { y: 0, duration: 0.25 }, 0.75)
  }
  if (label[0]) tl.fromTo(label[0], { opacity: 1 }, { opacity: 0, duration: 0.33 }, 0.33)
  if (label[1]) {
    tl.fromTo(label[1], { opacity: 0 }, { opacity: 1, duration: 0.33 }, 0.33)
    tl.to(label[1], { opacity: 0, duration: 0.25 }, 0.75)
  }
  if (label[2]) tl.fromTo(label[2], { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.75)
  if (dash) {
    tl.fromTo(dash, { width: '0%' }, { width: '50%', duration: 0.33 }, 0.33)
    tl.to(dash, { width: '100%', duration: 0.25 }, 0.75)
  }
  if (total) tl.fromTo(total, { color: tokens.color.pager }, { color: tokens.color.text, duration: 0.25 }, 0.75)
}

export function CaseStudy({ study }: { study: CaseStudyContent }) {
  const { content: { caseStudies }, lang } = useLanguage()
  const nextLabel = lang === 'es' ? 'Siguiente proyecto' : 'Next project'
  const revealRef = useReveal<HTMLDivElement>({ immediate: true })
  const scrubRef = useScrub<HTMLDivElement>(buildCaseScrub, {
    start: 'top top',
    end: 'bottom bottom',
    scrub: tokens.layout.caseStudy.scrubSmoothing,
  })
  const next = caseStudies.find((c) => c.slug === study.next)
  const [goal, results] = study.pages

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [study.slug])

  const setRefs = (el: HTMLDivElement | null) => {
    revealRef.current = el
    scrubRef.current = el
  }

  const fade = { 'data-reveal': 'fade', 'data-reveal-fade-dur': duration.d500 }

  return (
    <div ref={setRefs} className={styles.root}>
      <Link to="/" className={styles.close} aria-label={lang === 'es' ? 'Cerrar caso' : 'Close case study'} {...fade}>
        <CloseIcon />
      </Link>

      {/* pager: 01 / 02 / 03 cross-fade over a dash that fills with scroll */}
      <div className={styles.pager} aria-hidden="true">
        <span className={styles.pagerLabels}>
          <span className={styles.pagerLabel} data-case="label-1">
            01
          </span>
          <span className={styles.pagerLabel} data-case="label-2">
            02
          </span>
          <span className={styles.pagerLabel} data-case="label-3">
            03
          </span>
        </span>
        <span className={styles.dash}>
          <span className={styles.dashFill} data-case="dash" />
        </span>
        <span className={styles.pagerTotal} data-case="total">
          03
        </span>
      </div>

      {/* right-hand fixed panel with the three overlapping pages */}
      <div className={styles.panel} {...fade}>
        <div className={`${styles.page} ${styles.pageFirst}`} data-case="page-1">
          <div className={styles.pageLink}>
            <a href={study.link.href} target="_blank" rel="noreferrer" className={styles.caseLink}>
              {study.link.label}
              <ArrowIcon />
            </a>
          </div>
          <div className={styles.content} data-case="content-1">
            <h1 className={styles.title}>{study.title}</h1>
            <div className={styles.spaceLarge} />
            <dl className={styles.table}>
              {study.table.map((row) => (
                <div key={row.label} className={styles.row}>
                  <dt className={styles.rowLabel}>{row.label}</dt>
                  <dd className={styles.rowValue}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.page} data-case="page-2">
          <div className={styles.content} data-case="content-2">
            <span className={styles.caps}>{goal.label}</span>
            <div className={styles.spaceLarge} />
            <h2 className={styles.heading}>{goal.heading}</h2>
            <div className={styles.spaceMedium} />
            <div className={styles.paragraphs}>
              {goal.paragraphs.map((p, i) => (
                <p key={i} className={styles.paragraph}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.page} data-case="page-3">
          {next && (
            <div className={styles.pageLink}>
              <Link to="/projects/$slug" params={{ slug: next.slug }} className={styles.caseLink}>
                {nextLabel}
                <ArrowIcon />
              </Link>
            </div>
          )}
          <div className={styles.content} data-case="content-3">
            <span className={styles.caps}>{results.label}</span>
            <div className={styles.spaceLarge} />
            <h2 className={styles.heading}>{results.heading}</h2>
            <div className={styles.spaceMedium} />
            <div className={styles.paragraphs}>
              {results.paragraphs.map((p, i) => (
                <p key={i} className={styles.paragraph}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* left-hand sticky sections: each one slides over the previous while scrolling */}
      <div className={styles.sections} {...fade}>
        <section className={styles.section}>
          <div className={styles.bg} style={{ backgroundImage: `url(${study.media.background})` }}>
            {study.media.device && <img className={styles.device} src={study.media.device} alt="" />}
          </div>
        </section>
        <section className={styles.section}>
          <div className={`${styles.bg} ${styles.bgVideo}`}>
            <video className={styles.video} src={study.media.video} poster={study.media.videoPoster} autoPlay loop muted playsInline />
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.bg} style={{ backgroundImage: `url(${study.media.closing})` }} />
        </section>
      </div>

      {/* stacked layout for small screens (reference "tablet-case") */}
      <div className={styles.stack}>
        <h1 className={styles.title}>{study.title}</h1>
        <img className={styles.stackImage} src={study.media.background} alt="" />
        <dl className={styles.table}>
          {study.table.map((row) => (
            <div key={row.label} className={styles.row}>
              <dt className={styles.rowLabel}>{row.label}</dt>
              <dd className={styles.rowValue}>{row.value}</dd>
            </div>
          ))}
        </dl>
        <a href={study.link.href} target="_blank" rel="noreferrer" className={styles.button}>
          {study.link.label}
        </a>
        <video className={styles.stackVideo} src={study.media.video} poster={study.media.videoPoster} autoPlay loop muted playsInline />
        {study.pages.map((p) => (
          <div key={p.label} className={styles.stackBlock}>
            <span className={styles.caps}>{p.label}</span>
            <h2 className={styles.heading}>{p.heading}</h2>
            {p.paragraphs.map((t, i) => (
              <p key={i} className={styles.paragraph}>
                {t}
              </p>
            ))}
          </div>
        ))}
        {next && (
          <Link to="/projects/$slug" params={{ slug: next.slug }} className={styles.button}>
            {nextLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
