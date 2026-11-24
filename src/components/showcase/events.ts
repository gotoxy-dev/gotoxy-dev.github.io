/**
 * Card ⇄ case hand-off for showcase boards, so both ends of the view transition show the same
 * board state.
 *
 * - `showcase:prepare`: dispatched on a board (`[data-showcase-board]`) instead of navigating, by
 *   the home card on a plain click and by the case page when it closes (X, Escape). The board
 *   brings itself into the shared state (the flat, pulled-back grid), then calls `ready`, which
 *   runs the navigation and its view transition.
 * - `showcase:return`: dispatched by the home card when the page comes back from its case. The
 *   board starts on that same shared state and settles to rest once the transition is over.
 */
export const SHOWCASE_PREPARE = 'showcase:prepare'
export const SHOWCASE_RETURN = 'showcase:return'
export type ShowcasePrepareEvent = CustomEvent<{ ready: () => void }>

/** Dispatch `showcase:prepare` on every visible board inside `root`; `ready` runs once. False when there is none. */
export function prepareBoards(root: ParentNode, ready: () => void) {
  const boards = Array.from(root.querySelectorAll<HTMLElement>('[data-showcase-board]')).filter((b) => b.offsetParent)
  if (!boards.length) return false
  let done = false
  const once = () => {
    if (done) return
    done = true
    ready()
  }
  boards.forEach((b) => b.dispatchEvent(new CustomEvent(SHOWCASE_PREPARE, { detail: { ready: once } }) satisfies ShowcasePrepareEvent))
  return true
}
