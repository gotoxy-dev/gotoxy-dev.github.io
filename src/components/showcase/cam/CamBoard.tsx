import { useEffect, useLayoutEffect, useRef } from 'react'
import { Flip } from 'gsap/Flip'
import { gsap, prefersReducedMotion } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import { SHOWCASE_PREPARE, SHOWCASE_RETURN, type ShowcasePrepareEvent } from '../events'
import { CampaignScreen, Chat, PaymentScreen, Phone, ReportScreen, SignupForm, StudentsScreen } from './CamUi'
import styles from './CamBoard.module.css'

gsap.registerPlugin(Flip)

type Pt = { x: number; y: number }

/** 0 inside the convex quad, else the distance to its nearest edge */
function distance(quad: Pt[], p: Pt) {
  let inside = true
  let min = Infinity
  quad.forEach((a, i) => {
    const b = quad[(i + 1) % quad.length]
    const ex = b.x - a.x
    const ey = b.y - a.y
    if (ex * (p.y - a.y) - ey * (p.x - a.x) < 0) inside = false
    const k = Math.max(0, Math.min(1, ((p.x - a.x) * ex + (p.y - a.y) * ey) / (ex * ex + ey * ey || 1)))
    min = Math.min(min, Math.hypot(p.x - (a.x + k * ex), p.y - (a.y + k * ey)))
  })
  return inside ? 0 : min
}

/**
 * Presentation image of Instituto CAM: a tilted grid of the panel's screens and the student's
 * phone (signup, WhatsApp), on the brand blue. It covers its box like `object-fit: cover`, so the
 * home card (square) and the case cover (half the screen, or 3:2 on phones) show the same board
 * and the view transition between them is a plain move.
 *
 * `zoomOnHover` (home card, mouse only): the board straightens and the frame opens (CSS,
 * .interactive), then the screen under the cursor, as it is shown at that moment, zooms in and
 * centres in the frame. Only moving the pointer changes the screen in focus (the board gliding
 * under a still cursor never does); in a gap between screens the current one stays. It zooms back
 * out on leave.
 *
 * Opening the case (card click, `showcase:prepare`): from whatever the board shows, resting or
 * zoomed on a hover, the 3 × 2 grid settles flat, level and pulled back (GSAP Flip), then the
 * card's view transition runs. On the case cover (`cover`) the grid stays flat, pulled back, faint
 * and with depth; opened from the card (`intro`) it lands on the same flat grid the transition
 * carried, then settles into depth.
 */
