import type { CSSProperties, ReactNode } from 'react'
import {
  camCampaign,
  camChat,
  camNav,
  camPayment,
  camReportBars,
  camReportKpis,
  camSheet,
  camSignup,
  camStudentKpis,
  camStudents,
  type CamTab,
  type Tone,
} from './camData'
import styles from './CamUi.module.css'

/**
 * Instituto CAM panel, redrawn as HTML with invented data (camData.ts). Every size is in em, so a
 * parent scales a whole screen by setting its font-size. Elements an animation drives carry a
 * `data-cam` hook (rows, pills, counters, progress fill, chat bubbles…).
 */

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ')
const fmt = (n: number) => n.toLocaleString('es-PY')

export function Pill({ tone = 'muted', children, hook }: { tone?: Tone; children: ReactNode; hook?: string }) {
  return (
    <span className={cx(styles.pill, styles[tone])} data-cam={hook}>
      {children}
    </span>
  )
}

export function Kpi({ value, label, tone, hook }: { value: string; label: string; tone?: Tone; hook?: string }) {
  return (
    <div className={styles.kpi}>
      <span className={cx(styles.kpiDash, tone && styles[tone])} />
      <span className={styles.kpiValue} data-cam={hook}>
        {value}
      </span>
      <span className={styles.kpiLabel}>{label}</span>
    </div>
  )
}

/** CAM logo: the blue cap and the wordmark, in em */
export function CamLogo({ light }: { light?: boolean }) {
  return (
    <span className={cx(styles.logo, light && styles.logoLight)} aria-hidden="true">
      <svg viewBox="0 0 24 16" className={styles.logoCap}>
        <path d="M1 6 12 1l11 5-11 5Z" />
        <path d="M5 8.5v4c0 1.5 3.2 2.8 7 2.8s7-1.3 7-2.8v-4L12 12Z" opacity="0.75" />
      </svg>
      CAM
    </span>
  )
}

/** Admin window: navy bar with the logo and the sections, the light page below */
export function Window({
  active,
  children,
  className,
  style,
}: {
  active: CamTab
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cx(styles.window, className)} style={style}>
      <div className={styles.bar}>
        <CamLogo light />
        <span className={styles.nav}>
          {camNav.map((tab) => (
            <span key={tab} className={cx(styles.navItem, tab === active && styles.navActive)}>
              {tab}
            </span>
          ))}
        </span>
        <span className={styles.user}>admin</span>
      </div>
      <div className={styles.page}>{children}</div>
    </div>
  )
}

export function StudentsScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Window active="Alumnos" className={className} style={style}>
      <h4 className={styles.h}>Alumnos</h4>
      <div className={styles.kpis}>
        {camStudentKpis.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.search}>Buscar por nombre, documento, teléfono…</div>
        <div className={cx(styles.tr, styles.th)}>
          <span>Nombre</span>
          <span>Univ.</span>
          <span>Comisión</span>
          <span>Cotejo</span>
          <span>Moodle</span>
        </div>
        {camStudents.map((s) => (
          <div key={s.name} className={styles.tr} data-cam="row">
            <span className={styles.strong}>{s.name}</span>
            <span>{s.university}</span>
            <span>{s.commission}</span>
            <span>
              <Pill tone={s.check.tone} hook="check">
                {s.check.label}
              </Pill>
            </span>
            <span>
              <Pill tone={s.moodle.tone} hook="moodle">
                {s.moodle.label}
              </Pill>
            </span>
          </div>
        ))}
      </div>
    </Window>
  )
}

export function CampaignScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  const c = camCampaign
  return (
    <Window active="WhatsApp" className={className} style={style}>
      <h4 className={styles.h}>Seguimiento de campaña</h4>
      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.strong}>{c.name}</span>
          <Pill tone="green" hook="state">
            Enviando
          </Pill>
        </div>
        <div className={styles.sequence}>
          {c.messages.map((m, i) => (
            <span key={m} className={styles.step}>
              <span className={styles.stepIndex}>{i + 1}</span>
              {m}
            </span>
          ))}
        </div>
        <div className={styles.progress}>
          <span className={styles.progressFill} data-cam="progress" style={{ transform: `scaleX(${c.sent / c.total})` }} />
        </div>
        <div className={styles.row}>
          <span className={styles.muted}>
            <b data-cam="sent">{fmt(c.sent)}</b> de {fmt(c.total)} aceptados
          </span>
          <span className={styles.muted}>Aceptación no significa entrega</span>
        </div>
      </div>
      <div className={styles.kpis}>
        <Kpi value={fmt(c.delivered)} label="Entregados" tone="green" hook="delivered" />
        <Kpi value={fmt(c.read)} label="Leídos" tone="blue" hook="read" />
        <Kpi value={fmt(c.failed)} label="Fallidos" tone="red" />
        <Kpi value="0" label="Pendientes" />
      </div>
    </Window>
  )
}

