import { memo, type CSSProperties, type ReactNode } from 'react'
import type { CaseShowcase } from '@/content/site'
import { camStudents } from '../camData'
import { camChat } from '../camData'
import {
  CampaignScreen,
  Chat,
  PaymentScreen,
  Phone,
  ReportScreen,
  SignupForm,
  StudentsScreen,
  WaBubble,
  WaChat,
  WaComposer,
  WaDay,
  WaHeader,
} from '../CamUi'
import { seeded, setX } from './script'
import { storyCashSheet, storyHookTarget, storyListSheet, storyVersions } from './storyData'
import {
  AssignCard,
  AuditScreen,
  IncidentsScreen,
  MessageCard,
  MoodleForm,
  ExcelCopy,
  ExcelWindow,
  RecordCard,
  ReceiptCard,
  RingPhone,
  TemplatesScreen,
  Ticket,
  WhoNote,
  WinCalculator,
} from './StoryScreens'
import styles from './Film.module.css'

/**
 * The story film's stage, all drawn in code: the 3D world (one set per segment, side by side, with
 * the CAM screens placed at x/y/z and rotated), the particle canvas, the results' stats band and a vignette. Nothing here moves
 * by itself: CamStory's timeline and `sync` drive it. Places are flat layers; focus markers are
 * empty places the camera aims at.
 */

interface PlaceProps {
  /** An empty focus marker: the size (world em) the camera frames, without drawing anything */
  box?: [number, number]
  /** A screen: the overlap rule (one screen in focus, nothing over it) applies to it */
  screen?: boolean
  x?: number
  y?: number
  z?: number
  rx?: number
  ry?: number
  rz?: number
  s?: number
  /** Font-size (em of the world): the mockup's scale */
  fs?: number
  w?: number
  h?: number
  film?: string
  className?: string
  children?: ReactNode
}

/** A flat layer in the world, centred on (x, y, z); its transform reads CSS vars GSAP can tween */
function Place({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, fs = 1, w, h, box, screen, film, className, children }: PlaceProps) {
  const style = {
    '--x': x,
    '--y': y,
    '--z': z,
    '--rx': rx,
    '--ry': ry,
    '--rz': rz,
    '--s': s,
    '--fs': fs,
    ...(w !== undefined && { '--w': `${w}em` }),
    ...(h !== undefined && { '--h': `${h}em` }),
  } as CSSProperties
  return (
    <div className={`${styles.place} ${className ?? ''}`} style={style} data-place="" data-screen={screen ? '' : undefined} data-box={box?.join(',')} data-film={film}>
      <div className={w !== undefined ? `${styles.content} ${styles.fill}` : styles.content}>{children}</div>
    </div>
  )
}

function FilmSet({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div className={styles.set} data-set={index} style={{ '--x': setX(index), '--sx': setX(index) } as CSSProperties}>
      {children}
    </div>
  )
}

/* ---- layouts (local to their set, world em); scattered ones are seeded so they never change ---- */
export const layout = {
  sheet: { x: 0, y: 0, z: 0 },
  hookPhone: { x: 240, y: 0, z: 0 },
  hookCount: { x: 318, y: -8, z: 10 },
  hookMid: { x: 282, y: 0, z: 0 },
  moodle: { x: 620, y: 0, z: 0 },
  paper: { x: 950, y: 0, z: 0 },
  versions: { x: 1250, y: 0, z: 0 },
  signupPhone: { x: -100, y: 6, z: 60 },
  students: { x: 40, y: 0, z: -80 },
  assign: { x: -70, y: 28, z: 40 },
  payPhone: { x: 135, y: 0, z: 40 },
  report: { x: -60, y: 0, z: 0 },
  incidents: { x: 135, y: 0, z: 40 },
  platform: { x: 0, y: 0, z: 0 },
}
/** The ring phone the camera pushes into after the campaign's burst */
export const RING_HERO = 1

const rand = seeded(41)
const RECORDS = Array.from({ length: 14 }, (_, i) => {
  const side = i % 2 ? 1 : -1
  return {
    x: layout.students.x + side * (70 + rand() * 90),
    y: (rand() - 0.5) * 150,
    z: 60 + rand() * 160,
    ry: -side * (10 + rand() * 20),
    rz: (rand() - 0.5) * 16,
  }
})
const RING = Array.from({ length: 8 }, (_, i) => {
  const side = i % 2 ? 1 : -1
  const rank = Math.floor(i / 2)
  return { x: side * (135 + rank * 62), y: (rank % 2 ? -1 : 1) * 36, z: -50 - rank * 30, ry: -side * (10 + rank * 4) }
})
const MESSAGES = Array.from({ length: 16 }, (_, i) => ({ to: i % RING.length, rz: (rand() - 0.5) * 30 }))
const TICKETS = Array.from({ length: 6 }, (_, i) => ({
  x: -125 + i * 42 + (rand() - 0.5) * 20,
  z: 10 + rand() * 70,
  rz: (rand() - 0.5) * 50,
}))
/** Problem, copies of the list: tiled one under the other (Excel's "Organizar todo"), the note beside them */
const VERSIONS = storyVersions.map((_, i) => ({ x: layout.versions.x, y: (i - 1) * 24, z: 0 }))

