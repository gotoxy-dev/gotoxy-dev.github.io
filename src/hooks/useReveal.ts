import { useEffect, useRef } from 'react'
import { ease, gsap, offsetToStart, prefersReducedMotion, ScrollTrigger } from '@/theme/motion'
import { sec, tokens, type EaseName } from '@/theme/tokens'

export interface RevealOptions {
  /** Webflow-style trigger offset: percent of the viewport the element must enter (default 25). */
  offset?: number
  /** Play on mount instead of on scroll (page-load timelines). */
  immediate?: boolean
}

/**
 * Plays every `[data-reveal]` descendant of the container as one timeline,
 * mirroring a Webflow IX2 "scroll into view" action list.
 *
 *   data-reveal="y"       translateY(from) → 0
 *   data-reveal="x"       translateX(from) → 0
 *   data-reveal="fade"    opacity 0 → 1
 *   data-reveal="y-fade" / "x-fade"  move + fade
 *   data-reveal="width"   width 0% → 100%
 *
 * Per-element overrides (all optional):
 *   data-reveal-from="7vw"        distance (default 3vw)
 *   data-reveal-dur="700ms"       move duration (default 500ms)
 *   data-reveal-delay="100ms"     move delay
 *   data-reveal-ease="outCirc"    move easing (default outSine)
 *   data-reveal-fade-dur="400ms"  fade duration (default 400ms, linear)
 *   data-reveal-fade-delay="300ms" fade delay (defaults to the move delay)
 *
 * Nested `useReveal` roots own their descendants: an item belongs to the closest
 * `[data-reveal-scope]` ancestor only.
 */
export function useReveal<T extends HTMLElement>(options?: RevealOptions) {
  const ref = useRef<T | null>(null)
  const offset = options?.offset ?? 25
  const immediate = options?.immediate ?? false

  useEffect(() => {
    const root = ref.current
    if (!root) return
    root.setAttribute('data-reveal-scope', '')

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
      (el) => el.closest('[data-reveal-scope]') === root,
    )
    if (root.hasAttribute('data-reveal')) items.unshift(root)
    if (!items.length) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })

      items.forEach((el) => {
        const d = el.dataset
        const kind = d.reveal || 'y'
        const moveDelay = sec(d.revealDelay ?? '0')
        const moveDur = sec(d.revealDur ?? tokens.motion.duration.d500)
        const moveEase = ease((d.revealEase as EaseName | undefined) ?? 'outSine')

        if (kind === 'y' || kind === 'y-fade') {
          gsap.set(el, { y: d.revealFrom ?? tokens.motion.distance.block })
          tl.to(el, { y: 0, duration: moveDur, ease: moveEase }, moveDelay)
        }
        if (kind === 'x' || kind === 'x-fade') {
          gsap.set(el, { x: d.revealFrom ?? tokens.motion.distance.block })
          tl.to(el, { x: 0, duration: moveDur, ease: moveEase }, moveDelay)
        }
        if (kind === 'fade' || kind === 'y-fade' || kind === 'x-fade') {
          gsap.set(el, { opacity: 0 })
          tl.to(
            el,
            { opacity: 1, duration: sec(d.revealFadeDur ?? tokens.motion.duration.d400), ease: 'none' },
            sec(d.revealFadeDelay ?? d.revealDelay ?? '0'),
          )
        }
        if (kind === 'width') {
          gsap.set(el, { width: '0%' })
          tl.to(el, { width: '100%', duration: moveDur, ease: moveEase }, moveDelay)
        }
      })

      if (prefersReducedMotion()) {
        tl.progress(1)
        return
      }
      if (immediate) {
        tl.play()
        return
      }
      ScrollTrigger.create({
        trigger: root,
        start: offsetToStart(offset),
        once: true,
        onEnter: () => tl.play(),
      })
    }, root)

    return () => ctx.revert()
  }, [offset, immediate])

  return ref
}
