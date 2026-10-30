import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/theme/motion'
import { tokens } from '@/theme/tokens'

export interface ScrubOptions {
  /** ScrollTrigger start (default `top 50%`, Webflow "while scrolling in view" with 50% start offset). */
  start?: string
  /** ScrollTrigger end (default `bottom 50%`, Webflow 50% end offset). */
  end?: string
  /** Scrub smoothing in seconds (default from tokens, Webflow smoothing 50). */
  scrub?: number
}

/**
 * Builds a scroll-scrubbed timeline for the referenced element, mirroring a
 * Webflow IX2 "while scrolling in view" action list. `build` receives a
 * timeline whose total duration maps 0..1 to the scroll progress, so keyframes
 * are positioned with their percentage (0.33 = 33%).
 */
export function useScrub<T extends HTMLElement>(
  build: (tl: gsap.core.Timeline, root: T) => void,
  options?: ScrubOptions,
) {
  const ref = useRef<T | null>(null)
  const buildRef = useRef(build)
  buildRef.current = build

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: options?.start ?? 'top 50%',
          end: options?.end ?? 'bottom 50%',
          scrub: options?.scrub ?? tokens.motion.scrub.default,
        },
      })
      buildRef.current(tl, root)
    }, root)
    return () => ctx.revert()
  }, [options?.start, options?.end, options?.scrub])

  return ref
}
