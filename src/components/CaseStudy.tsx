import { useEffect, useRef, type CSSProperties } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { CaseJourneyStep, CaseStudy as CaseStudyContent } from '@/content/site'
import { useLanguage } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { useSnapScroll, writeSectionHash } from '@/hooks/useSnapScroll'
import { gsap, ScrollTrigger } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import { DeviceFrame } from './DeviceFrame'
import styles from './CaseStudy.module.css'

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

/** Split layout (fixed panel + sticky visuals) from the lg breakpoint up. */
const SPLIT = `(min-width: ${tokens.breakpoints.lg}px)`
const MOTION_OK = '(prefers-reduced-motion: no-preference)'
/** Global class that turns on `scroll-snap-type` on <html> (see CaseStudy.module.css). */
const SNAP_CLASS = 'case-snap'
/** App screens are laid out at this width (CSS px) and scaled to the phone. */
const APP_WIDTH = parseFloat(tokens.layout.caseStudy.appWidth)
/** Visible screen height at that width (the phone screen is 392×848 in the 440×900 frame). */
const APP_VIEW = parseFloat(tokens.layout.caseStudy.appView)
const STATUS_BAR = parseFloat(tokens.layout.caseStudy.appStatusBar)

const StatusBar = () => (
  <div className={styles.statusBar} aria-hidden="true">
    <span>9:41</span>
    <span className={styles.statusIcons}>
      <svg width="18" height="12" viewBox="0 0 18 12">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12">
        <path d="M8 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8 .6 10.6 10.6 0 0 0 .5 3.6l1.2 1.2A8.9 8.9 0 0 1 8 2.3Zm0 3.4c1.5 0 2.9.6 4 1.5l1.2-1.2A7.4 7.4 0 0 0 8 4a7.4 7.4 0 0 0-5.2 2l1.2 1.2c1.1-.9 2.5-1.5 4-1.5Zm0 3.4c.6 0 1.2.2 1.6.6L8 11.3 6.4 9.7c.4-.4 1-.6 1.6-.6Z" />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <rect x="2" y="2" width="18" height="9" rx="2" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fillOpacity="0.45" />
      </svg>
    </span>
  </div>
)
const TAP_RADIUS = parseFloat(tokens.layout.caseStudy.tapSize) / 2

const pad = (n: number) => String(n).padStart(2, '0')
const range = (n: number) => Array.from({ length: n }, (_, i) => i)
const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties
const STEP = 'var(--layout-caseStudy-journeyStep)'

/**
 * Chapters, each one a snap point: intro (cover), goal (reel), the journey when the case
 * has one (the phone stays pinned while each of its k steps gets its own snap stop,
 * `journeyStep` apart), and the results.
 */
function chapterLayout(study: CaseStudyContent) {
  const steps = study.journey?.steps ?? []
  const hasJourney = steps.length > 0
  const count = hasJourney ? 4 : 3
  const k = steps.length
  const extra = Math.max(0, k - 1)
  /** CSS top of each chapter's snap point */
  const areas = range(count).map((i) => {
    if (hasJourney && i === 3) return `calc(300vh + ${extra} * ${STEP})`
    return `calc(${i} * 100vh)`
  })
  /** Snap stops of journey steps 1..k-1 (step 0 is the journey chapter itself) */
  const stops = range(extra).map((i) => `calc(200vh + ${i + 1} * ${STEP})`)
  return { steps, hasJourney, count, k, areas, stops, totalHeight: `calc(${count} * 100vh + ${extra} * ${STEP})` }
}

/**
 * Chapter swaps: one short tween when the visible chapter changes. The outgoing panel page
 * fades out while moving against the scroll, the incoming one fades in from the other side,
 * and the pager follows. Nothing runs while the browser snaps between chapters.
 */