export function CamBoard({
  label,
  className,
  zoomOnHover,
  intro,
  cover,
  transitionName,
}: {
  label: string
  className?: string
  zoomOnHover?: boolean
  intro?: boolean
  /** Case cover: flat, pulled back, faint, with depth (see the cover effect) */
  cover?: boolean
  /**
   * View transition name for the square stage (case page). The card ⇄ case morph moves the stage,
   * not the frame: it is square at both ends, so the grid only moves and scales, never stretches.
   */
  transitionName?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  /*
   * Home card ⇄ case. Opening: hover state (if any) → the shared flat, pulled-back grid → `ready`
   * (navigates). Coming back (`showcase:return`): start on that shared grid, so the view transition
   * is a plain move, then ease back to the tilted rest. A layout effect, so its listeners exist before
   * the card's own layout effect sends `showcase:return`.
   */
  useLayoutEffect(() => {
    const frame = frameRef.current
    const zoom = zoomRef.current
    const board = boardRef.current
    if (!zoomOnHover || !frame || !zoom || !board) return
    const M = tokens.motion.showcase
    const items = Array.from(board.children) as HTMLElement[]
    let flip: gsap.core.Timeline | null = null
    let back = 0
    const onReturn = () => {
      if (prefersReducedMotion()) return
      frame.dataset.snap = ''
      frame.dataset.layout = 'row'
      back = window.setTimeout(() => {
        delete frame.dataset.snap
        void frame.offsetWidth
        delete frame.dataset.layout // .interactive transition: the board tilts back to rest
      }, M.boardIntroDelaySec * 1000)
    }
    frame.addEventListener(SHOWCASE_RETURN, onReturn)
    const onPrepare = (event: Event) => {
      const { ready } = (event as ShowcasePrepareEvent).detail
      if (frame.dataset.layout === 'row') return // already on its way
      const state = Flip.getState(items)
      // the hover stops here: the zoom goes back to rest under the screens, which Flip carries from where they were
      gsap.killTweensOf(zoom)
      gsap.set(zoom, { x: 0, y: 0, scale: 1 })
      frame.dataset.layout = 'row'
      flip = Flip.from(state, {
        duration: M.boardRowSec,
        ease: M.boardRowEase,
        scale: true,
        onComplete: () => {
          // back inside the square (its background stays hidden while `row`), before the view transition captures the card
          frame.dataset.snap = ''
          delete frame.dataset.open
          void frame.offsetWidth
          ready()
        },
      })
    }
    frame.addEventListener(SHOWCASE_PREPARE, onPrepare)
    return () => {
      frame.removeEventListener(SHOWCASE_PREPARE, onPrepare)
      frame.removeEventListener(SHOWCASE_RETURN, onReturn)
      window.clearTimeout(back)
      flip?.kill()
    }
  }, [zoomOnHover])

  /*
   * Case cover (`cover`): the flat 3 × 2 grid, pulled back, with depth. Every screen keeps the same
   * size and place, so the gaps stay even; depth reads through opacity (layout.showcase.boardDepths,
   * 0 far … 1 near → boardCoverOpacity) and a slight blur on the far ones, and the whole grid floats
   * as one. Opened from the card (`intro`), it lands on the crisp pulled-back grid the view
   * transition carried, then settles into depth.
   */
  useLayoutEffect(() => {
    const frame = frameRef.current
    const zoom = zoomRef.current
    const board = boardRef.current
    if (!cover || !frame || !zoom || !board) return
    const M = tokens.motion.showcase
    const L = tokens.layout.showcase
    const items = Array.from(board.children) as HTMLElement[]
    const reduced = prefersReducedMotion()
    const depthStyle = (i: number) => {
      const d = L.boardDepths[i % L.boardDepths.length]
      const far = Math.max(0, L.boardBlurBelow - d) / L.boardBlurBelow
      return {
        opacity: L.boardCoverOpacity[0] + (L.boardCoverOpacity[1] - L.boardCoverOpacity[0]) * d,
        filter: far > 0 ? `blur(${(far * L.boardBlurMax).toFixed(2)}em)` : 'blur(0em)',
      }
    }
    let float: gsap.core.Tween | null = null
    const drift = () => {
      if (reduced) return
      // the grid floats as one block: the gaps between screens never change
      float = gsap.to(zoom, { yPercent: M.boardDriftPercent, duration: M.boardDriftSec, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }

    let timer = 0
    let settle: gsap.core.Tween | null = null
    if (intro && !reduced) {
      // the view transition lands on the crisp pulled-back grid; then the board settles into depth
      frame.dataset.layout = 'row'
      timer = window.setTimeout(() => {
        delete frame.dataset.layout // .cover transition: to the cover's scale
        settle = gsap.to(items, {
          opacity: (i: number) => depthStyle(i).opacity,
          filter: (i: number) => depthStyle(i).filter,
          duration: M.boardIntroSec,
          ease: M.boardRowEase,
          onComplete: drift,
        })
      }, M.boardIntroDelaySec * 1000)
    } else {
      items.forEach((item, i) => gsap.set(item, depthStyle(i)))
      drift()
    }

    // closing the case (X, Escape): back to the crisp pulled-back grid the home card returns on, then `ready`
    const onPrepare = (event: Event) => {
      const { ready } = (event as ShowcasePrepareEvent).detail
      if (reduced) return ready()
      if (frame.dataset.closing !== undefined) return
      frame.dataset.closing = ''
      window.clearTimeout(timer)
      settle?.kill()
      float?.kill()
      frame.dataset.layout = 'row' // .cover[data-closing] transition: to the shared scale
      gsap.to(zoom, { yPercent: 0, duration: M.boardRowSec, ease: M.boardRowEase })
      gsap.to(items, { opacity: 1, filter: 'blur(0em)', duration: M.boardRowSec, ease: M.boardRowEase, onComplete: ready })
    }
    frame.addEventListener(SHOWCASE_PREPARE, onPrepare)

    return () => {
      frame.removeEventListener(SHOWCASE_PREPARE, onPrepare)
      delete frame.dataset.closing
      window.clearTimeout(timer)
      settle?.kill()
      float?.kill()
      gsap.killTweensOf(items)
      gsap.set(items, { clearProps: 'opacity,filter' })
      gsap.set(zoom, { clearProps: 'transform' })
      delete frame.dataset.layout
    }
  }, [cover, intro])

  useEffect(() => {
    const frame = frameRef.current
    const zoom = zoomRef.current
    const board = boardRef.current
    if (!zoomOnHover || !frame || !zoom || !board) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) return

    const M = tokens.motion.showcase
    const items = Array.from(board.children) as HTMLElement[]
    gsap.set(zoom, { transformOrigin: '0 0', x: 0, y: 0, scale: 1 })

    /** The zoom layer as it is now: its untransformed top-left on screen, translate and scale */
    const live = () => {
      const z = zoom.getBoundingClientRect()
      const x = Number(gsap.getProperty(zoom, 'x'))
      const y = Number(gsap.getProperty(zoom, 'y'))
      const s = Number(gsap.getProperty(zoom, 'scaleX')) || 1
      return { left: z.left - x, top: z.top - y, x, y, s }
    }

    /**
     * Each screen's outline on the flat, unzoomed board: the board's own transform (perspective
     * included) applied to its corners, in the zoom layer's coordinates.
     */
    let outlines: Pt[][] = []
    const measure = () => {
      const m = new DOMMatrix(getComputedStyle(board).transform)
      const ox = board.offsetWidth / 2
      const oy = board.offsetHeight / 2
      const project = (x: number, y: number) => {
        const q = m.transformPoint(new DOMPoint(x - ox, y - oy, 0, 1))
        return { x: q.x / q.w + ox + board.offsetLeft, y: q.y / q.w + oy + board.offsetTop }
      }
      outlines = items.map((item) => {
        const l = item.offsetLeft
        const t = item.offsetTop
        const r = l + item.offsetWidth
        const b = t + item.offsetHeight
        return [project(l, t), project(r, t), project(r, b), project(l, b)]
      })
    }

    /** Distance from the cursor to each screen AS IT IS ON SCREEN NOW (zoom included; 0 = under the cursor) */
    const distances = (px: number, py: number) => {
      if (!outlines.length) measure()
      const v = live()
      const p = { x: px, y: py }
      return outlines.map((quad) => distance(quad.map((q) => ({ x: v.left + v.x + v.s * q.x, y: v.top + v.y + v.s * q.y })), p))
    }

    let current = -1
    /** Zoom onto a screen: scaled to fill most of the frame, centred in it */
    const focus = (index: number) => {
      current = index
      const v = live()
      const quad = outlines[index]
      const xs = quad.map((p) => p.x)
      const ys = quad.map((p) => p.y)
      const w = Math.max(...xs) - Math.min(...xs)
      const h = Math.max(...ys) - Math.min(...ys)
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2
      const cy = (Math.max(...ys) + Math.min(...ys)) / 2
      const f = frame.getBoundingClientRect()
      const s = Math.max(1, Math.min(M.boardZoomMax, (f.width * M.boardZoomFill) / w, (f.height * M.boardZoomFill) / h))
      gsap.to(zoom, {
        x: f.left + f.width / 2 - v.left - s * cx,
        y: f.top + f.height / 2 - v.top - s * cy,
        scale: s,
        duration: M.boardZoomSec,
        ease: M.boardZoomEase,
        overwrite: true,
      })
    }

    /**
     * The screen under the cursor, as shown right now, takes the zoom. Only a real move of the
     * pointer can change it (the board gliding under a still cursor never does), and in a gap
     * between screens the current one stays.
     */
    const track = (px: number, py: number, first: boolean) => {
      const d = distances(px, py)
      const under = d.indexOf(0)
      if (under >= 0 && under !== current) focus(under)
      else if (first && under < 0) focus(d.indexOf(Math.min(...d)))
    }

    /*
     * Hover: open first (the CSS straightens the board, opens the clip and fades the square's
     * background, see .interactive), then, once the board is flat, zoom onto the screen under the cursor.
     */
    let ready = false
    let timer = 0
    const last = { x: 0, y: 0 }
    const onEnter = (e: PointerEvent) => {
      last.x = e.clientX
      last.y = e.clientY
      frame.dataset.open = ''
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        ready = true
        outlines = [] // measured on the flat board
        track(last.x, last.y, true)
      }, M.boardOpenSec * 1000)
    }
    const onMove = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - last.x, e.clientY - last.y)
      last.x = e.clientX
      last.y = e.clientY
      if (ready && moved > 0 && frame.dataset.layout !== 'row') track(e.clientX, e.clientY, false)
    }
    const close = () => {
      window.clearTimeout(timer)
      ready = false
      current = -1
      outlines = []
      delete frame.dataset.open
    }
    const onLeave = () => {
      if (frame.dataset.layout === 'row') return // opening the case: the row stays
      close()
      gsap.to(zoom, { x: 0, y: 0, scale: 1, duration: M.boardZoomSec, ease: M.boardZoomEase, overwrite: true })
    }
    // a press opens the case (see showcase:prepare): the hover stops following the cursor
    const onDown = () => {
      window.clearTimeout(timer)
      ready = false
    }
    const resize = new ResizeObserver(() => (outlines = []))
    resize.observe(frame)
    frame.addEventListener('pointerenter', onEnter)
    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', onLeave)
    frame.addEventListener('pointerdown', onDown)
    return () => {
      resize.disconnect()
      close()
      frame.removeEventListener('pointerenter', onEnter)
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
      frame.removeEventListener('pointerdown', onDown)
      gsap.killTweensOf(zoom)
      gsap.set(zoom, { clearProps: 'transform' })
    }
  }, [zoomOnHover])

  return (
    <div
      ref={frameRef}
      className={`${styles.frame} ${zoomOnHover ? styles.interactive : ''} ${cover ? styles.cover : ''} ${className ?? ''}`}
      data-showcase-board=""
      role="img"
      aria-label={label}
    >
      <div className={styles.backdrop} />
      <div className={styles.bleed}>
        <div
          className={styles.stage}
          data-showcase-stage=""
          style={transitionName ? { viewTransitionName: transitionName } : undefined}
          aria-hidden="true"
        >
          <div ref={zoomRef} className={styles.zoom}>
            <div ref={boardRef} className={styles.board}>
              <Phone className={styles.phone}>
                <SignupForm />
              </Phone>
              <StudentsScreen className={styles.screen} />
              <CampaignScreen className={styles.screen} />
              <Phone className={styles.phone}>
                <Chat />
              </Phone>
              <ReportScreen className={styles.screen} />
              <PaymentScreen className={styles.screen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
