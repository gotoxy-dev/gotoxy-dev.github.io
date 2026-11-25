import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CaseShowcase } from '@/content/site'
import { gsap, prefersReducedMotion } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import { HOLD, SEEK, SEGMENTS } from './story/script'
import { Film } from './story/Film'
import { buildFilm, type Film as FilmHandle, type FilmView } from './story/timeline'
import styles from './CamStory.module.css'

/**
 * Instituto CAM story (case chapter 2): a 3D film drawn in code, ≈ 72 s (motion.showcase
 * filmSegmentsSec). The CAM panel screens float in a 3D world and a virtual camera cuts between
 * them (crash zooms, dollies, orbits, whip pans with motion blur, depth of field), with one giant
 * word per cut, records converging as particles and a burst of WhatsApp messages:
 *
 * 0. Problem, five beats: the sheet typed by hand (duplicates, bad phones), one WhatsApp at a
 *    time against 3.000, Moodle accounts by hand, payments on paper, copies nobody can trace.
 * 1–5. The real process: signup, cross-check by commission, WhatsApp campaigns with the Moodle
 *    class details, payments, reports with statistics, campaign errors and kinds of issue.
 * 6. Results: the whole platform, `story.stats` counting up.
 *
 * Every visible state is a function of the timeline's time (story/timeline.ts), so a seek or a
 * restart lands on the right frame. `active` plays it from 0 the first time it turns true, pauses
 * it when false and resumes from that frame when it turns true again (from 0 once it has ended). With reduced motion nothing plays: each segment shows a composed still and the
 * segment buttons switch between them.
 */

const PROBLEM = 0
const RESULTS = SEGMENTS - 1