function setupChapterSwaps(root: HTMLElement, count: number, animate: boolean) {
  const { swapSec, swapOutSec, swapInDelaySec, swapEase, pageLiftPx: lift } = tokens.motion.caseStudy
  const el = (key: string, i: number) => root.querySelector<HTMLElement>(`[data-case="${key}-${i}"]`)
  const pages = range(count).map((i) => el('page', i))
  const contents = range(count).map((i) => el('content', i))
  const labels = range(count).map((i) => el('label', i))
  const areas = range(count).map((i) => el('area', i))
  const fill = root.querySelector<HTMLElement>('[data-case="dash"]')
  const total = root.querySelector<HTMLElement>('[data-case="total"]')
  const video = root.querySelector<HTMLVideoElement>('[data-case="reel"]')
  const last = count - 1
  const duration = animate ? swapSec : 0

  let active = -1
  let swap: gsap.core.Timeline | null = null

  const place = (index: number) => {
    swap?.kill()
    active = index
    range(count).forEach((i) => {
      gsap.set([pages[i], labels[i]], { autoAlpha: i === index ? 1 : 0 })
      if (contents[i]) gsap.set(contents[i], { y: 0 })
    })
    gsap.set(fill, { scaleX: index / last })
    gsap.set(total, { color: index === last ? tokens.color.text : tokens.color.pager })
  }

  const go = (index: number) => {
    if (index === active) return
    if (active < 0) return place(index)
    const from = active
    const dir = index > from ? 1 : -1
    swap?.kill()
    active = index
    range(count).forEach((i) => {
      if (i !== from && i !== index) gsap.set([pages[i], labels[i]], { autoAlpha: 0 })
    })
    if (+gsap.getProperty(pages[index]!, 'opacity') === 0) gsap.set(contents[index], { y: lift * dir })
    // The old page leaves quickly; the new one starts once it is mostly gone, so the two never overlap.
    const out = animate ? swapOutSec : 0
    const inAt = animate ? swapInDelaySec : 0
    swap = gsap
      .timeline({ defaults: { duration, ease: swapEase } })
      .to(pages[from], { autoAlpha: 0, duration: out, ease: 'power1.in' }, 0)
      .to(contents[from], { y: -lift * dir, duration: out, ease: 'power1.in' }, 0)
      .to(labels[from], { autoAlpha: 0, duration: out }, 0)
      .to(pages[index], { autoAlpha: 1 }, inAt)
      .to(contents[index], { y: 0 }, inAt)
      .to(labels[index], { autoAlpha: 1 }, inAt)
      .to(fill, { scaleX: index / last }, 0)
      .to(total, { color: index === last ? tokens.color.text : tokens.color.pager }, inAt)
    writeSectionHash(index)
  }

  /** Chapter on screen: the last snap area whose top is less than half a screen away. */
  const chapterAt = (y: number) => {
    const half = window.innerHeight / 2
    let index = 0
    areas.forEach((area, i) => {
      if (area && area.offsetTop - half <= y) index = i
    })
    return index
  }

  /** The reel plays from the moment it starts rising until the next chapter covers it. */
  const syncReel = (y: number) => {
    if (!video || !areas[2]) return
    const visible = y > 1 && y < areas[2].offsetTop - 1
    if (visible && video.paused) video.play().catch(() => {})
    else if (!visible && !video.paused) video.pause()
  }

  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const y = self.scroll() - self.start
      go(chapterAt(y))
      syncReel(y)
    },
    onRefresh: (self) => place(chapterAt(self.scroll() - self.start)),
  })
  place(chapterAt(st.scroll() - st.start))

  return () => {
    swap?.kill()
    video?.pause()
  }
}

/**
 * The journey, played inside the phone. Every step is a snap stop; when a step becomes the
 * current one, the phone plays it: the new screen slides in from the right like app
 * navigation, scrolls to the button the user taps, and a tap ring pulses on it. It only moves
 * forward: scrolling back up leaves it on the last step played. On the right, the step list
 * only moves its highlight and rail.
 */
