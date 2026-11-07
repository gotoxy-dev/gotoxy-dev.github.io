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

/** A landscape website capture shown whole inside a minimal browser window. */
function BrowserFrame({
  src,
  host,
  priority,
  zoom,
}: {
  src: string
  host: string
  priority?: boolean
  /** Opens zoomed in on a point and pulls back when its chapter is entered (see setupChapterSwaps) */
  zoom?: { scale: number; origin: string }
}) {
  return (
    <figure
      className={styles.browser}
      {...(zoom ? { 'data-zoom-scale': zoom.scale, 'data-zoom-origin': zoom.origin } : {})}
    >
      <div className={styles.browserBar} aria-hidden="true">
        <span className={styles.browserDots}>
          <i />
          <i />
          <i />
        </span>
        {host && <span className={styles.browserUrl}>{host}</span>}
      </div>
      <img
        className={styles.browserShot}
        src={src}
        alt=""
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
      />
    </figure>
  )
}

/**
 * Phone with the journey's app screens side by side (live HTML, or a still for steps without
 * one), a status bar and the tap ring. A player drives it through its `data-case` hooks.
 */
function JourneyPhone({ steps, className }: { steps: CaseJourneyStep[]; className?: string }) {
  return (
    <DeviceFrame className={className}>
      <div className={styles.appScreen} data-case="app-screen">
        <div className={styles.appViewport}>
          <StatusBar />
          <div className={styles.appTrack} data-case="app-track" style={cssVars({ '--steps': steps.length })}>
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
  )
}

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
/**
 * Three chapters, each one a snap point: intro (cover), then the journey when the case has one
 * (the phone plays its steps on its own, see setupJourney) or else the goal (reel), and the results.
 */
function chapterLayout(study: CaseStudyContent) {
  const steps = study.journey?.steps ?? []
  const hasJourney = steps.length > 0
  const count = 3
  const k = steps.length
  /** CSS top of each chapter's snap point */
  const areas = range(count).map((i) => `calc(${i} * 100vh)`)
  return { steps, hasJourney, count, k, areas, totalHeight: `calc(${count} * 100vh)` }
}

/**
 * Chapter swaps: one short tween when the visible chapter changes. The outgoing panel page
 * fades out while moving against the scroll, the incoming one's lines rise in one after
 * another, and the pager follows. The left visuals are scrubbed by the scroll instead (see
 * setupVisualParallax), so they move with the snap itself.
 */