/** Where a ring phone stands (its message lands there) */
export const ringSpot = (i: number) => RING[i % RING.length]
export const messageSpots = MESSAGES
export const ticketSpots = TICKETS
export const versionSpots = VERSIONS

const PANEL = { w: 150, h: 96, fs: 2.1 }
const PHONE = { w: 45, h: 96, fs: 2 }

const hookContacts = camStudents.slice(0, 3).map((s) => s.name)
export const hookMessage = (name: string) =>
  `Olá, ${name.split(' ')[0]}! Seu acesso ao campus virtual: usuário e senha abaixo. Qualquer dúvida, responda esta mensagem.`
export const hookNames = hookContacts

const fmt = new Intl.NumberFormat('es-PY')

interface FilmProps {
  story: CaseShowcase['story']
}

export const Film = memo(function Film({ story }: FilmProps) {
  return (
    <>
      <div className={styles.lens} data-film="lens">
        <div className={styles.viewport}>
          <div className={styles.world} data-film="world">
            <ProblemSet />
            <SignupSet />
            <AuditSet />
            <CampaignSet />
            <PaymentSet />
            <ReportSet />
            <PlatformSet />
          </div>
        </div>
      </div>

      <canvas className={styles.canvas} data-film="canvas" />

      <div className={styles.beats} data-film="beats">
        {story.problemBeats.map((text, i) => (
          <span key={`${i}-${text}`} className={styles.beat} data-film="beat">
            {text}
          </span>
        ))}
      </div>

      <div className={styles.stats} data-film="stats">
        {story.stats.map((stat) => (
          <span key={`${stat.value}-${stat.label}`} className={styles.stat} data-film="stat">
            <span className={styles.statValue} data-film="stat-value">
              {stat.value}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </span>
        ))}
      </div>

      <span className={styles.vignette} />
    </>
  )
})

/* 0 · problem: the hand-typed sheet, one WhatsApp at a time, Moodle by hand, paper, untraceable copies */
function ProblemSet() {
  return (
    <FilmSet index={0}>
      <Place {...layout.sheet} fs={3.2} film="hook-sheet" screen>
        <ExcelWindow sheet={storyListSheet} />
      </Place>

      <Place {...layout.hookPhone} ry={-12} w={PHONE.w} h={PHONE.h} fs={PHONE.fs} film="hook-phone" screen>
        <Phone className={styles.fill}>
          {hookContacts.map((name, i) => (
            <div key={name} className={styles.cover} data-film="hook-page">
              <WaChat
                header={<WaHeader name={name} status="online" initial={name[0]} />}
                composer={<WaComposer text=" " hook="hook-composer" sending />}
              >
                <WaDay label={camChat.day} />
                <WaBubble out tail time={`09:${String(40 + i).padStart(2, '0')}`} hook="hook-sent">
                  {hookMessage(name)}
                </WaBubble>
              </WaChat>
            </div>
          ))}
        </Phone>
      </Place>
      <Place {...layout.hookCount} fs={1} film="hook-counter">
        <span className={styles.hookCount}>
          <span data-film="hook-count">0</span>
          <span className={styles.hookTotal}> / {fmt.format(storyHookTarget)}</span>
        </span>
      </Place>
      <Place x={layout.hookCount.x} y={36} z={-10} fs={1} film="hook-clock">
        <svg viewBox="0 0 40 40" className={styles.clock}>
          <circle cx="20" cy="20" r="17" className={styles.clockFace} />
          <line x1="20" y1="20" x2="20" y2="10" className={styles.clockHour} data-film="hook-hour" />
          <line x1="20" y1="20" x2="20" y2="6" className={styles.clockMinute} data-film="hook-minute" />
          <circle cx="20" cy="20" r="1.8" className={styles.clockPin} />
        </svg>
      </Place>
      <Place {...layout.hookMid} box={[150, 100]} film="focus-hook-mid" />

      <Place {...layout.moodle} fs={2.8} film="moodle" screen>
        <MoodleForm />
      </Place>

      <Place x={layout.paper.x - 14} fs={3} film="xl-cash" screen>
        <ExcelWindow sheet={storyCashSheet} />
      </Place>
      <Place x={layout.paper.x + 48} y={-10} z={8} fs={2.2} film="win-calc">
        <WinCalculator />
      </Place>
      <Place x={layout.paper.x + 4} box={[134, 76]} film="focus-paper" />

      {VERSIONS.map((v, i) => (
        <Place key={i} {...v} fs={2.4} film="version" screen>
          <ExcelCopy index={i} />
        </Place>
      ))}
      <Place x={layout.versions.x + 44} y={0} z={0} rz={3} fs={2.2} film="who-note">
        <WhoNote />
      </Place>
      <Place x={layout.versions.x + 10} box={[86, 72]} film="focus-versions" />
    </FilmSet>
  )
}

