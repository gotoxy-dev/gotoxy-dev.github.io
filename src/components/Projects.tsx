import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from '@tanstack/react-router'
import type { Project } from '@/content/site'
import { useContent } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { useInView } from '@/hooks/useInView'
import { useScrub } from '@/hooks/useScrub'
import { tokens } from '@/theme/tokens'
import { caseOpen, markCaseOpen, RETURN_NAME_MS, returningSlug, supportsViewTransitions } from '@/transitions'
import { BrowserFrame, hostOf } from './BrowserFrame'
import styles from './Projects.module.css'

export function Projects() {
  const { projects, caseStudies } = useContent()
  const sectionRef = useRef<HTMLElement | null>(null)

  // Back from a case whose card is not on the home: land on the project list.
  useLayoutEffect(() => {
    const slug = returningSlug()
    const study = caseStudies.find((c) => c.slug === slug)
    const listed = study && projects.some((p) => p.featured && p.id === study.projectId)
    if (slug && !listed) sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [projects, caseStudies])

  return (
    <section ref={sectionRef} className={styles.section} id="projects">
      <div className={`container ${styles.list}`}>
        {projects.filter((p) => p.featured).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}

/**
 * Reference "hp-product-while-scrolling" keyframes (scroll progress 0..1):
 *   title wrapper: y 40px → 0 (50%) → 20px (100%), opacity 0 → 1 (33%)
 *   media wrapper: y 80px → 0 (50%) → 40px (100%), opacity 0 → 1 (33%)
 */
function buildCardScrub(tl: gsap.core.Timeline, root: HTMLElement) {
  const head = root.querySelector<HTMLElement>('[data-scrub="head"]')
  const media = root.querySelector<HTMLElement>('[data-scrub="media"]')
  const { projectTitle, projectMedia } = tokens.motion.distance
  const restY = (from: string) => `${parseFloat(from) / 2}px`

  if (head) {
    tl.fromTo(head, { y: projectTitle, opacity: 0 }, { opacity: 1, duration: 0.33 }, 0)
    tl.to(head, { y: 0, duration: 0.5 }, 0)
    tl.to(head, { y: restY(projectTitle), duration: 0.5 }, 0.5)
  }
  if (media) {
    tl.fromTo(media, { y: projectMedia, opacity: 0 }, { opacity: 1, duration: 0.33 }, 0)
    tl.to(media, { y: 0, duration: 0.5 }, 0)
    tl.to(media, { y: restY(projectMedia), duration: 0.5 }, 0.5)
  }
}

/** Gives a card's media and browser window the case transition names (or takes them away). */
function nameCard(media: HTMLElement | null, browser: HTMLElement | null, on = true) {
  const name = (el: HTMLElement | null, value: string) => {
    if (!el) return
    el.style.viewTransitionName = on ? value : ''
    el.toggleAttribute('data-case-name', on)
  }
  name(media, caseOpen.visual)
  name(browser, caseOpen.browser)
}

function ProjectCard({ project }: { project: Project }) {
  const { caseStudies } = useContent()
  const study = caseStudies.find((c) => c.projectId === project.id)
  // website cases show their capture in a browser window, like the case's first visual
  const framed = study?.media.screenshot ? study : undefined
  const lineRef = useReveal<HTMLDivElement>({ offset: 50 })
  const scrubRef = useScrub<HTMLAnchorElement>(buildCardScrub)
  const { ref: mediaRef, inView } = useInView<HTMLDivElement>({ rootMargin: '200px 0px', threshold: 0.01 })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const browserRef = useRef<HTMLElement | null>(null)
  const [playing, setPlaying] = useState(false)

  // Plain clicks open the case through a view transition: name this card's media and window
  // so they morph into the case's first visual (modified clicks open a tab as usual).
  const onOpen = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !supportsViewTransitions()) return
    // a name can only be used once per page: drop any left on a card that just came back
    document.querySelectorAll<HTMLElement>('[data-case-name]').forEach((el) => nameCard(el, null, false))
    nameCard(mediaRef.current, browserRef.current)
    markCaseOpen()
  }

  // Back from this card's case: name the card again so the case visual grows back into it,
  // and bring it into view before the home is captured.
  useLayoutEffect(() => {
    const media = mediaRef.current
    if (!study || !media || returningSlug() !== study.slug) return
    nameCard(media, browserRef.current)
    media.scrollIntoView({ block: 'center', behavior: 'instant' })
    const clear = window.setTimeout(() => nameCard(media, browserRef.current, false), RETURN_NAME_MS)
    return () => window.clearTimeout(clear)
  }, [study, mediaRef])

  // Play only while visible (mirrors Vimeo background embeds that pause offscreen).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    } else {
      v.pause()
    }
  }, [inView])

  const body = (
    <>
      <div ref={lineRef} className={styles.lineWrap}>
        <div className="hairline" data-reveal="width" data-reveal-dur={tokens.motion.duration.d800} />
      </div>
      <div className={styles.head} data-scrub="head">
        <span className={styles.name}>{project.name}</span>
        <span className={styles.tags}>
          {project.tags.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </span>
        {/* reference phones: tags give way to a ↘ arrow */}
        <svg className={styles.arrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M2 2l10 10M12 4v8H4" />
        </svg>
      </div>

      <div className={styles.mediaWrap} data-scrub="media">
        <div ref={mediaRef} className={styles.media}>
          {framed ? (
            <div className={styles.framed}>
              <img className={styles.ambient} src={framed.media.background} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <BrowserFrame ref={browserRef} src={framed.media.background} host={hostOf(framed.link.href)} className={styles.browser} />
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={inView || playing ? project.video : undefined}
                poster={project.poster}
                muted
                loop
                playsInline
                preload="metadata"
              />
              <img className={`${styles.poster} ${playing ? styles.hidden : ''}`} src={project.poster} alt="" aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </>
  )

  if (!study) {
    return (
      <a ref={scrubRef} href={project.href} className={styles.card}>
        {body}
      </a>
    )
  }
  return (
    <Link
      ref={scrubRef}
      to="/projects/$slug"
      params={{ slug: study.slug }}
      onClick={onOpen}
      className={styles.card}
    >
      {body}
    </Link>
  )
}