export function ReportScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Window active="WhatsApp" className={className} style={style}>
      <div className={styles.row}>
        <h4 className={styles.h}>Informe de envíos</h4>
        <span className={styles.button}>Descargar PDF</span>
      </div>
      <div className={styles.kpis}>
        {camReportKpis.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.chart}>
          {camReportBars.map((b) => (
            <span key={b.commission} className={styles.barCol}>
              <span className={styles.chartBar} data-cam="bar" style={{ transform: `scaleY(${b.value})` }} />
              <span className={styles.barLabel}>{b.commission}</span>
            </span>
          ))}
        </div>
      </div>
    </Window>
  )
}

export function PaymentScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  const p = camPayment
  return (
    <Window active="Pagos" className={className} style={style}>
      <h4 className={styles.h}>Nuevo pago</h4>
      <div className={styles.split}>
        <div className={styles.card}>
          <Field label="Alumno" value={p.student} />
          <Field label="Concepto" value={p.concept} />
          <Field label="Importe" value={p.amount} />
          <span className={styles.fieldLabel}>Recibido</span>
          <div className={styles.received}>
            {p.received.map((r) => (
              <span key={r.method} className={styles.chip} data-cam="received">
                {r.method} · {r.amount}
              </span>
            ))}
          </div>
          <Field label="Cajera" value={p.cashier} />
        </div>
        <div className={styles.card}>
          <span className={styles.strong}>Revisar antes de guardar</span>
          <div className={styles.summary}>
            <span>Concepto</span>
            <span>{p.concept}</span>
            <span>Queda debiendo</span>
            <span>{p.owed}</span>
          </div>
          <span className={styles.total}>{p.amount}</span>
          <span className={cx(styles.button, styles.buttonPrimary)} data-cam="save">
            Guardar y enviar comprobante
          </span>
        </div>
      </div>
    </Window>
  )
}

function Field({ label, value, hook }: { label: string; value: string; hook?: string }) {
  return (
    <span className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.input} data-cam={hook}>
        {value}
      </span>
    </span>
  )
}

export function SignupForm() {
  const s = camSignup
  return (
    <div className={styles.signup}>
      <CamLogo />
      <span className={styles.signupTitle}>{s.title}</span>
      <span className={styles.muted}>{s.hint}</span>
      {s.fields.map((f) => (
        <Field key={f.label} label={f.label} value={f.value} hook="field" />
      ))}
      <span className={styles.field}>
        <span className={styles.fieldLabel}>Telefone / WhatsApp</span>
        <span className={styles.phoneField}>
          <span className={styles.prefix}>
            {s.phone.flag} {s.phone.prefix}
          </span>
          <span className={styles.input} data-cam="field">
            {s.phone.value}
          </span>
        </span>
      </span>
      <span className={cx(styles.button, styles.buttonPrimary, styles.buttonBlock)} data-cam="submit">
        {s.submit}
      </span>
    </div>
  )
}

/**
 * A modern phone (em): thin bezel, dynamic island, side buttons and a status bar (time, signal,
 * wifi, battery). The bar turns light over a WhatsApp header (`.phoneScreen:has(.wa)`).
 */
export function Phone({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cx(styles.phone, className)} style={style}>
      <div className={styles.phoneScreen}>
        {children}
        <span className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.island} />
          <span className={styles.statusIcons}>
            <svg viewBox="0 0 18 12">
              <rect x="0" y="8" width="3" height="4" rx="0.8" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
              <rect x="10" y="3" width="3" height="9" rx="0.8" />
              <rect x="15" y="0" width="3" height="12" rx="0.8" />
            </svg>
            <svg viewBox="0 0 16 12">
              <path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Z" />
              <path d="M3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0Z" />
              <path d="M1.2 4.6a9.6 9.6 0 0 1 13.6 0l-1.4 1.4a7.6 7.6 0 0 0-10.8 0Z" />
            </svg>
            <svg viewBox="0 0 26 12">
              <rect x="0.6" y="0.6" width="22" height="10.8" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
              <rect x="2.4" y="2.4" width="15.5" height="7.2" rx="1.6" />
              <path d="M24 4.2v3.6a1.8 1.8 0 0 0 0-3.6Z" opacity="0.45" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  )
}

