import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/content/site'
import { useContent } from '@/i18n'
import { useReveal } from '@/hooks/useReveal'
import { useInView } from '@/hooks/useInView'
import { useScrub } from '@/hooks/useScrub'
import { tokens } from '@/theme/tokens'
import styles from './Projects.module.css'

export function Projects() {
  const { projects } = useContent()
  return (
    <section className={styles.section} id="projects">
      <div className={`container ${styles.list}`}>
        {projects.map((p) => (
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

function ProjectCard({ project }: { project: Project }) {
  const lineRef = useReveal<HTMLDivElement>({ offset: 50 })
  const scrubRef = useScrub<HTMLAnchorElement>(buildCardScrub)
  const { ref: mediaRef, inView } = useInView<HTMLDivElement>({ rootMargin: '200px 0px', threshold: 0.01 })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)

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

  return (
    <a ref={scrubRef} href={project.href} className={styles.card}>
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
        </div>
      </div>
    </a>
  )
}
