import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CaseShowcase } from '@/content/site'
import { gsap, prefersReducedMotion } from '@/theme/motion'
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
 * restart lands on the right frame. `active` restarts it from 0 each time it turns true and pauses
 * it when false. With reduced motion nothing plays: each segment shows a composed still and the
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
  const start = () => (reduced ? seek(HOLD[0], false) : seek(0, true))

  // Build the film once per story (copy and figures); declared before the `active` effect so a
  // rebuilt film picks up the current focus.
  useLayoutEffect(() => {
    const root = rootRef.current
    const frame = frameRef.current
    if (!root || !frame) return
    const built: { film?: FilmHandle } = {}
    const ctx = gsap.context(() => {
      built.film = buildFilm(root, frame, story, setView, () => fillRefs.current)
    }, root)
    const handle = built.film
    if (!handle) return () => ctx.revert()
    handle.tl.eventCallback('onComplete', () => setPlaying(false))
    filmRef.current = handle
    handle.resize()
    const observer = new ResizeObserver(() => handle.resize())
    observer.observe(frame)
    if (reduced || activeRef.current) start()
    else handle.sync(0)

    return () => {
      observer.disconnect()
      filmRef.current = null
      handle.dispose()
      ctx.revert()
    }
    // `start` only reads refs and `reduced` (fixed for the component's life)
  }, [story])

  // Focus: each time the chapter becomes active it plays from the start; leaving it pauses.
  useEffect(() => {
    if (activeRef.current === active) return
    activeRef.current = active
    if (active) start()
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

      <div ref={frameRef} className={styles.frame}>
        <div className={styles.stage} aria-hidden="true">
          <Film story={story} />
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
          {/* section titles: large in the centre, then to the top-left, then smaller (story/timeline.ts) */}
          {labels.map((label, i) => (
            <span key={`${i}-${label}`} className={styles.sectionTitle} data-film="title">
              {label}
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