function setupJourney(root: HTMLElement, steps: CaseJourneyStep[], animate: boolean) {
  const area = root.querySelector<HTMLElement>('[data-case="area-2"]')
  const screen = root.querySelector<HTMLElement>('[data-case="app-screen"]')
  const track = root.querySelector<HTMLElement>('[data-case="app-track"]')
  const tap = root.querySelector<HTMLElement>('[data-case="tap"]')
  const rail = root.querySelector<HTMLElement>('[data-case="rail"]')
  const items = steps.map((_, i) => root.querySelector<HTMLElement>(`[data-case="step-${i}"]`))
  const contents = steps.map((_, i) => root.querySelector<HTMLElement>(`[data-case="app-${i}"]`))
  const stops = steps.map((_, i) => (i === 0 ? area : root.querySelector<HTMLElement>(`[data-case="stop-${i}"]`)))
  if (!area || !screen || !track || !tap || !rail) return
  const k = steps.length
  const { journey: cfg } = tokens.motion.caseStudy

  // Scale the 390px-wide screens to the phone.
  const resize = new ResizeObserver(([entry]) => {
    screen.style.setProperty('--app-scale', String(entry.contentRect.width / APP_WIDTH))
  })
  resize.observe(screen)

  // Live screens load only around the current step.
  const load = (i: number) => {
    const frame = contents[i]
    if (frame instanceof HTMLIFrameElement && !frame.src && frame.dataset.src) frame.src = frame.dataset.src
  }

  /** Scroll that brings a button a little above the middle of the screen, never past the content. */
  const scrollFor = (step: CaseJourneyStep, y: number) =>
    gsap.utils.clamp(0, Math.max(0, step.height - APP_VIEW), y - APP_VIEW * 0.55)
  /** Where a step's screen rests once it has been played. */
  const restingScroll = (step: CaseJourneyStep) => {
    const last = step.taps[step.taps.length - 1]
    return last ? scrollFor(step, last[1]) : Math.max(0, step.height - APP_VIEW)
  }

  let current = -1
  let play: gsap.core.Timeline | null = null

  const show = (index: number) => {
    // Only forward: scrolling back up keeps the phone (and the list) on the last step played;
    // scrolling down again resumes once the scroll passes that step.
    if (index <= current) return
    const from = current
    current = index
    play?.kill()
    load(index)
    load(index + 1)
    gsap.set(tap, { autoAlpha: 0 })

    const step = steps[index]
    const content = contents[index]
    const forward = from >= 0 && index === from + 1
    // The screen we arrive on starts at its top (it is still off screen at this point).
    gsap.set(content, { y: 0 })
    // Earlier screens rest where they were left, so the slide shows the tapped state.
    contents.forEach((c, j) => j < index && gsap.set(c, { y: -restingScroll(steps[j]) }))

    // Everything waits for the snap scroll to settle (not on first load or a deep link).
    const delay = animate && from >= 0 ? cfg.startDelaySec : 0
    const tl = gsap.timeline({ delay, defaults: { ease: cfg.ease } })
    tl.call(() => items.forEach((item, j) => item?.toggleAttribute('data-active', j === index)), undefined, 0)
    tl.to(rail, { scaleY: k > 1 ? index / (k - 1) : 1, duration: cfg.slideSec }, 0)
    if (!animate) {
      tl.set(track, { x: -index * APP_WIDTH }, 0).set(content, { y: -restingScroll(step) }, 0)
      play = tl
      return
    }
    if (forward) tl.to(track, { x: -index * APP_WIDTH, duration: cfg.slideSec, ease: 'power2.inOut' }, 0)
    else tl.set(track, { x: -index * APP_WIDTH }, 0)

    let t = (forward ? cfg.slideSec : 0) + cfg.holdSec
    if (step.taps.length) {
      step.taps.forEach(([x, y]) => {
        const scroll = scrollFor(step, y)
        tl.to(content, { y: -scroll, duration: cfg.scrollSec, ease: 'power1.inOut' }, t)
        t += cfg.scrollSec + 0.08
        tl.set(tap, { x: x - TAP_RADIUS, y: STATUS_BAR + y - scroll - TAP_RADIUS, autoAlpha: 0, scale: 0.4 }, t)
          .to(tap, { autoAlpha: 1, scale: 1, duration: cfg.tapSec * 0.45, ease: 'power2.out' }, t)
          .to(tap, { autoAlpha: 0, scale: 1.7, duration: cfg.tapSec * 0.55, ease: 'power1.in' }, t + cfg.tapSec * 0.45)
        t += cfg.tapSec + cfg.holdSec
      })
    } else {
      // Last screen: read it to the bottom.
      tl.to(content, { y: -restingScroll(step), duration: cfg.scrollSec * 2, ease: 'power1.inOut' }, t)
    }
    play = tl
  }

  /** Current step: the last stop the scroll has reached, counting half a step early. */
  const stepAt = (y: number) => {
    const gap = stops[1] && stops[0] ? stops[1].offsetTop - stops[0].offsetTop : window.innerHeight
    const half = gap / 2
    let index = 0
    stops.forEach((stop, i) => {
      if (stop && stop.offsetTop - half <= y) index = i
    })
    return index
  }

  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const y = self.scroll() - self.start
      if (y >= area.offsetTop - window.innerHeight * 0.5) show(stepAt(y))
    },
    onRefresh: (self) => {
      const y = self.scroll() - self.start
      if (y >= area.offsetTop - window.innerHeight * 0.5) show(stepAt(y))
    },
  })
  const y0 = st.scroll() - st.start
  if (y0 >= area.offsetTop - window.innerHeight * 0.5) show(stepAt(y0))
  else {
    items.forEach((item, j) => item?.toggleAttribute('data-active', j === 0))
    load(0)
    load(1)
  }

  return () => {
    play?.kill()
    resize.disconnect()
  }
}

