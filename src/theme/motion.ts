import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { tokens, type EaseName } from './tokens'

gsap.registerPlugin(ScrollTrigger, CustomEase)

const registered = new Set<string>()

/**
 * Returns a GSAP ease id for a Webflow easing name, registering the exact
 * cubic-bezier from the tokens the first time it is requested.
 */
export function ease(name: EaseName = 'outSine'): string {
  if (name === 'linear') return 'none'
  const id = `wf-${name}`
  if (!registered.has(id)) {
    // CustomEase takes the four bezier numbers, not the CSS `cubic-bezier()` wrapper.
    const bezier = tokens.motion.ease[name].replace(/cubic-bezier\(|\)|\s/g, '')
    CustomEase.create(id, bezier)
    registered.add(id)
  }
  return id
}

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Webflow "scroll into view" offset (percent of viewport) → ScrollTrigger start. */
export const offsetToStart = (offset: number): string => `top ${100 - offset}%`

export { gsap, ScrollTrigger }
