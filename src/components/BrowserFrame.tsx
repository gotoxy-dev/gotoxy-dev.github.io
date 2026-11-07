import type { Ref } from 'react'
import styles from './BrowserFrame.module.css'

/** `https://www.example.com/x` → `example.com` (empty when the link is not a URL). */
export function hostOf(href: string): string {
  try {
    return new URL(href).host.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** A landscape website capture shown whole inside a minimal browser window. */
export function BrowserFrame({
  src,
  host,
  priority,
  zoom,
  className,
  transitionName,
  ref,
}: {
  src: string
  host: string
  priority?: boolean
  /** Opens zoomed in on a point and pulls back when its chapter is entered (see CaseStudy setupChapterSwaps) */
  zoom?: { scale: number; origin: string }
  /** Sets the window width (and anything else the caller needs) */
  className?: string
  /** `view-transition-name` of the window (see src/transitions.ts) */
  transitionName?: string
  ref?: Ref<HTMLElement>
}) {
  return (
    <figure
      ref={ref}
      className={`${styles.browser} ${className ?? ''}`}
      style={transitionName ? { viewTransitionName: transitionName } : undefined}
      {...(zoom ? { 'data-zoom-scale': zoom.scale, 'data-zoom-origin': zoom.origin } : {})}
    >
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        {host && <span className={styles.url}>{host}</span>}
      </div>
      <img
        className={styles.shot}
        src={src}
        alt=""
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
      />
    </figure>
  )
}
