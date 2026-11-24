/**
 * Card → case hand-off for showcase boards. On a plain click the home card dispatches this event
 * on the board (`[data-showcase-board]`) instead of navigating; the board brings itself into the
 * state the case cover starts from, then calls `ready`, which runs the navigation and its view
 * transition.
 */
export const SHOWCASE_PREPARE = 'showcase:prepare'
export type ShowcasePrepareEvent = CustomEvent<{ ready: () => void }>
