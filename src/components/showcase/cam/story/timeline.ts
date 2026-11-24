import type { CaseShowcase } from '@/content/site'
import { createDotRenderer, DOT_STRIDE, type DotRenderer } from '@/components/particleRenderer'
import { gsap } from '@/theme/motion'
import { tokens } from '@/theme/tokens'
import { camCampaign, camReportBars, camSignup } from '../camData'
import { hookMessage, hookNames, layout, messageSpots, RING_HERO, ringSpot, ticketSpots, versionSpots } from './Film'
import { createFilmParticles } from './particles'
import {
  createScript,
  nearestSetX,
  setX,
  SEG,
  SEGMENTS,
  setVisible,
  TOTAL,
  worldTransform,
  SECTION_TONE,
  segmentAt,
  type Box,
  type Focus,
  type FocusName,
  type Pose,
  type Script,
  type View,
} from './script'
import { storyAssign, storyAuditTotals, storyMoodleForm } from './storyData'

/**
 * Builds the film's GSAP timeline and its `sync(t)`.
 *
 * The timeline moves the leaf layers (cards flying, rows sorting, pills popping, words slamming);
 * `sync(t)` writes everything else as a function of time, once per frame: the camera (world
 * transform), which sets and screens are shown, the whip-pan blur, the section titles, the
 * particles, counters and typed text. So a seek, a restart or a reduced-motion still always
 * lands on the same frame.
 */

const M = tokens.motion.showcase
const L = tokens.layout.showcase
const C = tokens.color.cam

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const numberFormat = new Intl.NumberFormat('es-PY')
const fmt = (n: number) => numberFormat.format(n)
const group = (n: number, sep: string) => (sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n))
const blank = ' '

/** "3.000+" → counts 0 → 3.000 keeping the prefix, suffix and separator; the last frame is the value itself */
function statText(value: string, ease: (p: number) => number): (p: number) => string {
  const m = value.match(/^(\D*)(\d[\d.,]*)(\D*)$/)
  if (!m) return () => value
  const [, pre, digits, post] = m
  const sep = digits.match(/[.,]/)?.[0] ?? ''
  const target = Number(digits.replace(/[.,]/g, ''))
  return (p) => (p >= 1 ? value : pre + group(Math.round(target * ease(p)), sep) + post)
}

/** Text an element shows at a given time; `reset` is put back on cleanup */
interface Writer {
  el: HTMLElement
  text: (t: number) => string
  reset: string
}

export interface FilmView {
  segment: number
  ended: boolean
}

export interface Film {
  tl: ReturnType<typeof gsap.timeline>
  sync: (t: number) => void
  /** The frame changed size: re-measure the focus points, resize the particle canvas, redraw */
  resize: () => void
  dispose: () => void
}

const all = (root: Element | null | undefined, selector: string) =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(selector)) : []
const one = (root: Element | null | undefined, selector: string) => root?.querySelector<HTMLElement>(selector) ?? null
const num = (el: HTMLElement, name: string) => Number(el.style.getPropertyValue(name)) || 0

