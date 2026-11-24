import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/theme/motion'
import { tokens } from '@/theme/tokens'

export interface ScrubWindow {
  /** ScrollTrigger start (default `top 50%`, Webflow "while scrolling in view" with 50% start offset). */
  start?: string
  /** ScrollTrigger end (default `bottom 50%`, Webflow 50% end offset). */
  end?: string
}

export interface ScrubOptions extends ScrubWindow {
  /** Scrub smoothing in seconds (default from tokens, Webflow smoothing 50). */
  scrub?: number
  /**
   * Phones (below `breakpoints.md`): their own trigger window. With it the timeline is built per
   * tier (`build` gets `phone`) and rebuilt when the viewport crosses the breakpoint.
   */
  phone?: ScrubWindow
}

/** Phones are one tier: below `md` (see tokens.breakpoints). */
const PHONE_QUERY = `(max-width: ${tokens.breakpoints.md - 1}px)`
/** Everything else, fractional widths between the two tiers included. */
const OTHER_QUERY = `not all and ${PHONE_QUERY}`

/**
 * Builds a scroll-scrubbed timeline for the referenced element, mirroring a
 * Webflow IX2 "while scrolling in view" action list. `build` receives a
 * timeline whose total duration maps 0..1 to the scroll progress, so keyframes
 * are positioned with their percentage (0.33 = 33%).
 */
export function useScrub<T extends HTMLElement>(
  build: (tl: gsap.core.Timeline, root: T, phone: boolean) => void,
  options?: ScrubOptions,
) {
  const ref = useRef<T | null>(null)
  const buildRef = useRef(build)
  buildRef.current = build
  const phoneStart = options?.phone?.start
  const phoneEnd = options?.phone?.end
  const responsive = options?.phone !== undefined

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    const create = (phone: boolean) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: (phone ? phoneStart : undefined) ?? options?.start ?? 'top 50%',
          end: (phone ? phoneEnd : undefined) ?? options?.end ?? 'bottom 50%',
          scrub: options?.scrub ?? tokens.motion.scrub.default,
        },
      })
      buildRef.current(tl, root, phone)
    }

    if (!responsive) {
      const ctx = gsap.context(() => create(false), root)
      return () => ctx.revert()
    }
    const mm = gsap.matchMedia(root)
    mm.add({ phone: PHONE_QUERY, other: OTHER_QUERY }, (ctx) => create(Boolean(ctx.conditions?.phone)))
    return () => mm.revert()
  }, [options?.start, options?.end, options?.scrub, responsive, phoneStart, phoneEnd])

  return ref
}