/* 1 · signup: the student's phone fills the form, signups pour into the students panel */
function SignupSet() {
  return (
    <FilmSet index={1}>
      <Place {...layout.students} w={PANEL.w} h={PANEL.h} fs={PANEL.fs} film="students" screen>
        <StudentsScreen className={styles.fill} />
      </Place>
      <Place x={layout.students.x + 52} y={-58} z={layout.students.z + 30} fs={2.4} film="signup-badge">
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          <b data-film="signup-today">0</b>
          <span className={styles.badgeLabel}>hoy</span>
        </span>
      </Place>
      {RECORDS.map((r, i) => (
        <Place key={i} {...r} fs={2} film="record" className={i >= 8 ? styles.extra : undefined}>
          <RecordCard index={i} />
        </Place>
      ))}
      <Place {...layout.signupPhone} ry={16} w={PHONE.w} h={PHONE.h} fs={PHONE.fs} film="signup-phone" screen>
        <Phone className={styles.fill}>
          <SignupForm />
        </Phone>
      </Place>
    </FilmSet>
  )
}

/* 2 · cross-check: every student, commission by commission */
function AuditSet() {
  return (
    <FilmSet index={2}>
      <Place w={160} h={104} fs={2.1} film="audit" screen>
        <AuditScreen className={styles.fill} />
      </Place>
    </FilmSet>
  )
}

/* 3 · campaigns: assign, send, and the messages fly out to every student's phone */
function CampaignSet() {
  return (
    <FilmSet index={3}>
      {RING.map((r, i) => (
        <Place key={i} {...r} w={40} h={84} fs={1.95} film="ring" screen>
          <RingPhone index={i} />
        </Place>
      ))}
      <Place w={PANEL.w} h={PANEL.h} fs={PANEL.fs} film="campaign" screen>
        <CampaignScreen className={styles.fill} />
      </Place>
      <Place w={PANEL.w} h={PANEL.h} fs={PANEL.fs} film="templates" screen>
        <TemplatesScreen className={styles.fill} />
      </Place>
      <Place z={-30} box={[520, 230]} film="focus-ring" />
      <Place {...layout.assign} ry={16} fs={2} film="assign" screen>
        <AssignCard />
      </Place>
      {MESSAGES.map((m, i) => (
        <Place key={i} z={10} rz={m.rz} fs={1.8} film="message" className={i >= 10 ? styles.extra : undefined}>
          <MessageCard index={i} />
        </Place>
      ))}
    </FilmSet>
  )
}

/* 4 · payments: three currencies drop in, the receipt goes out by WhatsApp */
function PaymentSet() {
  return (
    <FilmSet index={4}>
      <Place w={PANEL.w} h={PANEL.h} fs={PANEL.fs} film="payment" screen>
        <PaymentScreen className={styles.fill} />
      </Place>
      {TICKETS.map((t, i) => (
        <Place key={i} x={t.x} y={-170} z={t.z} rz={t.rz} fs={2.2} film="ticket">
          <Ticket index={i} />
        </Place>
      ))}
      <Place {...layout.payPhone} ry={-14} w={PHONE.w} h={PHONE.h} fs={PHONE.fs} film="pay-phone" screen>
        <Phone className={styles.fill}>
          <Chat typing />
        </Phone>
      </Place>
      <Place x={40} y={28} z={20} fs={2} film="receipt">
        <ReceiptCard />
      </Place>
    </FilmSet>
  )
}

/* 5 · reports: the report assembles, the incidents break down */
function ReportSet() {
  return (
    <FilmSet index={5}>
      <Place {...layout.report} ry={10} w={PANEL.w} h={PANEL.h} fs={PANEL.fs} film="report" screen>
        <ReportScreen className={styles.fill} />
      </Place>
      <Place {...layout.incidents} ry={-20} w={115} h={PANEL.h} fs={PANEL.fs} film="incidents" screen>
        <IncidentsScreen className={styles.fill} />
      </Place>
    </FilmSet>
  )
}

/* 6 · results: the whole platform, three screens side by side */
function PlatformSet() {
  return (
    <FilmSet index={6}>
      <Place x={-164} ry={8} w={PANEL.w} h={PANEL.h} fs={PANEL.fs} screen>
        <StudentsScreen className={styles.fill} />
      </Place>
      <Place w={PANEL.w} h={PANEL.h} fs={PANEL.fs} screen>
        <CampaignScreen className={styles.fill} />
      </Place>
      <Place x={164} ry={-8} w={PANEL.w} h={PANEL.h} fs={PANEL.fs} screen>
        <ReportScreen className={styles.fill} />
      </Place>
      <Place {...layout.platform} box={[478, PANEL.h]} film="focus-platform" />
    </FilmSet>
  )
}