export function buildFilm(
  root: HTMLElement,
  frame: HTMLElement,
  story: CaseShowcase['story'],
  onView: (view: FilmView) => void,
  fills: () => (HTMLElement | null)[],
  reduced = false,
): Film {
  const world = one(root, '[data-film="world"]')
  const lens = one(root, '[data-film="lens"]')
  const canvas = root.querySelector<HTMLCanvasElement>('[data-film="canvas"]')
  const sets = all(root, '[data-set]')
  const film = (name: string, scope: Element | null = root) => one(scope, `[data-film="${name}"]`)
  const films = (name: string, scope: Element | null = root) => all(scope, `[data-film="${name}"]`)

  const ease = gsap.parseEase(M.ease) as (p: number) => number
  const writers: Writer[] = []
  const counter = (el: HTMLElement | null, to: number, at: number, dur: number = M.countSec, from = 0) => {
    if (el) writers.push({ el, reset: el.textContent ?? '', text: (t) => fmt(Math.round(from + (to - from) * ease(clamp01((t - at) / dur)))) })
  }
  const typed = (text: string, t: number, at: number, dur: number) => {
    const n = Math.round(text.length * clamp01((t - at) / dur))
    return n ? text.slice(0, n) : blank
  }
  const typer = (el: HTMLElement | null, text: string, at: number, dur: number, clearAt = Infinity) => {
    if (el) writers.push({ el, reset: el.textContent ?? '', text: (t) => (t >= clearAt ? blank : typed(text, t, at, dur)) })
  }

  const tl = gsap.timeline({ paused: true, defaults: { ease: M.ease } })
  const pop = M.filmPopEase
  const crash = M.filmCrashEase
  const pulse = (el: Element | null, at: number, scale = 0.9) =>
    tl.to(el, { scale, duration: 0.12, repeat: 1, yoyo: true, ease: 'sine.inOut' }, at)

  /* ---- 0 · problem ---- */
  // a · the sheet typed by hand: duplicates and empty or badly formatted phones light up
  const sheetRows = all(film('hook-sheet'), '[data-cam="sheet-row"]')
  tl.fromTo(sheetRows, { autoAlpha: 0, xPercent: -4 }, { autoAlpha: 1, xPercent: 0, duration: 0.25, stagger: 0.14 }, 0.1)
  const duplicates = sheetRows.filter((row) => row.textContent?.includes('Eduarda'))
  tl.to(duplicates, { backgroundColor: C.redSoft, duration: 0.25 }, 1.6)
  tl.to(duplicates, { x: 6, duration: 0.06, repeat: 7, yoyo: true, ease: 'none' }, 2.3)
  const badCells = sheetRows
    .flatMap((row) => Array.from(row.children).slice(1) as HTMLElement[])
    .filter((cell) => !cell.textContent || cell.textContent.startsWith('(') || cell.textContent.startsWith('¿'))
  tl.to(badCells, { backgroundColor: C.amber, duration: 0.2, repeat: 7, yoyo: true, ease: 'sine.inOut' }, 1.8)
  // b · one WhatsApp at a time, against the target of 3.000
  const pages = films('hook-page')
  const pageAt = (i: number) => 3.5 + i * 1.05
  const sendAt = pages.map((_, i) => pageAt(i) + 0.45)
  gsap.set(pages.slice(1), { autoAlpha: 0 })
  pages.forEach((page, i) => {
    typer(one(page, '[data-cam="hook-composer"]'), hookMessage(hookNames[i] ?? ''), pageAt(i) + 0.05, 0.35, sendAt[i])
    tl.fromTo(one(page, '[data-cam="hook-sent"]'), { autoAlpha: 0, y: 12, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: pop }, sendAt[i])
    if (i > 0) tl.set(pages[i - 1], { autoAlpha: 0 }, pageAt(i)).set(page, { autoAlpha: 1 }, pageAt(i))
  })
  const count = film('hook-count')
  if (count) writers.push({ el: count, reset: '0', text: (t) => String(sendAt.filter((at) => t >= at).length) })
  const hour = film('hook-hour')
  const minute = film('hook-minute')
  gsap.set([hour, minute], { rotation: 0, svgOrigin: '20 20' })
  tl.to(minute, { rotation: 360 * 4, duration: 3.4, ease: 'none' }, 3.4).to(hour, { rotation: 120, duration: 3.4, ease: 'none' }, 3.4)
  // c · Moodle accounts by hand: one form, one student, then the next
  const moodle = film('moodle')
  const moodleClear = 9.75
  films('moodle-field', moodle).forEach((el, i) => {
    const value = el.dataset.value ?? ''
    const at = 7 + i * 0.42
    const next = i === 0 ? storyMoodleForm.fields[0].value.replace(/^\w+/, 'bruno') : ''
    writers.push({
      el,
      reset: value,
      text: (t) => (t < moodleClear ? typed(value, t, at, 0.3) : next ? typed(next, t, moodleClear + 0.1, 0.25) : blank),
    })
  })
  pulse(film('moodle-submit', moodle), 9.25)
  const moodleCount = film('moodle-count', moodle)
  if (moodleCount) writers.push({ el: moodleCount, reset: '0', text: (t) => (t >= 9.4 ? '1' : '0') })
  // d · payments noted on paper, three currencies
  films('paper').forEach((slip, i) => {
    tl.fromTo(slip, { autoAlpha: 0, '--z': 70, '--s': 1.3 }, { autoAlpha: 1, '--z': i * 3, '--s': 1, duration: 0.35, ease: 'power3.in' }, 10.35 + i * 0.36)
  })
  // e · copies of the list, and nobody knows who changed what
  films('version').forEach((card, i) => {
    const x = versionSpots[i]?.x ?? 0
    tl.fromTo(card, { autoAlpha: 0, '--x': x + 40 }, { autoAlpha: 1, '--x': x, duration: 0.4, ease: crash }, 13.3 + i * 0.3)
    pulse(film('version-who', card), 14.7 + i * 0.12, 1.35)
  })

  /* ---- 1 · signup: the form fills itself, signups pour into the panel ---- */
  const s1 = SEG[1]
  const signupPhone = film('signup-phone')
  const fieldTexts = [...camSignup.fields.map((f) => f.value), camSignup.phone.value]
  all(signupPhone, '[data-cam="field"]').forEach((el, i) => typer(el, fieldTexts[i] ?? '', s1 + 0.4 + i * 0.38, 0.28))
  pulse(one(signupPhone, '[data-cam="submit"]'), s1 + 3)
  const panel = layout.students
  films('record').forEach((card, i) => {
    tl.fromTo(card, { autoAlpha: 0, '--s': 0.5 }, { autoAlpha: 1, '--s': 1, duration: 0.3, ease: pop }, s1 + 4.3 + i * 0.05)
    tl.to(
      card,
      { '--x': panel.x, '--y': panel.y, '--z': panel.z + 10, '--ry': 0, '--rz': 0, '--s': 0.25, autoAlpha: 0, duration: 0.8, ease: 'power2.in' },
      s1 + 4.6 + i * 0.22,
    )
  })
  const badge = film('signup-badge')
  tl.fromTo(badge, { autoAlpha: 0, '--s': 0.6 }, { autoAlpha: 1, '--s': 1, duration: 0.4, ease: pop }, s1 + 4.5)
  counter(film('signup-today', badge), 84, s1 + 4.6, 3.6)
  const studentRows = all(film('students'), '[data-cam="row"]')
  tl.fromTo(studentRows, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.35, stagger: 0.4 }, s1 + 4.8)

  /* ---- 2 · cross-check: rows sort into commissions, the scan flags and resolves them ---- */
  const s2 = SEG[2]
  const audit = film('audit')
  const auditRows = films('audit-row', audit)
  const rowRand = (i: number) => ((i * 7919) % 13) / 13 - 0.5
  tl.fromTo(
    auditRows,
    { autoAlpha: 0, xPercent: (i: number) => rowRand(i) * 260, yPercent: -260, rotation: (i: number) => rowRand(i + 3) * 18 },
    { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 0.7, ease: crash, stagger: 0.085 },
    s2 + 0.3,
  )
  const scan = film('audit-scan', audit)
  gsap.set(scan, { yPercent: -100 })
  tl.to(scan, { opacity: 1, duration: 0.15 }, s2 + 1.8)
  tl.to(scan, { yPercent: 0, duration: 1.3, ease: 'power1.inOut' }, s2 + 1.8)
  tl.to(scan, { opacity: 0, duration: 0.2 }, s2 + 3.1)
  const flagged = auditRows.filter((row) => row.hasAttribute('data-flagged'))
  const clean = auditRows.filter((row) => !row.hasAttribute('data-flagged'))
  // rows match as the scan passes them; rows flagged red/amber pulse, then resolve one by one
  const rowOrder = (row: HTMLElement) => auditRows.indexOf(row) % 4
  gsap.set(films('audit-ok', audit), { autoAlpha: 0, scale: 0.5 })
  clean.forEach((row) => {
    tl.to(film('audit-ok', row), { autoAlpha: 1, scale: 1, duration: 0.25, ease: pop }, s2 + 1.95 + rowOrder(row) * 0.3)
  })
  const fixAt = flagged.map((_, k) => s2 + 4.1 + k * 0.3)
  flagged.forEach((row, k) => {
    const flag = film('audit-flag', row)
    const tone = row.textContent?.includes('Duplicado') ? C.redSoft : C.amberSoft
    tl.to(row, { backgroundColor: tone, duration: 0.2, repeat: 3, yoyo: true, ease: 'sine.inOut' }, s2 + 2 + rowOrder(row) * 0.3)
    tl.to(flag, { scale: 1.25, duration: 0.18, repeat: 3, yoyo: true, ease: 'sine.inOut' }, s2 + 3.6)
    tl.to(flag, { autoAlpha: 0, scale: 0.5, duration: 0.2 }, fixAt[k])
    tl.to(film('audit-ok', row), { autoAlpha: 1, scale: 1, duration: 0.3, ease: pop }, fixAt[k] + 0.1)
    tl.fromTo(row, { backgroundColor: tone }, { backgroundColor: C.greenSoft, duration: 0.3, immediateRender: false }, fixAt[k])
  })
  counter(one(audit, '[data-cam="audit-matched"]'), storyAuditTotals.matched, s2 + 1.8, 4.6)
  const diff = one(audit, '[data-cam="audit-diff"]')
  if (diff) {
    const found = flagged.map((row) => s2 + 2 + rowOrder(row) * 0.3)
    writers.push({ el: diff, reset: '0', text: (t) => String(found.filter((at) => t >= at).length - fixAt.filter((at) => t >= at).length) })
  }

  /* ---- 3 · campaigns: assign, send, burst of messages to every phone ---- */
  const s3 = SEG[3]
  const assign = film('assign')
  tl.fromTo(films('assign-on', assign), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: pop, stagger: 0.25 }, s3 + 0.5)
  counter(film('assign-audience', assign), storyAssign.audience, s3 + 0.55, 1.6)
  pulse(film('assign-send', assign), s3 + 2.5)
  const campaign = film('campaign')
  const progress = one(campaign, '[data-cam="progress"]')
  gsap.set(progress, { scaleX: 0 })
  tl.to(progress, { scaleX: camCampaign.sent / camCampaign.total, duration: 2.8, ease: 'power2.out' }, s3 + 3.1)
  counter(one(campaign, '[data-cam="sent"]'), camCampaign.sent, s3 + 3.1, 2.8)
  counter(one(campaign, '[data-cam="delivered"]'), camCampaign.delivered, s3 + 3.3, 2.8)
  counter(one(campaign, '[data-cam="read"]'), camCampaign.read, s3 + 3.6, 3)
  const burstAt = s3 + 4.5
  films('message').forEach((card, i) => {
    const m = messageSpots[i]
    const to = ringSpot(m.to)
    const at0 = burstAt + i * 0.12
    tl.fromTo(
      card,
      { autoAlpha: 0, '--x': 0, '--y': -6, '--z': 12, '--s': 0.4, '--rz': 0 },
      { autoAlpha: 1, '--x': to.x * 0.92, '--y': to.y - 8, '--z': to.z + 30, '--s': 0.85, '--rz': m.rz, duration: 0.9, ease: 'power2.out' },
      at0,
    )
    tl.to(card, { autoAlpha: 0, '--s': 0.3, '--z': to.z, duration: 0.3, ease: 'power2.in' }, at0 + 0.9)
  })
  const rings = films('ring')
  rings.forEach((ring, k) => {
    const bubble = one(ring, '[data-cam="ring-bubble"]')
    tl.fromTo(bubble, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.25, ease: pop }, burstAt + k * 0.12 + 1)
    if (k === RING_HERO) pulse(bubble, s3 + 8, 1.06)
  })

  /* ---- 4 · payments: three currencies drop in, the receipt goes out by WhatsApp ---- */
  const s4 = SEG[4]
  const payment = film('payment')
  films('ticket').forEach((ticket, i) => {
    const t = ticketSpots[i]
    const at0 = s4 + 0.3 + i * 0.27
    tl.fromTo(
      ticket,
      { autoAlpha: 0, '--y': -170, '--rx': 50, '--rz': t.rz },
      { autoAlpha: 1, '--y': -4 + (i % 3) * 8, '--rx': 0, '--rz': t.rz * 0.25, duration: 0.75, ease: 'power3.in' },
      at0,
    )
    tl.to(ticket, { '--x': -30, '--y': 10, '--z': 5, '--s': 0.3, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, at0 + 0.9)
  })
  tl.fromTo(all(payment, '[data-cam="received"]'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: pop, stagger: 0.3 }, s4 + 2)
  const save = one(payment, '[data-cam="save"]')
  pulse(save, s4 + 4.4, 0.92)
  const receipt = film('receipt')
  const phone = layout.payPhone
  tl.fromTo(receipt, { autoAlpha: 0, '--s': 0.6 }, { autoAlpha: 1, '--s': 1, duration: 0.3, ease: pop }, s4 + 4.6)
  tl.to(receipt, { '--x': phone.x, '--y': phone.y + 10, '--z': phone.z + 16, '--ry': -14, '--s': 0.55, duration: 0.8, ease: 'power3.inOut' }, s4 + 5)
  tl.to(receipt, { autoAlpha: 0, '--s': 0.3, duration: 0.25 }, s4 + 5.9)
  const payPhone = film('pay-phone')
  // the institute is typing, then the receipt lands in the student's chat
  const bubbles = all(payPhone, '[data-cam="bubble"]')
  const receiptBubble = bubbles[bubbles.length - 1] ?? null
  const typing = one(payPhone, '[data-cam="typing"]')
  gsap.set([typing, receiptBubble], { display: 'none' })
  tl.set(typing, { display: 'flex' }, s4 + 5.2)
  tl.fromTo(typing, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, s4 + 5.2)
  tl.set(typing, { display: 'none' }, s4 + 6.1)
  tl.set(receiptBubble, { display: 'flex' }, s4 + 6.1)
  tl.fromTo(receiptBubble, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: pop }, s4 + 6.1)

  /* ---- 5 · reports: the report assembles, the incidents break down ---- */
  const s5 = SEG[5]
  const report = film('report')
  const reportPage = one(report, ':scope > * > * > :last-child')
  const reportBlocks = reportPage ? (Array.from(reportPage.children) as HTMLElement[]) : []
  const reportKpis = reportBlocks[1] ? (Array.from(reportBlocks[1].children) as HTMLElement[]) : []
  tl.fromTo(reportBlocks, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.45, stagger: 0.2 }, s5 + 0.1)
  tl.fromTo(reportKpis, { scale: 0.7 }, { scale: 1, duration: 0.4, ease: pop, stagger: 0.12 }, s5 + 0.3)
  const reportBars = all(report, '[data-cam="bar"]')
  reportBars.forEach((bar, i) => {
    gsap.set(bar, { scaleY: 0 })
    tl.to(bar, { scaleY: camReportBars[i]?.value ?? 1, duration: 0.8, ease: 'power3.out' }, s5 + 0.7 + i * 0.12)
  })
  const incidents = film('incidents')
  const incidentBars = all(incidents, '[data-film="incident-bar"]')
  incidentBars.forEach((bar, i) => {
    gsap.set(bar, { scaleX: 0 })
    tl.to(bar, { scaleX: Number(bar.dataset.scale ?? 1), duration: 0.8, ease: 'power3.out' }, s5 + 5 + i * 0.16)
  })
  all(incidents, '[data-film="incident-value"]').forEach((el, i) => counter(el, Number(el.dataset.value ?? 0), s5 + 5 + i * 0.16, 0.8))
  all(incidents, '[data-cam="incident-kpi"]').forEach((el, i) => counter(el, Number(el.textContent ?? 0), s5 + 4.9 + i * 0.15, 1))

  /* ---- 6 · results: the platform settles, the figures rise ---- */
  const s6 = SEG[6]
  const fan = sets[6] ? (Array.from(sets[6].children) as HTMLElement[]) : []
  tl.fromTo(fan, { autoAlpha: 0, '--s': 0.85 }, { autoAlpha: 1, '--s': 1, duration: 0.6, stagger: 0.1 }, s6)
  const stats = film('stats')
  tl.fromTo(stats, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, s6 + 0.6)
  films('stat', stats).forEach((stat, i) => {
    const at = s6 + 0.8 + i * 0.5
    tl.fromTo(stat, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.6 }, at)
    const valueEl = film('stat-value', stat)
    const value = story.stats[i]?.value ?? ''
    const text = statText(value, ease)
    if (valueEl) writers.push({ el: valueEl, reset: value, text: (t) => text(clamp01((t - at) / M.countSec)) })
  })

  /* ---- HUD timecode ---- */
  const timecode = one(root, '[data-film="timecode"]')
  const clock = (t: number) => {
    const sec = Math.floor(Math.min(t, TOTAL))
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
  }
  if (timecode) writers.push({ el: timecode, reset: clock(0), text: clock })

  // the timeline lasts exactly the film
  tl.set({}, {}, TOTAL)

  /* ---- focus points: measured on the laid-out screens (layout boxes ignore the animations) ---- */
  const focusEl: Record<FocusName, () => HTMLElement | null> = {
    sheet: () => film('hook-sheet'),
    'sheet-bad': () => duplicates[0] ?? film('hook-sheet'),
    'hook-group': () => film('focus-hook-mid'),
    moodle: () => moodle,
    'moodle-submit': () => film('moodle-submit', moodle),
    paper: () => film('focus-paper'),
    versions: () => film('focus-versions'),
    'signup-phone': () => signupPhone,
    'signup-submit': () => one(signupPhone, '[data-cam="submit"]') ?? signupPhone,
    students: () => film('students'),
    'students-rows': () => studentRows[0]?.parentElement ?? null,
    audit: () => audit,
    'audit-flag': () => flagged[0] ?? audit,
    assign: () => assign,
    'assign-send': () => film('assign-send', assign) ?? assign,
    campaign: () => campaign,
    'ring-all': () => film('focus-ring'),
    'ring-hero': () => rings[RING_HERO] ?? null,
    payment: () => payment,
    'pay-save': () => save?.parentElement ?? payment,
    'pay-phone': () => payPhone,
    report: () => report,
    'report-chart': () => reportBars[0]?.parentElement?.parentElement ?? report,
    incidents: () => incidents,
    'incidents-rows': () => incidentBars[0]?.parentElement?.parentElement?.parentElement ?? incidents,
    platform: () => film('focus-platform'),
  }
  const measure = (): Focus => {
    const em = lens ? parseFloat(getComputedStyle(lens).fontSize) || 0 : 0
    const cache = new Map<FocusName, Box>()
    return (name) => {
      const hit = cache.get(name)
      if (hit) return hit
      const el = focusEl[name]()
      const place = el?.closest<HTMLElement>('[data-place]') ?? null
      const set = place?.closest<HTMLElement>('[data-set]') ?? null
      if (!el || !place || !set) return { x: 0, y: 0, z: 0, w: 100, h: 60 }
      let dx = 0
      let dy = 0
      if (el !== place && em) {
        let x = el.offsetWidth / 2
        let y = el.offsetHeight / 2
        let node: HTMLElement | null = el
        while (node && node !== place) {
          x += node.offsetLeft
          y += node.offsetTop
          node = node.offsetParent as HTMLElement | null
        }
        if (node === place) {
          dx = (x - place.offsetWidth / 2) / em
          dy = (y - place.offsetHeight / 2) / em
        }
      }
      const ry = (num(place, '--ry') * Math.PI) / 180
      const box = el.dataset.box?.split(',').map(Number)
      const v = {
        // the set's own x, not its `--x` (sync rebases that around the camera every frame)
        x: setX(Number(set.dataset.set)) + num(place, '--x') + dx * Math.cos(ry),
        y: num(place, '--y') + dy,
        z: num(place, '--z') - dx * Math.sin(ry),
        w: box ? box[0] : em ? el.offsetWidth / em : 100,
        h: box ? box[1] : em ? el.offsetHeight / em : 60,
      }
      cache.set(name, v)
      return v
    }
  }
  /* ---- the visible area under the band: the world centres there and the camera fits screens in it ---- */
  const band = one(root, '[data-film="band"]')
  const statsBand = film('stats')
  const viewOf = (): View => {
    const em = lens ? parseFloat(getComputedStyle(lens).fontSize) || 0 : 0
    const h = frame.clientHeight
    const top = band?.offsetHeight ?? 0
    lens?.style.setProperty('--film-center', `${top + (h - top) / 2}px`)
    if (!em) return { height: 60, stats: 15 }
    return { height: (h - top) / em, stats: (statsBand?.offsetHeight ?? 0) / em }
  }
  let script: Script = createScript(measure(), viewOf())

  /* ---- particles: lazy WebGL (the story is mounted twice on the case page, one copy hidden) ---- */
  const phoneTier = window.matchMedia(`(max-width: ${tokens.breakpoints.md - 1}px)`).matches
  const particles = createFilmParticles(phoneTier)
  const dots = new Float32Array(particles.capacity * DOT_STRIDE)
  let renderer: DotRenderer | null = null
  let size = { w: 0, h: 0 }
  let drawn = -1
  const resizeCanvas = () => {
    if (!canvas) return
    const rect = frame.getBoundingClientRect()
    size = { w: rect.width, h: rect.height }
    if (!size.w || !size.h) return
    const dpr = Math.min(window.devicePixelRatio || 1, L.filmDprMax)
    canvas.width = Math.round(size.w * dpr)
    canvas.height = Math.round(size.h * dpr)
    renderer ??= createDotRenderer(canvas, C.card)
    renderer?.resize(size.w, size.h, dpr)
    drawn = -1
  }

  /* ---- one screen in focus: every other screen is hidden outside its own shots; cuts fade out, then in ---- */
  const windows: { el: HTMLElement; from: number; to: number; shown: string }[] = []
  const show = (place: HTMLElement | null, from: number, to: number) => {
    const el = place?.firstElementChild as HTMLElement | null | undefined
    if (el) windows.push({ el, from, to, shown: '' })
  }
  const always = -Infinity
  show(film('hook-sheet'), always, 3.4)
  ;['hook-phone', 'hook-counter', 'hook-clock'].forEach((name) => show(film(name), 3.4, 6.8))
  show(moodle, 6.8, 10.2)
  films('paper').forEach((slip) => show(slip, 10.2, 13.2))
  films('version').forEach((card) => show(card, 13.2, Infinity))
  show(signupPhone, always, s1 + 4)
  show(film('students'), s1 + 3.4, Infinity)
  show(badge, s1 + 3.4, Infinity)
  show(assign, always, s3 + 3.45)
  show(campaign, s3 + 3.45, s3 + 6.4)
  rings.forEach((ring) => show(ring, s3 + 4.4, Infinity))
  show(payment, always, s4 + 5.9)
  show(payPhone, s4 + 4.95, Infinity)
  show(report, always, s5 + 4.75)
  show(incidents, s5 + 4.4, Infinity)
  const fade = M.filmCutFadeSec
  const syncWindows = (t: number) => {
    for (const w of windows) {
      const opacity = clamp01(Math.min((t - w.from) / fade, (w.to - t) / fade))
      const shown = opacity >= 1 ? '' : opacity <= 0 ? 'hidden' : opacity.toFixed(3)
      if (shown === w.shown) continue
      w.shown = shown
      w.el.style.visibility = shown === 'hidden' ? 'hidden' : ''
      w.el.style.opacity = shown === '' || shown === 'hidden' ? '' : shown
    }
  }

  /* ---- section entry: a white or black card with the title large in the centre, then to the top-left, smaller ---- */
  const titles = all(root, '[data-film="title"]')
  const card = one(root, '[data-film="entry-card"]')
  const cardWipe = gsap.parseEase(M.filmCardWipeEase) as (p: number) => number
  let cardState = ''
  /** The entry card: fades in over filmCardInSec before a section, holds with the title, wipes open from the top as the title travels */
  const syncCard = (t: number) => {
    let state = 'hidden'
    if (card && !reduced) {
      const i = segmentAt(t)
      const next = i + 1
      const moveAt = M.filmTitleInSec + M.filmTitleHoldSec
      if (next < SEGMENTS && t > SEG[next] - M.filmCardInSec) {
        state = `${SECTION_TONE[next]}|${clamp01((t - (SEG[next] - M.filmCardInSec)) / M.filmCardInSec).toFixed(3)}|0`
      } else {
        const wipe = cardWipe(clamp01((t - SEG[i] - moveAt) / M.filmTitleMoveSec))
        if (wipe < 1) state = `${SECTION_TONE[i]}|1|${wipe.toFixed(4)}`
      }
    }
    if (!card || state === cardState) return
    cardState = state
    if (state === 'hidden') {
      card.style.visibility = ''
      card.style.opacity = ''
      return
    }
    const [tone, opacity, wipe] = state.split('|')
    card.dataset.tone = tone
    card.style.setProperty('--wipe', wipe)
    card.style.opacity = opacity
    card.style.visibility = 'visible'
  }
  const titleIn = gsap.parseEase(M.filmCrashEase) as (p: number) => number
  const titleMove = gsap.parseEase(M.filmTitleMoveEase) as (p: number) => number
  const titleShrink = gsap.parseEase('power2.out') as (p: number) => number
  let titleBig: number[] = titles.map(() => L.filmTitleBig)
  const measureTitles = () => {
    const width = frame.clientWidth
    titleBig = titles.map((title) => (title.offsetWidth ? Math.min(L.filmTitleBig, (L.filmTitleFit * width) / title.offsetWidth) : L.filmTitleBig))
  }
  const titleState = titles.map(() => '')
  const syncTitles = (t: number) => {
    const current = segmentAt(t)
    titles.forEach((title, i) => {
      let state = 'hidden'
      if (i === current) {
        const local = t - SEG[i]
        const appear = clamp01(local / M.filmTitleInSec)
        const moveAt = M.filmTitleInSec + M.filmTitleHoldSec
        const move = titleMove(clamp01((local - moveAt) / M.filmTitleMoveSec))
        const shrink = titleShrink(clamp01((local - moveAt - M.filmTitleMoveSec) / M.filmTitleShrinkSec))
        const big = titleBig[i] ?? 1
        const sc = (big + (1 - big) * shrink) * (1 + 0.3 * (1 - titleIn(appear)))
        const out = i < SEGMENTS - 1 ? clamp01((SEG[i + 1] - t) / M.filmTitleOutSec) : 1
        // on a light card the title starts dark and turns light as it travels to the dark band
        const ink = reduced || SECTION_TONE[i] === 'dark' ? 1 : move
        state = `${(1 - move).toFixed(4)}|${sc.toFixed(4)}|${(appear * out).toFixed(3)}|${ink.toFixed(3)}`
      }
      if (state === titleState[i]) return
      titleState[i] = state
      if (state === 'hidden') {
        title.style.visibility = ''
        title.style.opacity = ''
        return
      }
      const [m, sc, opacity, ink] = state.split('|')
      title.style.setProperty('--c', ink)
      title.style.setProperty('--m', m)
      title.style.setProperty('--sc', sc)
      title.style.opacity = opacity
      title.style.visibility = 'visible'
    })
  }
  measureTitles()

  /* ---- sync: everything that is a function of time ---- */
  const cam: Pose = { x: 0, y: 0, z: 0, d: 0, yaw: 0, pitch: 0, roll: 0, shake: 0 }
  const shown = sets.map(() => true)
  let lensBlur = -1
  let view: FilmView = { segment: -1, ended: false }
  const segFill = (i: number, t: number) => clamp01((t - SEG[i]) / (SEG[i + 1] - SEG[i]))

  /** x the world is currently drawn relative to (see nearestSetX) */
  let base = NaN
  const sync = (t: number) => {
    script.poseAt(t, cam)
    const b = nearestSetX(cam.x)
    if (b !== base) {
      base = b
      sets.forEach((set) => {
        const x = String(setX(Number(set.dataset.set)) - b)
        set.style.setProperty('--x', x)
        set.style.setProperty('--sx', x)
      })
    }
    if (world) {
      world.style.transform = worldTransform({ ...cam, x: cam.x - b }, t)
      // depth of each place on the flat world (Film.module.css `.place`): eye-to-plane distance and camera axis
      world.style.setProperty('--D', String(L.filmPerspective + cam.d + cam.z))
      world.style.setProperty('--cx', String(cam.x - b))
      world.style.setProperty('--cy', String(cam.y))
    }
    syncWindows(t)
    syncTitles(t)
    syncCard(t)
    sets.forEach((set, i) => {
      const on = setVisible(i, t)
      if (on !== shown[i]) {
        shown[i] = on
        set.style.visibility = on ? '' : 'hidden'
      }
    })
    const whip = script.whipAt(t)
    const blur = Math.round(whip * L.filmWhipBlur * 100) / 100
    if (lens && blur !== lensBlur) {
      lensBlur = blur
      lens.style.filter = blur > 0.02 ? `blur(${blur}em)` : ''
    }
    for (const w of writers) {
      const text = w.text(t)
      if (w.el.textContent !== text) w.el.textContent = text
    }
    fills().forEach((fill, i) => {
      if (fill) fill.style.transform = `scaleX(${segFill(i, t)})`
    })
    if (renderer && size.w) {
      const n = particles.fill(t, size.w, size.h, dots)
      if (n || drawn !== 0) {
        renderer.draw(dots, n)
        drawn = n
      }
    }
    let segment = SEGMENTS - 1
    for (let i = 1; i <= SEGMENTS; i++) {
      if (t < SEG[i]) {
        segment = i - 1
        break
      }
    }
    const ended = t >= TOTAL
    if (segment !== view.segment || ended !== view.ended) {
      view = { segment, ended }
      onView(view)
    }
  }

  tl.eventCallback('onUpdate', () => sync(tl.time()))

  return {
    tl,
    sync,
    resize: () => {
      script = createScript(measure(), viewOf())
      measureTitles()
      resizeCanvas()
      sync(tl.time())
    },
    dispose: () => {
      tl.kill()
      for (const w of writers) w.el.textContent = w.reset
      if (world) world.style.transform = ''
      if (lens) lens.style.filter = ''
      sets.forEach((set) => {
        set.style.visibility = ''
        set.style.setProperty('--x', String(setX(Number(set.dataset.set))))
        set.style.setProperty('--sx', String(setX(Number(set.dataset.set))))
      })
      if (world) for (const v of ['--D', '--cx', '--cy']) world.style.removeProperty(v)
      for (const w of windows) {
        w.el.style.visibility = ''
        w.el.style.opacity = ''
      }
      for (const title of titles) title.removeAttribute('style')
      card?.removeAttribute('style')
      lens?.style.removeProperty('--film-center')
    },
  }
}