/* ---- WhatsApp (Android, light theme), drawn in code with invented data ---- */

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className={styles.waIcon} aria-hidden="true">
    <path d={d} />
  </svg>
)
const ICON = {
  back: 'M15.4 4.6 14 3.2 5.2 12l8.8 8.8 1.4-1.4L8 12Z',
  video:
    'M3 6.5A1.5 1.5 0 0 1 4.5 5h10A1.5 1.5 0 0 1 16 6.5v2.3l4.2-2.6c.4-.2.8 0 .8.5v10.6c0 .5-.4.7-.8.5L16 15.2v2.3a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 17.5Z',
  call: 'M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1Z',
  dots: 'M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  emoji:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 17.5c2.3 0 4.3-1.4 5-3.5H7c.7 2.1 2.7 3.5 5 3.5Z',
  clip: 'M16.5 6v11.5a4.5 4.5 0 0 1-9 0V5a3 3 0 0 1 6 0v10.5a1.5 1.5 0 0 1-3 0V6H9v9.5a3 3 0 0 0 6 0V5a4.5 4.5 0 0 0-9 0v12.5a6 6 0 0 0 12 0V6Z',
  camera:
    'M9 3 7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  mic: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9Z',
  send: 'M2 21 23 12 2 3v7l15 2-15 2Z',
  reply: 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11Z',
  glyph:
    'M16.6 14.2c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a7.6 7.6 0 0 1-3.8-3.3c-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2c-.2-.6-.5-.5-.6-.5h-.5a1 1 0 0 0-.7.3A3 3 0 0 0 6 9.2a5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.2-.2-.5-.3ZM12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2Z',
}

/** The messaging app's icon, drawn here: a green rounded square with a phone glyph */
export function WaAppIcon() {
  return <span className={styles.waApp}>{icon(ICON.glyph)}</span>
}

/** Round avatar: the CAM cap, or an initial */
export function WaAvatar({ initial }: { initial?: string }) {
  return (
    <span className={cx(styles.waAvatar, initial !== undefined && styles.waAvatarInitial)}>
      {initial ?? (
        <svg viewBox="0 0 24 16" className={styles.waCap}>
          <path d="M1 6 12 1l11 5-11 5Z" />
          <path d="M5 8.5v4c0 1.5 3.2 2.8 7 2.8s7-1.3 7-2.8v-4L12 12Z" opacity="0.75" />
        </svg>
      )}
    </span>
  )
}

/** Chat header: back, avatar, name (verified business badge), subtitle, video, call and menu */
export function WaHeader({ name, status, initial, verified }: { name: string; status: string; initial?: string; verified?: boolean }) {
  return (
    <div className={styles.waHead}>
      {icon(ICON.back)}
      <WaAvatar initial={initial} />
      <span className={styles.waName}>
        <span className={styles.waNameRow}>
          <span className={styles.waNameText}>{name}</span>
          {verified && (
            <svg viewBox="0 0 16 16" className={styles.waVerified} aria-hidden="true">
              <path d="M8 0 10 1.6l2.5-.1.8 2.4 2 1.5-.8 2.4.8 2.4-2 1.5-.8 2.4-2.5-.1L8 16l-2-1.6-2.5.1-.8-2.4-2-1.5.8-2.4L.7 5.8l2-1.5.8-2.4 2.5.1Z" />
              <path d="m4.6 8.2 2.3 2.3 4.6-4.6" className={styles.waVerifiedTick} />
            </svg>
          )}
        </span>
        <span className={styles.waStatus}>{status}</span>
      </span>
      {icon(ICON.video)}
      {icon(ICON.call)}
      {icon(ICON.dots)}
    </div>
  )
}

/** The chat: header, wallpaper with its doodles, messages from the bottom up, composer */
export function WaChat({ header, children, composer }: { header: ReactNode; children: ReactNode; composer?: ReactNode }) {
  return (
    <div className={styles.wa}>
      {header}
      <div className={styles.waBody}>{children}</div>
      {composer ?? <WaComposer />}
    </div>
  )
}

