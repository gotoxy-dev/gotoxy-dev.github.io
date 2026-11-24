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

/** A plain phone body (em), for the student's side: signup form and WhatsApp */
export function Phone({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cx(styles.phone, className)} style={style}>
      <div className={styles.phoneScreen}>{children}</div>
    </div>
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

export function Chat({ count = camChat.messages.length }: { count?: number }) {
  return (
    <div className={styles.chat}>
      <div className={styles.chatHead}>
        <span className={styles.avatar}>
          <CamLogo light />
        </span>
        <span>
          {camChat.contact}
          <span className={styles.chatStatus}>cuenta de empresa</span>
        </span>
      </div>
      <div className={styles.chatBody}>
        {camChat.messages.slice(0, count).map((m, i) => (
          <span key={m} className={styles.bubble} data-cam="bubble">
            {m}
            <span className={styles.bubbleTime}>{camChat.time[i]} ✓✓</span>
          </span>
        ))}
      </div>
    </div>
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
