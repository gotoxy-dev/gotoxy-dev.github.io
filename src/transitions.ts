/**
 * View transitions between a home project card and its case study, both ways.
 *
 *  - Opening (`case-open`): the card names its media and browser window on click; the case
 *    page names its first visual, its browser window and the text panel, so the card media
 *    shrinks into the left visual while the panel opens.
 *  - Closing (`case-close`, the X, Escape or the browser back button): the case page reports
 *    its slug as it unmounts and that card names itself again as the home mounts, so the
 *    visual grows back into the card while the panel closes.
 *
 * The router runs a transition only for these two navigations (see `caseTransitionTypes`),
 * and only where view transition types are supported. The `::view-transition-*` rules for
 * these names live in styles/global.css.
 */
export const caseOpen = {
  open: 'case-open',
  close: 'case-close',
  visual: 'case-visual',
  browser: 'case-browser',
  panel: 'case-panel',
} as const

/** The case page counts as opened from a card while it mounts this long after the click (ms):
    room for the route to load when it was not preloaded on hover. */
const OPEN_WINDOW_MS = 5000
/** The home counts as returning from a case while it mounts this long after the case unmounts (ms). */
const CLOSE_WINDOW_MS = 1000
const CASE_PATH = /^\/projects\/([^/]+)\/?$/

let openedAt = Number.NEGATIVE_INFINITY
let closed: { slug: string; at: number } | null = null

const now = () => performance.now()

/** View transitions with types (Chrome 125+, Safari 18.2+): anything older navigates plainly. */
export const supportsViewTransitions = () =>
  typeof document !== 'undefined' &&
  typeof document.startViewTransition === 'function' &&
  typeof CSS !== 'undefined' &&
  CSS.supports('selector(:active-view-transition-type(a))')

/** Router `defaultViewTransition.types`: animate home ⇄ case study, nothing else. */
export function caseTransitionTypes({
  fromLocation,
  toLocation,
}: {
  fromLocation?: { pathname: string }
  toLocation: { pathname: string }
}): string[] | false {
  if (!fromLocation) return false
  const from = fromLocation.pathname
  const to = toLocation.pathname
  if (from === '/' && CASE_PATH.test(to)) return [caseOpen.open]
  if (CASE_PATH.test(from) && to === '/') return [caseOpen.close]
  return false
}

/** Called by the card on click, right before the router starts the transition. */
export function markCaseOpen() {
  openedAt = now()
}

/**
 * True while the case page mounts as the target of a card transition: its first visual and
 * panel must be visible at once (the transition animates them) instead of fading in.
 */
export const enteredFromCard = () => supportsViewTransitions() && now() - openedAt < OPEN_WINDOW_MS

/** Called once the case page has mounted, so a later case (next project) fades in as usual. */
export function clearCaseOpen() {
  openedAt = Number.NEGATIVE_INFINITY
}

/** Called by the case page as it unmounts. */
export function markCaseClose(slug: string) {
  closed = { slug, at: now() }
}

/** Slug of the case page that just closed, while the home mounts right after it (else null). */
export const returningSlug = (): string | null =>
  closed !== null && now() - closed.at < CLOSE_WINDOW_MS ? closed.slug : null

/** How long a returning card keeps its transition names (the close animation plus margin). */
export const RETURN_NAME_MS = 2000
