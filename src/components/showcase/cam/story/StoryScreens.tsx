import type { CSSProperties } from 'react'
import { CamLogo, Kpi, Phone, Pill, WaAppIcon, WaBubble, WaButtons, WaChat, WaDay, WaHeader, Window } from '../CamUi'
import { camChat } from '../camData'
import {
  storyAssign,
  storyHookTarget,
  storyMoodleForm,
  storyPaper,
  storyVersions,
  storyAudit,
  storyAuditTotals,
  storyIncidents,
  storyMessages,
  storyReplies,
  storyReceipt,
  storySignups,
  storyTickets,
  storyUniversities,
} from './storyData'
import styles from './StoryScreens.module.css'

/**
 * Extra CAM screens for the story film, drawn in em like CamUi (a parent's font-size scales them)
 * with invented data (storyData.ts). Elements the film drives carry a `data-film` hook.
 */

const fmt = (n: number) => n.toLocaleString('es-PY')
const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ')

/** A signup arriving: one small record card */
export function RecordCard({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const s = storySignups[index % storySignups.length]
  return (
    <div className={cx(styles.record, className)} style={style}>
      <span className={styles.recordAvatar}>{s.name[0]}</span>
      <span className={styles.recordText}>
        <span className={styles.strong}>{s.name}</span>
        <span className={styles.muted}>
          {storyUniversities[index % storyUniversities.length]} · {s.course}
        </span>
      </span>
      <span className={styles.recordFlag}>BR +55</span>
    </div>
  )
}

/** Cross-check, commission by commission: flagged rows carry their flag and the match that replaces it */
export function AuditScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Window active="Datos" className={className} style={style}>
      <div className={styles.row}>
        <h4 className={styles.h}>Cotejo por comisión</h4>
        <span className={styles.muted}>Universidad · Sistema · Moodle</span>
      </div>
      <div className={styles.kpis3}>
        <Kpi value={fmt(storyAuditTotals.records)} label="Registros" />
        <Kpi value="0" label="Cotejados" tone="green" hook="audit-matched" />
        <Kpi value="0" label="Diferencias" tone="red" hook="audit-diff" />
      </div>
      <div className={styles.columns} data-film="audit-grid">
        {storyAudit.map((col) => (
          <div key={col.commission} className={styles.column}>
            <div className={styles.columnHead}>
              <span className={styles.strong}>{col.commission}</span>
              <span className={styles.muted}>{col.count} alumnos</span>
            </div>
            {col.rows.map((row) => (
              <div key={row.name} className={styles.auditRow} data-film="audit-row" data-flagged={row.flag ? '' : undefined}>
                <span className={styles.auditName}>{row.name}</span>
                <span className={styles.pillStack}>
                  {row.flag && (
                    <span data-film="audit-flag">
                      <Pill tone={row.flag.tone}>{row.flag.label}</Pill>
                    </span>
                  )}
                  <span data-film="audit-ok">
                    <Pill tone="green">Coincide</Pill>
                  </span>
                </span>
              </div>
            ))}
          </div>
        ))}
        <span className={styles.scan} data-film="audit-scan" />
      </div>
    </Window>
  )
}

/** Campaign assignment: commissions get ticked, then the campaign is sent */
export function AssignCard({ className, style }: { className?: string; style?: CSSProperties }) {
  const a = storyAssign
  return (
    <div className={cx(styles.assign, className)} style={style}>
      <span className={styles.h}>{a.title}</span>
      <span className={styles.template}>
        <span className={styles.waDot} />
        {a.template}
      </span>
      <span className={styles.label}>Comisiones</span>
      <span className={styles.chips}>
        {a.commissions.map((c) => (
          <span key={c} className={styles.chip}>
            <span className={styles.chipOn} data-film="assign-on">
              ✓ {c}
            </span>
            {c}
          </span>
        ))}
      </span>
      <span className={styles.row}>
        <span className={styles.muted}>
          <b data-film="assign-audience">0</b> {a.audienceLabel}
        </span>
        <span className={styles.button} data-film="assign-send">
          {a.button}
        </span>
      </span>
    </div>
  )
}