function setupChapterSwaps(root: HTMLElement, count: number, animate: boolean) {
  const { swapSec, swapOutSec, swapInDelaySec, swapEase, pageLiftPx: lift, lineLiftPx, lineStaggerSec } = tokens.motion.caseStudy
  const el = (key: string, i: number) => root.querySelector<HTMLElement>(`[data-case="${key}-${i}"]`)
  const pages = range(count).map((i) => el('page', i))
  const contents = range(count).map((i) => el('content', i))
  /** The lines of each page that rise in one by one */
  const lines = contents.map((c) => (c ? Array.from(c.children) : []))
  const labels = range(count).map((i) => el('label', i))
  const areas = range(count).map((i) => el('area', i))
  const fill = root.querySelector<HTMLElement>('[data-case="dash"]')
  const total = root.querySelector<HTMLElement>('[data-case="total"]')
  const video = root.querySelector<HTMLVideoElement>('[data-case="reel"]')
  const last = count - 1
  const duration = animate ? swapSec : 0

  // Closing capture that opens zoomed in on a point and pulls back once its chapter is entered.
  const zoomEl = root.querySelector<HTMLElement>('[data-zoom-scale]')
  const zoomScale = Number(zoomEl?.dataset.zoomScale ?? 1)
  const zoomOrigin = zoomEl?.dataset.zoomOrigin ?? '50% 50%'
  const { closingZoomSec, closingZoomDelaySec } = tokens.motion.caseStudy
  let zoomTween: gsap.core.Tween | null = null
  const zoomIn = () => {
    if (!zoomEl) return
    zoomTween?.kill()
    gsap.set(zoomEl, { scale: zoomScale, transformOrigin: zoomOrigin })
  }
  const pullBack = () => {
    if (!zoomEl) return
    zoomIn()
    zoomTween = gsap.to(zoomEl, {
      scale: 1,
      duration: animate ? closingZoomSec : 0,
      delay: animate ? closingZoomDelaySec : 0,
      ease: 'power3.inOut',
    })
  }

  let active = -1
  let swap: gsap.core.Timeline | null = null

  const place = (index: number) => {
    swap?.kill()
    if (index === last) pullBack()
    else zoomIn()
    active = index
    range(count).forEach((i) => {
      gsap.set([pages[i], labels[i]], { autoAlpha: i === index ? 1 : 0 })
      if (contents[i]) gsap.set(contents[i], { y: 0 })
      if (lines[i].length) gsap.set(lines[i], { autoAlpha: 1, y: 0 })
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
    if (index === last) pullBack()
    else if (from === last) zoomIn()
    active = index
    range(count).forEach((i) => {
      if (i !== from && i !== index) gsap.set([pages[i], labels[i]], { autoAlpha: 0 })
    })
    gsap.set(contents[index], { y: 0 })
    // The old page leaves quickly; the new one starts once it is mostly gone, so the two never overlap.
    const out = animate ? swapOutSec : 0
    const inAt = animate ? swapInDelaySec : 0
    swap = gsap
      .timeline({ defaults: { duration, ease: swapEase } })
      .to(pages[from], { autoAlpha: 0, duration: out, ease: 'power1.in' }, 0)
      .to(contents[from], { y: -lift * dir, duration: out, ease: 'power1.in' }, 0)
      .to(labels[from], { autoAlpha: 0, duration: out }, 0)
      .set(pages[index], { autoAlpha: 1 }, inAt)
      .fromTo(
        lines[index],
        { autoAlpha: 0, y: lineLiftPx * dir },
        { autoAlpha: 1, y: 0, stagger: animate ? lineStaggerSec : 0 },
        inAt,
      )
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
    zoomTween?.kill()
    video?.pause()
  }
}

/**
 * Left visuals, scrubbed by the scroll: while chapter i slides up over chapter i - 1, the
 * incoming visual settles from a slight zoom and the covered one recedes and dims, centred.
 */
function setupVisualParallax(root: HTMLElement, count: number) {
  const { visualZoom, visualRecede, visualDim } = tokens.motion.caseStudy
  const visuals = range(count).map((i) => root.querySelector<HTMLElement>(`[data-visual="${i}"]`))
  const areas = range(count).map((i) => root.querySelector<HTMLElement>(`[data-case="area-${i}"]`))
  const triggers = range(count)
    .slice(1)
    .map((i) => {
      const incoming = visuals[i]
      // The recede goes on the covered visual's section, so it never fights that visual's own
      // entrance zoom (a middle visual is both incoming and, later, covered).
      const covered = visuals[i - 1]?.parentElement
      const area = areas[i]
      if (!incoming || !covered || !area) return null
      const tl = gsap
        .timeline({ defaults: { ease: 'none' } })
        .fromTo(incoming, { scale: visualZoom }, { scale: 1 }, 0)
        .fromTo(covered, { scale: 1, autoAlpha: 1 }, { scale: visualRecede, autoAlpha: visualDim }, 0)
      return ScrollTrigger.create({
        trigger: root,
        start: () => `top+=${area.offsetTop - window.innerHeight} top`,
        end: () => `top+=${area.offsetTop} top`,
        scrub: true,
        animation: tl,
      })
    })
  return () => triggers.forEach((t) => t?.kill())
}

/**
 * Plays the journey inside one phone (`scope` holds its screen, track and tap ring). When a
 * step is shown, the new screen slides in from the right like app navigation, scrolls to the
 * button the user taps, and a tap ring pulses on it. `show` only moves forward (one step at a
 * time); `goto` jumps to any step. `onStep` runs when a step starts.
 */
function createPhonePlayer(
  scope: HTMLElement,
  steps: CaseJourneyStep[],
  animate: boolean,
  {
    delaySec,
    onStep,
    onIdle,
  }: {
    delaySec: number
    onStep?: (index: number) => void
    /** Runs when the phone has caught up with the last step asked for */
    onIdle?: () => void
  },
) {
  const screen = scope.querySelector<HTMLElement>('[data-case="app-screen"]')
  const track = scope.querySelector<HTMLElement>('[data-case="app-track"]')
  const tap = scope.querySelector<HTMLElement>('[data-case="tap"]')
  const contents = steps.map((_, i) => scope.querySelector<HTMLElement>(`[data-case="app-${i}"]`))
  if (!screen || !track || !tap) return null
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
  /** Last step asked for; the phone plays its way there one step at a time. */
  let target = -1
  let play: gsap.core.Timeline | null = null
  let playing = false

  /** Plays the step after the current one; when it ends, moves on until `target` is reached. */
  const advance = () => {
    if (current >= target) {
      const wasPlaying = playing
      playing = false
      if (wasPlaying) onIdle?.()
      return
    }
    playing = true
    // A jump of several steps (a deep link, the first load) is only skipped when nothing has
    // been played yet; after that every step plays in order, so no screen is ever cut.
    const index = current < 0 ? target : current + 1
    play = playStep(index, current)
    play.eventCallback('onComplete', advance)
  }

  /** Jumps straight to a step (no slide) and plays it from its start. */
  const goto = (index: number) => {
    play?.kill()
    playing = true
    target = index
    play = playStep(index, -1)
    play.eventCallback('onComplete', advance)
  }

  const show = (index: number) => {
    // Never animates backwards: an earlier step leaves the phone where it is.
    if (index <= current) {
      target = current
      return
    }
    target = index
    if (!playing) advance()
  }

  const playStep = (index: number, from: number) => {
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

    // The same beat before every step (the snap settling on desktop), except on first load or a
    // deep link. The step list highlight (`onStep`) and the slide start together after it.
    const delay = animate && from >= 0 ? delaySec : 0
    const tl = gsap.timeline({ delay, defaults: { ease: cfg.ease } })
    if (onStep) tl.call(() => onStep(index), undefined, 0)
    if (!animate) {
      tl.set(track, { x: -index * APP_WIDTH }, 0).set(content, { y: -restingScroll(step) }, 0)
      return tl
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
      // No tap: read the screen to the bottom.
      tl.to(content, { y: -restingScroll(step), duration: cfg.scrollSec * 2, ease: 'power1.inOut' }, t)
      t += cfg.scrollSec * 2
    }
    // Let the finished screen be read before the next step may start.
    tl.set({}, {}, t + cfg.holdSec)
    return tl
  }

  load(0)
  load(1)

  return {
    show,
    goto,
    /** Step the phone is on (-1 before the first one) */
    current: () => current,
    playing: () => playing,
    pause: () => play?.pause(),
    resume: () => play?.resume(),
    destroy: () => {
      play?.kill()
      resize.disconnect()
    },
  }
}

/**
 * Autoplay shared by both layouts: while the journey is on screen (`setVisible`) the phone plays
 * every step on its own, one after another; off screen it pauses and resumes where it stopped.
 * `goto` jumps to a step and carries on from there; the last step reveals the replay button.
 */
function createJourneyAutoplay(
  phone: HTMLElement,
  steps: CaseJourneyStep[],
  animate: boolean,
  { onStep, replay }: { onStep: (index: number) => void; replay: HTMLButtonElement | null },
) {
  const k = steps.length
  const { journey: cfg } = tokens.motion.caseStudy
  let visible = false

  const onIdle = () => {
    if (!player) return
    const i = player.current()
    if (i >= k - 1) {
      if (replay) replay.hidden = false
      return
    }
    if (visible) player.show(i + 1)
  }
  const player = createPhonePlayer(phone, steps, animate, {
    delaySec: cfg.startDelaySec,
    onStep: (index) => {
      onStep(index)
      if (replay) replay.hidden = true
    },
    onIdle,
  })
  if (!player) return null

  const setVisible = (next: boolean) => {
    if (next === visible) return
    visible = next
    if (!visible) return player.pause()
    if (player.current() < 0) return player.show(0)
    player.resume()
    // Paused between two steps: carry on from where it stopped.
    if (!player.playing()) onIdle()
  }
  const onReplay = () => player.goto(0)
  replay?.addEventListener('click', onReplay)

  return {
    setVisible,
    goto: player.goto,
    destroy: () => {
      replay?.removeEventListener('click', onReplay)
      player.destroy()
    },
  }
}

/** Wires a list of buttons so each one jumps the journey to its step. */
function bindStepButtons(buttons: (HTMLButtonElement | null | undefined)[], goto: (index: number) => void) {
  const offs = buttons.map((button, i) => {
    const onClick = () => goto(i)
    button?.addEventListener('click', onClick)
    return () => button?.removeEventListener('click', onClick)
  })
  return () => offs.forEach((off) => off())
}

/**
 * Desktop journey: one chapter of the scroll, played by `createJourneyAutoplay`. The step list
 * follows the phone (highlight + rail) and each title jumps to its step.
 */
function setupJourney(root: HTMLElement, steps: CaseJourneyStep[], animate: boolean) {
  const area = root.querySelector<HTMLElement>('[data-case="area-1"]')
  const after = root.querySelector<HTMLElement>('[data-case="area-2"]')
  const phone = root.querySelector<HTMLElement>('[data-case="phone-split"]')
  const rail = root.querySelector<HTMLElement>('[data-case="rail"]')
  const replay = root.querySelector<HTMLButtonElement>('[data-case="replay"]')
  const items = steps.map((_, i) => root.querySelector<HTMLElement>(`[data-case="step-${i}"]`))
  if (!area || !after || !phone || !rail) return
  const k = steps.length
  const { journey: cfg } = tokens.motion.caseStudy

  const autoplay = createJourneyAutoplay(phone, steps, animate, {
    replay,
    onStep: (index) => {
      items.forEach((item, j) => item?.toggleAttribute('data-active', j === index))
      gsap.to(rail, { scaleY: k > 1 ? index / (k - 1) : 1, duration: cfg.slideSec, ease: cfg.ease })
    },
  })
  if (!autoplay) return

  // On screen: from half a screen before the chapter until half a screen before the next one.
  const sync = (y: number) => {
    const half = window.innerHeight / 2
    autoplay.setVisible(y >= area.offsetTop - half && y < after.offsetTop - half)
  }
  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => sync(self.scroll() - self.start),
    onRefresh: (self) => sync(self.scroll() - self.start),
  })
  items.forEach((item, j) => item?.toggleAttribute('data-active', j === 0))
  sync(st.scroll() - st.start)
  const unbind = bindStepButtons(items.map((item) => item?.querySelector('button')), autoplay.goto)

  return () => {
    unbind()
    st.kill()
    autoplay.destroy()
  }
}