export function WaDay({ label }: { label: string }) {
  return <span className={styles.waDay}>{label}</span>
}

/** A bubble: incoming (white) or outgoing (green, double blue ticks); the first of a group has a tail */
export function WaBubble({
  out,
  tail,
  time,
  children,
  hook,
}: {
  out?: boolean
  tail?: boolean
  time: string
  children: ReactNode
  hook?: string
}) {
  return (
    <span className={cx(styles.waBubble, out ? styles.waOut : styles.waIn, tail && styles.waTail)} data-cam={hook}>
      {children}
      <span className={styles.waTime}>
        {time}
        {out && (
          <svg viewBox="0 0 18 11" className={styles.waTicks} aria-hidden="true">
            <path d="m1 6 3.5 3.5L12 2M7 8.5 8 9.5 15.5 2" />
          </svg>
        )}
      </span>
    </span>
  )
}

/** Quick-reply buttons of a template message, under its bubble */
export function WaButtons({ labels }: { labels: string[] }) {
  return (
    <span className={styles.waButtons}>
      {labels.map((label) => (
        <span key={label} className={styles.waButton}>
          {icon(ICON.reply)}
          {label}
        </span>
      ))}
    </span>
  )
}

/** "typing…": three dots in an incoming bubble */
export function WaTyping({ hook }: { hook?: string }) {
  return (
    <span className={cx(styles.waBubble, styles.waIn, styles.waTyping)} data-cam={hook}>
      <span />
      <span />
      <span />
    </span>
  )
}

/** The bar at the bottom: emoji, the input, attach, camera, and the mic (send while typing) */
export function WaComposer({ text, hook, sending }: { text?: string; hook?: string; sending?: boolean }) {
  return (
    <div className={styles.waComposer}>
      <span className={styles.waInput}>
        {icon(ICON.emoji)}
        <span className={styles.waInputText} data-cam={hook}>
          {text ?? camChat.composer}
        </span>
        {icon(ICON.clip)}
        {icon(ICON.camera)}
      </span>
      <span className={styles.waMic}>{icon(sending ? ICON.send : ICON.mic)}</span>
    </div>
  )
}

/** The student's chat with the institute: template message, Zoom link with its preview, receipt */
export function Chat({ count = camChat.messages.length, typing = false }: { count?: number; typing?: boolean }) {
  return (
    <WaChat header={<WaHeader name={camChat.contact} status={camChat.status} verified />}>
      <WaDay label={camChat.day} />
      {camChat.messages.slice(0, count).map((m, i) => (
        <span key={m.time + m.body} className={styles.waGroup} data-cam="bubble">
          <WaBubble tail={i === 0} time={m.time}>
            {m.link && (
              <span className={styles.waPreview}>
                <span className={styles.waPreviewThumb}>{icon(ICON.video)}</span>
                <span className={styles.waPreviewText}>
                  <b>{m.link.title}</b>
                  <span>{m.link.site}</span>
                </span>
              </span>
            )}
            {m.file && (
              <span className={styles.waPreview}>
                <span className={styles.waFileIcon}>PDF</span>
                <span className={styles.waPreviewText}>
                  <b>{m.file.name}</b>
                  <span>{m.file.meta}</span>
                </span>
              </span>
            )}
            {m.header && <b className={styles.waTplHead}>{m.header}</b>}
            <span>{m.body}</span>
            {m.link && <span className={styles.waLink}>{m.link.url}</span>}
            {m.footer && <span className={styles.waFooter}>{m.footer}</span>}
          </WaBubble>
          {m.buttons && <WaButtons labels={m.buttons} />}
        </span>
      ))}
      {typing && <WaTyping hook="typing" />}
    </WaChat>
  )
}

/** The spreadsheet of before: duplicated and missing cells */
export function Sheet({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={cx(styles.sheet, className)} style={style}>
      <div className={styles.sheetTitle}>{camSheet.title}</div>
      <div className={cx(styles.sheetRow, styles.sheetHead)}>
        <span />
        {camSheet.columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {camSheet.rows.map((r, i) => (
        <div key={i} className={styles.sheetRow} data-cam="sheet-row">
          <span className={styles.sheetIndex}>{i + 2}</span>
          {r.map((cell, j) => (
            <span key={j} className={cx(!cell && styles.sheetEmpty, cell.startsWith('¿') && styles.sheetDoubt)}>
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