/** One WhatsApp message on its way to a student: the notification banner the phone shows */
export function MessageCard({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const m = storyMessages[index % storyMessages.length]
  return (
    <div className={cx(styles.banner, className)} style={style}>
      <WaAppIcon />
      <span className={styles.bannerText}>
        <span className={styles.bannerTop}>
          <b>{camChat.contact}</b>
          <span>agora</span>
        </span>
        <span className={styles.bannerBody}>
          {m.title}: {m.text}
        </span>
      </span>
    </div>
  )
}

/** A student's phone in the campaign ring: the institute's chat and the template message that lands */
export function RingPhone({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const s = storySignups[(index * 3) % storySignups.length]
  const m = storyMessages[index % storyMessages.length]
  return (
    <Phone className={cx(styles.ringPhone, className)} style={style}>
      <WaChat header={<WaHeader name={camChat.contact} status={camChat.status} verified />}>
        <WaDay label={camChat.day} />
        <span className={styles.ringGroup}>
          <WaBubble tail time="09:41" hook="ring-bubble">
            <b>{m.title}</b>
            <span>
              Olá, {s.name.split(' ')[0]}! {m.text}
            </span>
          </WaBubble>
          <WaButtons labels={storyReplies} />
        </span>
      </WaChat>
    </Phone>
  )
}

/** A payment arriving, in one of the three currencies */
export function Ticket({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const t = storyTickets[index % storyTickets.length]
  return (
    <div className={cx(styles.ticket, className)} style={style}>
      <span className={styles.muted}>{t.method}</span>
      <span className={styles.ticketAmount}>{t.amount}</span>
    </div>
  )
}

/** The receipt that flies from the payment screen to the student's WhatsApp */
export function ReceiptCard({ className, style }: { className?: string; style?: CSSProperties }) {
  const r = storyReceipt
  return (
    <div className={cx(styles.receipt, className)} style={style}>
      <CamLogo />
      <span className={styles.muted}>{r.title}</span>
      <span className={styles.strong}>{r.number}</span>
      <span className={styles.ticketAmount}>{r.amount}</span>
      <span className={styles.receiptVia}>
        <span className={styles.waDot} />
        {r.via}
      </span>
    </div>
  )
}

/** Report: errors and kinds of issue, bars grow and counts tick */
export function IncidentsScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  const max = Math.max(...storyIncidents.rows.map((r) => r.value))
  return (
    <Window active="WhatsApp" className={className} style={style}>
      <h4 className={styles.h}>{storyIncidents.title}</h4>
      <div className={styles.kpis3}>
        {storyIncidents.kpis.map((k) => (
          <Kpi key={k.label} value={String(k.value)} label={k.label} tone={k.tone} hook="incident-kpi" />
        ))}
      </div>
      <div className={styles.card}>
        {storyIncidents.rows.map((r) => (
          <div key={r.label} className={styles.incident}>
            <span className={styles.incidentLabel}>{r.label}</span>
            <span className={styles.incidentTrack}>
              <span
                className={cx(styles.incidentBar, styles[r.tone])}
                data-film="incident-bar"
                data-scale={r.value / max}
                style={{ transform: `scaleX(${r.value / max})` }}
              />
            </span>
            <span className={styles.incidentValue} data-film="incident-value" data-value={r.value}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </Window>
  )
}

/** Problem: Moodle's own admin form, one account at a time */
export function MoodleForm({ className, style }: { className?: string; style?: CSSProperties }) {
  const m = storyMoodleForm
  return (
    <div className={cx(styles.moodle, className)} style={style}>
      <span className={styles.moodleBar}>{m.title}</span>
      <div className={styles.moodleBody}>
        {m.fields.map((f) => (
          <span key={f.label} className={styles.moodleField}>
            <span className={styles.label}>{f.label}</span>
            <span className={styles.moodleInput} data-film="moodle-field" data-value={f.value}>
              {f.value}
            </span>
          </span>
        ))}
        <span className={styles.row}>
          <span className={styles.muted}>
            {m.counter}: <b data-film="moodle-count">0</b> / {fmt(storyHookTarget)}
          </span>
          <span className={styles.moodleButton} data-film="moodle-submit">
            {m.button}
          </span>
        </span>
      </div>
    </div>
  )
}

/** Problem: a payment noted on a paper slip */
export function PaperSlip({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const p = storyPaper[index % storyPaper.length]
  return (
    <div className={cx(styles.paper, className)} style={style}>
      <span className={styles.paperAmount}>{p.amount}</span>
      <span className={styles.paperNote}>{p.note}</span>
    </div>
  )
}

/** Problem: one more copy of the list, edited by nobody knows whom */
export function VersionCard({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const v = storyVersions[index % storyVersions.length]
  return (
    <div className={cx(styles.version, className)} style={style}>
      <span className={styles.versionIcon}>X</span>
      <span className={styles.recordText}>
        <span className={styles.strong}>{v.file}</span>
        <span className={styles.muted}>alumnos · {fmt(2900 + index * 61)} filas</span>
      </span>
      <span className={styles.versionWho} data-film="version-who">
        {v.edited}
      </span>
    </div>
  )
}