/**
 * Mobile journey: the phone fills one screen and plays on its own (`createJourneyAutoplay`)
 * while most of it is visible. The caption under it swaps with each step, and a row of dots
 * jumps to any step.
 */
function setupMobileJourney(root: HTMLElement, steps: CaseJourneyStep[], animate: boolean) {
  const stage = root.querySelector<HTMLElement>('[data-case="stage-stack"]')
  const phone = root.querySelector<HTMLElement>('[data-case="phone-stack"]')
  const replay = root.querySelector<HTMLButtonElement>('[data-case="replay-stack"]')
  const captions = steps.map((_, i) => root.querySelector<HTMLElement>(`[data-case="caption-${i}"]`))
  const dots = steps.map((_, i) => root.querySelector<HTMLButtonElement>(`[data-case="dot-${i}"]`))
  if (!stage || !phone) return
  const { journey: cfg } = tokens.motion.caseStudy
  const swap = animate ? cfg.slideSec : 0

  let shown = -1
  const showCaption = (index: number) => {
    captions.forEach((caption, j) => {
      if (!caption) return
      if (j === index) gsap.fromTo(caption, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: swap, ease: cfg.ease })
      else if (j === shown) gsap.to(caption, { autoAlpha: 0, y: -12, duration: swap * 0.6, ease: 'power1.in' })
      else gsap.set(caption, { autoAlpha: 0 })
    })
    dots.forEach((dot, j) => dot?.toggleAttribute('data-active', j === index))
    shown = index
  }

  const autoplay = createJourneyAutoplay(phone, steps, animate, { replay, onStep: showCaption })
  if (!autoplay) return
  showCaption(0)

  const io = new IntersectionObserver(([entry]) => autoplay.setVisible(entry.isIntersecting), { threshold: 0.6 })
  io.observe(stage)
  const unbind = bindStepButtons(dots, autoplay.goto)

  return () => {
    unbind()
    io.disconnect()
    autoplay.destroy()
  }
}