export function CaseStudy({ study }: { study: CaseStudyContent }) {
  const { content: { caseStudies }, lang } = useLanguage()
  const navigate = useNavigate()
  const nextLabel = lang === 'es' ? 'Siguiente proyecto' : 'Next project'
  const revealRef = useReveal<HTMLDivElement>({ immediate: true })
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stackVideoRef = useRef<HTMLVideoElement | null>(null)
  const next = caseStudies.find((c) => c.slug === study.next)
  const [goal, results] = study.pages
  const { steps, hasJourney, count, k, areas, stops, totalHeight } = chapterLayout(study)
  const journeyLabel = study.journey?.label ?? ''
  const resultsIndex = count - 1

  useSnapScroll({ count, snapClass: SNAP_CLASS })

  // Chapter swaps and the journey, on the split layout only.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia(root)
    mm.add({ split: SPLIT, motion: MOTION_OK }, (ctx) => {
      if (!ctx.conditions?.split) return
      const animate = Boolean(ctx.conditions.motion)
      const stopJourney = hasJourney ? setupJourney(root, steps, animate) : undefined
      const stopSwaps = setupChapterSwaps(root, count, animate)
      return () => {
        stopJourney?.()
        stopSwaps()
      }
    })
    return () => mm.revert()
  }, [study.slug, count, hasJourney, steps])

  // Stacked layout: the reel plays only while visible.
  useEffect(() => {
    const video = stackVideoRef.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
      { threshold: 0.15 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [study.slug])

  // Escape closes the case, like the X.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate({ to: '/', hash: 'projects' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const setRefs = (el: HTMLDivElement | null) => {
    revealRef.current = el
    rootRef.current = el
  }

  const fade = { 'data-reveal': 'fade', 'data-reveal-fade-dur': `${tokens.motion.caseStudy.fadeInSec * 1000}ms` }

  const textPage = (index: number, eyebrow: string, heading: string, paragraphs: string[]) => (
    <div className={styles.content} data-case={`content-${index}`}>
      <span className={styles.caps}>{eyebrow}</span>
      <div className={styles.spaceLarge} />
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.spaceMedium} />
      <div className={styles.paragraphs}>
        {paragraphs.map((p, i) => (
          <p key={i} className={styles.paragraph}>
            {p}
          </p>
        ))}
      </div>
    </div>
  )

  return (
    <div ref={setRefs} className={styles.root} style={cssVars({ '--case-height': totalHeight })}>
      <Link to="/" hash="projects" className={styles.close} aria-label={lang === 'es' ? 'Cerrar caso' : 'Close case study'} {...fade}>
        <CloseIcon />
      </Link>

      {/* native snap points: one per chapter, plus one per journey step. No ids on purpose: the
          router scrolls to an element whose id matches the hash, which would fight the snap. */}
      <div className={styles.snapPoints} aria-hidden="true">
        {areas.map((top, i) => (
          <span key={`a${i}`} data-case={`area-${i}`} className={styles.snapPoint} style={cssVars({ '--top': top })} />
        ))}
        {stops.map((top, i) => (
          <span key={`s${i}`} data-case={`stop-${i + 1}`} className={styles.snapPoint} style={cssVars({ '--top': top })} />
        ))}
      </div>

      {/* pager: current chapter cross-fades over a dash that fills chapter by chapter */}
      <div className={styles.pager} aria-hidden="true">
        <span className={styles.pagerLabels}>
          {range(count).map((i) => (
            <span key={i} className={styles.pagerLabel} data-case={`label-${i}`}>
              {pad(i + 1)}
            </span>
          ))}
        </span>
        <span className={styles.dash}>
          <span className={styles.dashFill} data-case="dash" />
        </span>
        <span className={styles.pagerTotal} data-case="total">
          {pad(count)}
        </span>
      </div>

      {/* right-hand fixed panel: one page per chapter, stacked in place */}
      <div className={styles.panel} {...fade}>
        <div className={`${styles.page} ${styles.pageFirst}`} data-case="page-0">
          <div className={styles.content} data-case="content-0">
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
          <div className={styles.pageLink}>
            <a href={study.link.href} target="_blank" rel="noreferrer" className={styles.caseLink}>
              {study.link.label}
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div className={styles.page} data-case="page-1">
          {textPage(1, goal.label, goal.heading, goal.paragraphs)}
        </div>

        {hasJourney && (
          <div className={styles.page} data-case="page-2">
            <div className={styles.content} data-case="content-2">
              <span className={styles.caps}>{journeyLabel}</span>
              <div className={styles.spaceLarge} />
              <div className={styles.journey}>
                <span className={styles.rail} aria-hidden="true">
                  <span className={styles.railFill} data-case="rail" />
                </span>
                <ol className={styles.steps}>
                  {steps.map((step, i) => (
                    <li key={step.title} className={styles.step} data-case={`step-${i}`}>
                      <span className={styles.stepNumber}>{pad(i + 1)}</span>
                      <div className={styles.stepBody}>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <div className={styles.stepReveal}>
                          <p className={styles.stepText}>{step.text}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className={styles.page} data-case={`page-${resultsIndex}`}>
          {textPage(resultsIndex, results.label, results.heading, results.paragraphs)}
          {next && (
            <div className={styles.pageLink}>
              <Link to="/projects/$slug" params={{ slug: next.slug }} className={styles.caseLink}>
                {nextLabel}
                <ArrowIcon />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* left-hand sticky visuals: each one slides over the previous; the phone stays put through the journey */}
      <div className={styles.sections} {...fade}>
        <section className={styles.section} style={cssVars({ zIndex: 1 })}>
          <div className={styles.bg}>
            <img className={styles.bgImage} src={study.media.background} alt="" decoding="async" fetchPriority="high" />
            {study.media.device && <img className={styles.device} src={study.media.device} alt="" decoding="async" />}
          </div>
        </section>
        <section className={styles.section} style={cssVars({ zIndex: 2 })}>
          <div className={`${styles.bg} ${styles.bgVideo}`}>
            <video
              className={styles.video}
              data-case="reel"
              src={study.media.video}
              poster={study.media.videoPoster}
              loop
              muted
              playsInline
              preload="none"
            />
          </div>
        </section>
        {hasJourney && (
          <>
            <section className={styles.section} style={cssVars({ zIndex: 3 })}>
              <div className={`${styles.bg} ${styles.bgJourney}`}>
                <DeviceFrame>
                  <div className={styles.appScreen} data-case="app-screen">
                    <div className={styles.appViewport}>
                      <StatusBar />
                      <div className={styles.appTrack} data-case="app-track" style={cssVars({ '--steps': k })}>
                        {steps.map((step, i) => (
                          <div key={step.title} className={styles.appPanel}>
                            {step.app ? (
                              <iframe
                                className={styles.appContent}
                                data-case={`app-${i}`}
                                data-src={step.app}
                                title={step.title}
                                tabIndex={-1}
                                aria-hidden="true"
                                style={cssVars({ height: `${step.height}px` })}
                              />
                            ) : (
                              <img className={styles.appContent} data-case={`app-${i}`} src={step.screen} alt={step.title} decoding="async" />
                            )}
                          </div>
                        ))}
                      </div>
                      <span className={styles.tap} data-case="tap" aria-hidden="true" />
                    </div>
                  </div>
                </DeviceFrame>
              </div>
            </section>
            <div className={styles.journeySpacer} data-case="journey-spacer" style={cssVars({ '--steps': k - 1 })} aria-hidden="true" />
          </>
        )}
        <section className={styles.section} style={cssVars({ zIndex: 4 })}>
          <div className={styles.bg}>
            <img className={styles.bgImage} src={study.media.closing} alt="" loading="lazy" decoding="async" />
          </div>
        </section>
      </div>

      {/* stacked layout for small screens */}
      <div className={styles.stack}>
        <h1 className={styles.title}>{study.title}</h1>
        <img className={styles.stackImage} src={study.media.background} alt="" decoding="async" />
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
        <video
          ref={stackVideoRef}
          className={styles.stackVideo}
          src={study.media.video}
          poster={study.media.videoPoster}
          loop
          muted
          playsInline
          preload="none"
        />
        <div className={styles.stackBlock}>
          <span className={styles.caps}>{goal.label}</span>
          <h2 className={styles.heading}>{goal.heading}</h2>
          {goal.paragraphs.map((t, i) => (
            <p key={i} className={styles.paragraph}>
              {t}
            </p>
          ))}
        </div>
        {hasJourney && (
          <div className={styles.stackBlock}>
            <span className={styles.caps}>{journeyLabel}</span>
            <ol className={styles.stackSteps}>
              {steps.map((step, i) => (
                <li key={step.title} className={styles.stackStep}>
                  <span className={styles.stepNumber}>{pad(i + 1)}</span>
                  <h3 className={styles.heading}>{step.title}</h3>
                  <p className={styles.paragraph}>{step.text}</p>
                  <DeviceFrame className={styles.stackPhone}>
                    <img className={styles.stackScreen} src={step.screen} alt={step.title} loading="lazy" decoding="async" />
                  </DeviceFrame>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className={styles.stackBlock}>
          <span className={styles.caps}>{results.label}</span>
          <h2 className={styles.heading}>{results.heading}</h2>
          {results.paragraphs.map((t, i) => (
            <p key={i} className={styles.paragraph}>
              {t}
            </p>
          ))}
        </div>
        {next && (
          <Link to="/projects/$slug" params={{ slug: next.slug }} className={styles.button}>
            {nextLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
