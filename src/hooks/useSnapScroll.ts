import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { ScrollTrigger } from '@/theme/motion'

/** Hash `#1`..`#count` → section index, or null. */
export const sectionFromHash = (count: number): number | null => {
  const n = Number(window.location.hash.slice(1))
  return Number.isInteger(n) && n >= 1 && n <= count ? n - 1 : null
}

/** Mirrors the current section in the URL without a router navigation (router state is kept). */
export const writeSectionHash = (index: number) => {
  const hash = `#${index + 1}`
  if (window.location.hash !== hash) window.history.replaceState(window.history.state, '', hash)
}

/**
 * Element that opens section `index`: the first rendered one marked `data-section="<index>"`.
 * A page may mark the same section in two layouts (the case study's snap points and its stacked
 * blocks); the one inside a `display: none` layout has no box and is skipped.
 */
const sectionAnchor = (index: number) =>
  Array.from(document.querySelectorAll<HTMLElement>(`[data-section="${index}"]`)).find(
    (el) => el.getClientRects().length > 0,
  ) ?? null

/** Document top of an element from its layout box: an entrance lift (transform) does not move it. */
const documentTop = (el: HTMLElement) => {
  let top = 0
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop
  return top
}

/**
 * Turns on native scroll snapping for a page made of chapters (the snap areas
 * themselves are elements with `scroll-snap-align`, see `snapClass`), and opens the
 * section named in the URL hash. The browser runs the snap on its own scroll thread,
 * so no JavaScript runs per wheel event.
 */
export function useSnapScroll({ count, snapClass }: { count: number; snapClass: string }) {
  const router = useRouter()

  useEffect(() => {
    const html = document.documentElement
    html.classList.add(snapClass)

    // The router restores the stored scroll position once rendering settles,
    // which would undo a deep link, so jump again at that moment.
    const jump = () => {
      const index = sectionFromHash(count) ?? 0
      // Chapters are not all 100vh apart: jump to the section's anchor, keeping its scroll margin.
      const area = sectionAnchor(index)
      const margin = area ? parseFloat(getComputedStyle(area).scrollMarginTop) || 0 : 0
      const top = area ? documentTop(area) - margin : index * window.innerHeight
      window.scrollTo({ top, behavior: 'instant' })
      // A refresh (not an update) so listeners place the section at once instead of animating to it.
      ScrollTrigger.refresh()
    }
    jump()
    const stop = router.subscribe('onRendered', () => {
      stop()
      jump()
    })

    return () => {
      stop()
      html.classList.remove(snapClass)
    }
  }, [count, snapClass, router])
}