export function CaseStudy({ study }: { study: CaseStudyContent }) {
  const { content: { caseStudies }, lang } = useLanguage()
  const navigate = useNavigate()
  const nextLabel = lang === 'es' ? 'Siguiente proyecto' : 'Next project'
  const replayLabel = lang === 'es' ? 'Ver de nuevo' : 'Watch again'
  const revealRef = useReveal<HTMLDivElement>({ immediate: true })
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stackVideoRef = useRef<HTMLVideoElement | null>(null)
  const next = caseStudies.find((c) => c.slug === study.next)
  const [goal, results] = study.pages
  const { steps, hasJourney, count, k, areas, totalHeight } = chapterLayout(study)
  const journeyLabel = study.journey?.label ?? ''
  const host = (() => {
    try {
      return new URL(study.link.href).host.replace(/^www\./, '')
    } catch {
      return ''
    }
  })()
  const resultsIndex = count - 1

  useSnapScroll({ count, snapClass: SNAP_CLASS })

  // Split layout: chapter swaps and the snapped journey. Stacked layout: the pinned-phone journey.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia(root)
    mm.add({ split: SPLIT, motion: MOTION_OK }, (ctx) => {
      const animate = Boolean(ctx.conditions?.motion)
      if (!ctx.conditions?.split) return hasJourney ? setupMobileJourney(root, steps, animate) : undefined
      const stopJourney = hasJourney ? setupJourney(root, steps, animate) : undefined
      const stopSwaps = setupChapterSwaps(root, count, animate)
      const stopParallax = animate ? setupVisualParallax(root, count) : undefined
      return () => {
        stopJourney?.()
        stopSwaps()
        stopParallax?.()
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

      {/* native snap points: one per chapter. No ids on purpose: the
          router scrolls to an element whose id matches the hash, which would fight the snap. */}
      <div className={styles.snapPoints} aria-hidden="true">
        {areas.map((top, i) => (
          <span key={`a${i}`} data-case={`area-${i}`} className={styles.snapPoint} style={cssVars({ '--top': top })} />
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

        {!hasJourney && (
          <div className={styles.page} data-case="page-1">
            {textPage(1, goal.label, goal.heading, goal.paragraphs)}
          </div>
        )}

        {hasJourney && (
          <div className={`${styles.page} ${styles.pageJourney}`} data-case="page-1">
            <div className={styles.content} data-case="content-1">
              <span className={styles.caps}>{journeyLabel}</span>
              <div className={styles.spaceLarge} />
              <div className={styles.journey}>
                <span className={styles.rail} aria-hidden="true">
                  <span className={styles.railFill} data-case="rail" />
                </span>
                <ol className={styles.steps}>
                  {steps.map((step, i) => (
                    <li key={step.title} className={styles.step} data-case={`step-${i}`}>
                      <button type="button" className={styles.stepButton}>
                        <span className={styles.stepNumber}>{pad(i + 1)}</span>
                        <span className={styles.stepBody}>
                          <span className={styles.stepTitle}>{step.title}</span>
                          <span className={styles.stepReveal}>
                            <span className={styles.stepText}>{step.text}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <button type="button" className={styles.replay} data-case="replay" hidden>
                {replayLabel}
              </button>
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

      {/* left-hand sticky visuals: each one slides over the previous, which recedes and dims */}
      <div className={styles.sections} {...fade}>
        <section className={styles.section} style={cssVars({ zIndex: 1 })}>
          {study.media.screenshot ? (
            <div className={`${styles.bg} ${styles.bgFramed}`} data-visual="0">
              <img className={styles.ambient} src={study.media.background} alt="" aria-hidden="true" decoding="async" />
              <BrowserFrame src={study.media.background} host={host} priority />
            </div>
          ) : (
            <div className={styles.bg} data-visual="0">
              <img className={styles.bgImage} src={study.media.background} alt="" decoding="async" fetchPriority="high" />
              {study.media.device && <img className={styles.device} src={study.media.device} alt="" decoding="async" />}
            </div>
          )}
        </section>
        {hasJourney ? (
          <section className={styles.section} style={cssVars({ zIndex: 2 })}>
            <div className={`${styles.bg} ${styles.bgJourney}`} data-case="phone-split" data-visual="1">
              <img className={styles.ambient} src={study.media.background} alt="" aria-hidden="true" decoding="async" />
              <JourneyPhone steps={steps} className={styles.splitPhone} />
            </div>
          </section>
        ) : (
          <section className={styles.section} style={cssVars({ zIndex: 2 })}>
            <div className={`${styles.bg} ${styles.bgVideo}`} data-visual="1">
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
        )}
        <section className={styles.section} style={cssVars({ zIndex: 3 })}>
          {study.media.screenshot ? (
            <div className={`${styles.bg} ${styles.bgFramed} ${styles.bgSolid}`} data-visual="2">
              <img className={styles.ambient} src={study.media.closing} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <BrowserFrame src={study.media.closing} host={host} zoom={study.media.closingZoom} />
            </div>
          ) : (
            <div className={`${styles.bg} ${styles.bgSolid}`} data-visual="2">
              <img className={styles.bgImage} src={study.media.closing} alt="" loading="lazy" decoding="async" />
            </div>
          )}
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
        {!hasJourney && (
          <>
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
          </>
        )}
        {hasJourney && (
          <div className={styles.stackBlock}>
            <span className={styles.caps}>{journeyLabel}</span>
            {/* one screen: the phone plays on its own, its caption swaps with each step */}
            <div className={styles.mJourney} data-case="stage-stack">
              <div className={styles.mPhoneLayer} data-case="phone-stack">
                <JourneyPhone steps={steps} className={styles.mPhone} />
                <ol className={styles.mCaptions}>
                  {steps.map((step, i) => (
                    <li key={step.title} className={styles.mCaption} data-case={`caption-${i}`}>
                      <span className={styles.stepNumber}>{`${pad(i + 1)} / ${pad(k)}`}</span>
                      <h3 className={styles.mCaptionTitle}>{step.title}</h3>
                      <p className={styles.mCaptionText}>{step.text}</p>
                    </li>
                  ))}
                </ol>
                <div className={styles.mControls}>
                  <div className={styles.mDots}>
                    {steps.map((step, i) => (
                      <button key={step.title} type="button" className={styles.mDot} data-case={`dot-${i}`} aria-label={`${pad(i + 1)} · ${step.title}`} />
                    ))}
                  </div>
                  <button type="button" className={styles.replay} data-case="replay-stack" hidden>
                    {replayLabel}
                  </button>
                </div>
              </div>
            </div>
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