export function CamStory({ story, active, className }: { story: CaseShowcase['story']; active: boolean; className?: string }) {
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([])
  const filmRef = useRef<FilmHandle | null>(null)
  const activeRef = useRef(active)
  const startedRef = useRef(false)
  const [view, setView] = useState<FilmView>({ segment: 0, ended: false })
  const [playing, setPlaying] = useState(false)
  const [reduced] = useState(prefersReducedMotion)

  /** Jump to `t` (rendering that frame now), then play or stay paused */
  const seek = (t: number, play: boolean) => {
    const film = filmRef.current
    if (!film) return
    film.tl.pause(t)
    film.sync(t)
    if (play) film.tl.play()
    setPlaying(play)
  }
  const start = () => {
    if (!filmRef.current) return // not built yet: the build starts it if the chapter is in focus
    startedRef.current = true
    if (reduced) seek(HOLD[0], false)
    else seek(0, true)
  }
  /** Back in focus: carry on from where it was left; from the start the first time or once it has ended */
  const resume = () => {
    const tl = filmRef.current?.tl
    if (!tl || !startedRef.current || (!reduced && tl.progress() >= 1)) return start()
    if (reduced) return
    tl.play()
    setPlaying(true)
  }

  /*
   * Building the film is a long task (about a second), and the case page mounts inside the card's
   * view transition, which waits for it. So the film is only built once its frame is laid out (the
   * case page renders a split and a stacked copy, one of them hidden) and either its chapter is in
   * focus or the page has been idle for `filmBuildDelaySec`, after the transition has played.
   */
  const [laidOut, setLaidOut] = useState(false)
  const [idle, setIdle] = useState(false)
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => setLaidOut(entry.contentRect.width > 0))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    let idleId = 0
    const timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => setIdle(true))
      else setIdle(true)
    }, tokens.motion.showcase.filmBuildDelaySec * 1000)
    return () => {
      window.clearTimeout(timer)
      if (idleId) window.cancelIdleCallback(idleId)
    }
  }, [])
  useEffect(() => {
    if (laidOut && (active || idle)) setArmed(true)
  }, [laidOut, active, idle])

  // Leaving the page: the film's DOM goes with it, so its animations are killed, not reverted
  // (reverting restores every inline style, another long task inside the closing transition).
  // Declared before the build effect: cleanups run in this order.
  const unmountingRef = useRef(false)
  useLayoutEffect(() => {
    unmountingRef.current = false
    return () => {
      unmountingRef.current = true
    }
  }, [])

  // Build the film once per story (copy and figures); declared before the `active` effect so a
  // rebuilt film picks up the current focus.
  useLayoutEffect(() => {
    const root = rootRef.current
    const frame = frameRef.current
    if (!armed || !root || !frame) return
    const built: { film?: FilmHandle } = {}
    const ctx = gsap.context(() => {
      built.film = buildFilm(root, frame, story, setView, () => fillRefs.current, reduced)
    }, root)
    const handle = built.film
    if (!handle) return () => ctx.revert()
    handle.tl.eventCallback('onComplete', () => setPlaying(false))
    filmRef.current = handle
    handle.resize()
    startedRef.current = false // a rebuilt film (new copy) plays from its start
    const observer = new ResizeObserver(() => handle.resize())
    observer.observe(frame)
    if (reduced || activeRef.current) start()
    else handle.sync(0)

    return () => {
      observer.disconnect()
      filmRef.current = null
      if (unmountingRef.current) return ctx.kill()
      handle.dispose()
      ctx.revert()
    }
    // `start` only reads refs and `reduced` (fixed for the component's life)
  }, [story, armed])

  // Focus: the first time the chapter becomes active it plays from the start; leaving it pauses,
  // and coming back carries on from that frame.
  useEffect(() => {
    if (activeRef.current === active) return
    activeRef.current = active
    if (active) resume()
    else if (!reduced) {
      filmRef.current?.tl.pause()
      setPlaying(false)
    }
  }, [active])

  const toggle = () => {
    const tl = filmRef.current?.tl
    if (!tl) return
    if (view.ended) seek(0, true)
    else if (playing) {
      tl.pause()
      setPlaying(false)
    } else {
      tl.play()
      setPlaying(true)
    }
  }
  const goTo = (i: number) => (reduced ? seek(HOLD[i], false) : seek(SEEK[i], true))

  const labels = [story.scenes[0].label, ...story.words, story.scenes[2].label]
  /** What each section is about, under its big title on the entry card */
  const subtitles = [story.scenes[0].title, ...story.steps, story.scenes[2].title]
  const scene = view.segment === PROBLEM ? 0 : view.segment === RESULTS ? 2 : 1
  const texts = [story.scenes[0].text, ...story.steps, story.scenes[2].text]
  const toggleLabel = view.ended ? story.replay : playing ? story.pause : story.play
  const toggleIcon = view.ended ? 'replay' : playing ? 'pause' : 'play'
  const steps = SEGMENTS - 2

  return (
    <figure ref={rootRef} className={`${styles.root} ${className ?? ''}`}>
      <div className={styles.controls}>
        <div className={styles.segments}>
          {labels.map((label, i) => (
            <button
              key={`${i}-${label}`}
              type="button"
              className={`${styles.segment} tap-area`}
              aria-label={label}
              aria-current={view.segment === i ? 'step' : undefined}
              onClick={() => goTo(i)}
            >
              <span className={styles.track}>
                <span
                  className={styles.fill}
                  ref={(el) => {
                    fillRefs.current[i] = el
                  }}
                />
              </span>
            </button>
          ))}
        </div>
        {!reduced && (
          <button type="button" className={`${styles.toggle} tap-area`} onClick={toggle}>
            <ToggleIcon kind={toggleIcon} />
            <span>{toggleLabel}</span>
          </button>
        )}
      </div>

      <div ref={frameRef} className={styles.frame} data-built={armed || undefined}>
        <div className={styles.stage} aria-hidden="true">
          {/* the film's DOM (every screen of every set) mounts with its build, not with the page */}
          {armed && <Film story={story} />}
          {/* band: the section title rests at its top-left, step index and running time at its top-right */}
          <div className={styles.band} data-film="band">
            <span className={styles.hud}>
              <span className={styles.rec} />
              {view.segment > PROBLEM && view.segment < RESULTS && (
                <span>{`${String(view.segment).padStart(2, '0')} / ${String(steps).padStart(2, '0')}`}</span>
              )}
              <span data-film="timecode">00:00</span>
            </span>
          </div>
          {/* section entry: a white or black card, the title large on it, then to the top-left and smaller (story/timeline.ts) */}
          <span className={styles.entryCard} data-film="entry-card" />
          {labels.map((label, i) => (
            <span key={`${i}-${label}`} className={styles.sectionTitle} data-film="title">
              {label}
            </span>
          ))}
          {subtitles.map((text, i) => (
            <span key={`${i}-${text}`} className={styles.sectionSub} data-film="subtitle">
              {text}
            </span>
          ))}
        </div>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.eyebrow}>
          <span>{story.label}</span>
          <span className={styles.rule} />
          <span className={styles.stack}>
            {story.scenes.map((s, i) => (
              <span key={s.label} className={styles.layer} data-on={scene === i || undefined}>
                {s.label}
              </span>
            ))}
          </span>
        </span>
        <span className={`${styles.stack} ${styles.title}`}>
          {story.scenes.map((s, i) => (
            <span key={s.label} className={styles.layer} data-on={scene === i || undefined}>
              {s.title}
            </span>
          ))}
        </span>
        <span className={`${styles.stack} ${styles.text}`}>
          {texts.map((text, i) => (
            <span key={`${i}-${text}`} className={styles.layer} data-on={view.segment === i || undefined}>
              {text}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}

function ToggleIcon({ kind }: { kind: 'play' | 'pause' | 'replay' }) {
  return (
    <svg viewBox="0 0 16 16" className={styles.icon} aria-hidden="true">
      {kind === 'play' && <path d="M4 2.5v11l9-5.5Z" />}
      {kind === 'pause' && <path d="M4 2.5h3v11H4Zm5 0h3v11H9Z" />}
      {kind === 'replay' && (
        <>
          <path d="M13 8a5 5 0 1 1-1.5-3.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M13.2 1.8v3.6H9.6Z" />
        </>
      )}
    </svg>
  )
}
