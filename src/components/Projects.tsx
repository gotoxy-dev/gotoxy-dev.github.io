import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { Project } from '@/content/site'
import { useContent } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { useInView } from '@/hooks/useInView'
import { useScrub, type ScrubOptions } from '@/hooks/useScrub'
import { prefersReducedMotion } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import { caseOpen, markCaseOpen, RETURN_NAME_MS, returningSlug, supportsViewTransitions } from '@/transitions'
import { BrowserFrame, hostOf } from './BrowserFrame'
import { showcases } from './showcase'
import { SHOWCASE_PREPARE, type ShowcasePrepareEvent } from './showcase/events'
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
 * Desktop and tablets scrub while the card crosses the middle of the screen (`top 50%` →
 * `bottom 50%`). A phone card is a third of the screen tall, so that window left the lower half
 * of the screen empty: on phones the same keyframes run while the card's top travels from the
 * bottom edge to the middle (shown as it enters, settled above the middle), with the travel
 * scaled to the phone media (`motion.distance.phone`).
 */
const CARD_SCRUB: ScrubOptions = { phone: { start: 'top bottom', end: 'top 50%' } }

function buildCardScrub(tl: gsap.core.Timeline, root: HTMLElement, phone: boolean) {
  const media = root.querySelector<HTMLElement>('[data-scrub="media"]')
  const { projectTitle, projectMedia } = phone ? tokens.motion.distance.phone : tokens.motion.distance
  // half the entry travel, in the token's own unit (px on desktop, vw on phones)
  const restY = (from: string) => `${parseFloat(from) / 2}${from.replace(/^[\d.]+/, '')}`

  // the presentation card's description moves with the title row
  root.querySelectorAll<HTMLElement>('[data-scrub="head"], [data-scrub="text"]').forEach((el) => {
    tl.fromTo(el, { y: projectTitle, opacity: 0 }, { opacity: 1, duration: 0.33 }, 0)
    tl.to(el, { y: 0, duration: 0.5 }, 0)
    tl.to(el, { y: restY(projectTitle), duration: 0.5 }, 0.5)
  })
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
  // cases with visuals drawn in code show their presentation board, like the case's first visual
  const Board = study?.showcase ? showcases[study.showcase.id].Board : undefined
  // website cases show their capture in a browser window, like the case's first visual
  const framed = !Board && study?.media.screenshot ? study : undefined
  const feature = project.feature
  const lineRef = useReveal<HTMLDivElement>({ offset: 50 })
  const navigate = useNavigate()
  const scrubRef = useScrub<HTMLAnchorElement>(buildCardScrub, CARD_SCRUB)
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
    // a showcase board first brings itself into the state the case cover starts from, then we navigate
    const board = mediaRef.current?.querySelector<HTMLElement>('[data-showcase-board]')
    if (board && study && !prefersReducedMotion()) {
      e.preventDefault()
      const ready = () => {
        markCaseOpen()
        navigate({ to: '/projects/$slug', params: { slug: study.slug } })
      }
      board.dispatchEvent(new CustomEvent(SHOWCASE_PREPARE, { detail: { ready } }) satisfies ShowcasePrepareEvent)
      return
    }
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

  const media = (
    <div className={styles.mediaWrap} data-scrub="media">
      <div ref={mediaRef} className={`${styles.media} ${feature ? styles.mediaSplit : ''}`}>
        {Board && study?.showcase ? (
          <Board label={study.showcase.boardLabel} zoomOnHover />
        ) : framed ? (
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
  )

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

      {feature ? (
        // presentation card (reference noomo slide): the description on the left, the image on the right
        <div className={styles.split}>
          <div className={styles.feature} data-scrub="text">
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureText}>{feature.text}</p>
            <span className={styles.featureCta}>
              {feature.cta}
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 12L12 2M4 2h8v8" />
              </svg>
            </span>
          </div>
          {media}
        </div>
      ) : (
        media
      )}
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
      className={`${styles.card} ${feature ? styles.cardSplit : ''}`}
    >
      {body}
    </Link>
  )
}
