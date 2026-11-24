import type { CSSProperties, ReactNode } from 'react'
import { CamLogo, Kpi, Phone, Pill, WaAppIcon, WaBubble, WaButtons, WaChat, WaDay, WaHeader, Window } from '../CamUi'
import { camChat } from '../camData'
import {
  storyAssign,
  storyHookTarget,
  storyMoodleForm,
  storyVersionHeader,
  storyVersionRow,
  storyVersions,
  storyWho,
  type XlCell,
  type XlSheet,
  storyAudit,
  storyAuditTotals,
  storyIncidents,
  storyLinks,
  storyMessages,
  storyTemplates,
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
  const link = index % 2 ? storyLinks.zoom : storyLinks.moodle
  return (
    <div className={cx(styles.banner, className)} style={style}>
      <WaAppIcon />
      <span className={styles.bannerText}>
        <span className={styles.bannerTop}>
          <b>{camChat.contact}</b>
          <span>agora</span>
        </span>
        <span className={styles.bannerBody}>
          {m.title}: {link.site}
        </span>
      </span>
    </div>
  )
}

/** A link inside a received message: the preview card, then the blue URL */
function LinkMessage({ link, children }: { link: { url: string; title: string; site: string }; children: ReactNode }) {
  return (
    <>
      <span className={styles.linkCard}>
        <span className={styles.linkThumb}>
          <CamLogo light />
        </span>
        <span className={styles.linkText}>
          <b>{link.title}</b>
          <span>{link.site}</span>
        </span>
      </span>
      <span>{children}</span>
      <span className={styles.linkUrl}>{link.url}</span>
    </>
  )
}

/** A student's phone in the campaign ring: the institute's two messages, with the Moodle and Zoom links */
export function RingPhone({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const s = storySignups[(index * 3) % storySignups.length]
  return (
    <Phone className={cx(styles.ringPhone, className)} style={style}>
      <WaChat header={<WaHeader name={camChat.contact} status={camChat.status} verified />}>
        <WaDay label={camChat.day} />
        <span className={styles.ringGroup}>
          <WaBubble tail time="09:41" hook="ring-bubble">
            <LinkMessage link={storyLinks.moodle}>Olá, {s.name.split(' ')[0]}! Seu acesso ao campus virtual:</LinkMessage>
          </WaBubble>
        </span>
        <span className={styles.ringGroup} data-cam="ring-bubble-2">
          <WaBubble time="09:41">
            <LinkMessage link={storyLinks.zoom}>Sua aula de quarta é às 15:30:</LinkMessage>
          </WaBubble>
          <WaButtons labels={storyReplies} />
        </span>
      </WaChat>
    </Phone>
  )
}

/** Campaign step 1: choose the approved templates in order, preview one with its variables mapped to columns */
export function TemplatesScreen({ className, style }: { className?: string; style?: CSSProperties }) {
  const t = storyTemplates
  const picked = t.list.filter((x) => x.pick).sort((a, b) => a.pick - b.pick)
  return (
    <Window active="WhatsApp" className={className} style={style}>
      <div className={styles.row}>
        <h4 className={styles.h}>{t.title}</h4>
        <span className={styles.muted}>{t.hint}</span>
      </div>
      <div className={styles.tplSplit}>
        <div className={styles.card}>
          {t.list.map((x) => (
            <span key={x.name} className={styles.tplRow} data-film={x.pick ? 'tpl-row' : undefined} data-pick={x.pick || undefined}>
              <span className={styles.tplBadge} data-film={x.pick ? 'tpl-badge' : undefined}>
                {x.pick || ''}
              </span>
              <span className={styles.tplName}>
                <b>{x.name}</b>
                <span className={styles.muted}>
                  {x.label} · {x.meta}
                </span>
              </span>
              <Pill tone={x.state === 'Aprobada' ? 'green' : 'amber'}>{x.state}</Pill>
            </span>
          ))}
          <span className={styles.tplSequence}>
            <span className={styles.label}>{t.sequence}</span>
            {picked.map((x, i) => (
              <span key={x.name} className={styles.tplStep} data-film="tpl-step">
                {i > 0 && <span className={styles.tplArrow}>→</span>}
                <span className={styles.tplStepIndex}>{x.pick}</span>
                {x.label}
              </span>
            ))}
          </span>
        </div>
        <div className={styles.tplSide}>
          <span className={styles.label}>{t.preview.title}</span>
          <span className={styles.tplPreview} data-film="tpl-preview">
            <span className={styles.tplBubble}>
              <b>{t.preview.header}</b>
              <span>
                {t.preview.body.map((part, i) =>
                  part.startsWith('{{') ? (
                    <span key={i} className={styles.tplVar}>
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </span>
              <span className={styles.tplFooter}>{t.preview.footer}</span>
            </span>
            {t.preview.buttons.map((b) => (
              <span key={b} className={styles.tplButton}>
                {b}
              </span>
            ))}
          </span>
          <span className={styles.tplMapping} data-film="tpl-mapping">
            <span className={styles.label}>{t.mappingTitle}</span>
            {t.mapping.map((m) => (
              <span key={m.v} className={styles.tplMap} data-film="tpl-map">
                <span className={styles.tplVar}>{m.v}</span>
                <span className={styles.tplArrow}>→</span>
                <span className={m.to.startsWith('http') ? styles.linkUrl : styles.strong}>{m.to}</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </Window>
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

/* ---- Problem: the desktop tools the team used, drawn in code (generic look, no vendor logos) ---- */

const XL_TABS = ['Archivo', 'Inicio', 'Insertar', 'Disposición', 'Fórmulas', 'Datos', 'Revisar', 'Vista']
const XL_LETTERS = 'ABCDEFGH'

/** Window controls of a Windows 11 title bar: minimise, maximise, close */
function WinControls() {
  return (
    <span className={styles.winControls} aria-hidden="true">
      <svg viewBox="0 0 10 10">
        <path d="M1 5h8" />
      </svg>
      <svg viewBox="0 0 10 10">
        <rect x="1.5" y="1.5" width="7" height="7" rx="1" />
      </svg>
      <svg viewBox="0 0 10 10">
        <path d="m1.5 1.5 7 7m0-7-7 7" />
      </svg>
    </span>
  )
}

/** A generic spreadsheet app icon: a green square with a white grid */
function XlIcon() {
  return (
    <svg viewBox="0 0 16 16" className={styles.xlIcon} aria-hidden="true">
      <rect x="0.5" y="0.5" width="15" height="15" rx="3" />
      <path d="M4 5h8M4 8h8M4 11h8M8 4v8" />
    </svg>
  )
}

const cell = (c: string | XlCell): XlCell => (typeof c === 'string' ? { v: c } : c)

/**
 * An Excel-like window (Windows 11): green title bar with the file and the window controls, a thin
 * ribbon, the formula bar (name box, fx), lettered columns and numbered rows, a selected cell with
 * its green border, an optional note bubble, sheet tabs or a status bar. Rows carry `data-film="xl-row"`.
 */
export function ExcelWindow({
  sheet,
  compact,
  className,
  style,
}: {
  sheet: XlSheet
  /** Tiled copy: no ribbon, no sheet tabs */
  compact?: boolean
  className?: string
  style?: CSSProperties
}) {
  const grid = { gridTemplateColumns: `2.2em ${sheet.widths}` } as CSSProperties
  return (
    <div className={cx(styles.xl, className)} style={style}>
      <span className={styles.xlTitle}>
        <XlIcon />
        <span className={styles.xlFile}>{sheet.file}</span>
        <WinControls />
      </span>
      {!compact && (
        <span className={styles.xlRibbon}>
          <span className={styles.xlTabs}>
            {XL_TABS.map((tab) => (
              <span key={tab} className={tab === 'Inicio' ? styles.xlTabOn : undefined}>
                {tab}
              </span>
            ))}
          </span>
          <span className={styles.xlTools} aria-hidden="true">
            <span className={styles.xlToolGroup}>
              <b>N</b>
              <i>K</i>
              <u>S</u>
            </span>
            <span className={styles.xlToolGroup}>
              <span className={styles.xlSwatch} />
              <span className={styles.xlLines} />
              <span className={styles.xlLines} />
            </span>
            <span className={styles.xlToolGroup}>
              <span>Σ</span>
              <span>%</span>
              <span>,00</span>
            </span>
          </span>
        </span>
      )}
      <span className={styles.xlFormula}>
        <span className={styles.xlNameBox}>{sheet.nameBox}</span>
        <i className={styles.xlFx}>fx</i>
        <span className={styles.xlFormulaText} data-film="xl-formula">
          {sheet.formula}
        </span>
      </span>
      <span className={styles.xlGrid}>
        <span className={cx(styles.xlRow, styles.xlLetters)} style={grid}>
          <span />
          {sheet.header.map((_, c) => (
            <span key={c}>{XL_LETTERS[c]}</span>
          ))}
        </span>
        <span className={cx(styles.xlRow, styles.xlHeader)} style={grid}>
          <span className={styles.xlNum}>1</span>
          {sheet.header.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </span>
        {sheet.rows.map((row, r) => (
          <span key={r} className={styles.xlRow} style={grid} data-film="xl-row">
            <span className={styles.xlNum}>{r + 2}</span>
            {row.map((raw, c) => {
              const x = cell(raw)
              const selected = sheet.selected?.[0] === r && sheet.selected?.[1] === c
              return (
                <span
                  key={c}
                  className={cx(x.tone && styles[`xl_${x.tone}`], selected && styles.xlSelected)}
                  data-film={x.tone === 'total' ? 'xl-total' : x.tone === 'diff' ? 'version-cell' : x.tone === 'err' ? 'xl-err' : undefined}
                >
                  {x.v}
                  {selected && sheet.note && (
                    <span className={styles.xlNote} data-film="xl-note">
                      <b>{storyWho.author}</b>
                      {sheet.note}
                    </span>
                  )}
                </span>
              )
            })}
          </span>
        ))}
      </span>
      {sheet.sheets && !compact && (
        <span className={styles.xlSheets}>
          {sheet.sheets.map((name, i) => (
            <span key={name} className={i === 0 ? styles.xlSheetOn : undefined}>
              {name}
            </span>
          ))}
          <span className={styles.xlPlus}>+</span>
        </span>
      )}
      {sheet.status && (
        <span className={styles.xlStatus} data-film="version-who">
          {sheet.status}
        </span>
      )}
    </div>
  )
}

/** e · one tiled copy of the list: the same student, a different commission in each file */
export function ExcelCopy({ index, className, style }: { index: number; className?: string; style?: CSSProperties }) {
  const v = storyVersions[index % storyVersions.length]
  const sheet: XlSheet = {
    file: v.file,
    nameBox: 'C2',
    formula: v.value,
    header: storyVersionHeader,
    widths: '11em 9em 7em',
    rows: [[...storyVersionRow, { v: v.value, tone: 'diff' }]],
    selected: [0, 2],
    status: storyWho.status,
  }
  return <ExcelWindow sheet={sheet} compact className={className} style={style} />
}

/** e · the note asking who changed it, as a spreadsheet note */
export function WhoNote({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={cx(styles.xlNote, styles.xlNoteLoose, className)} style={style}>
      <b>{storyWho.author}</b>
      {storyWho.note}
    </div>
  )
}

const CALC_KEYS = ['%', 'CE', 'C', '⌫', '1/x', 'x²', '²√x', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '+/−', '0', ',', '=']
const CALC_DIGITS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+/−', ','])

/** d · a Windows 11-style calculator: "Estándar", the expression line, the result, the rounded keys */
export function WinCalculator({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={cx(styles.calc, className)} style={style}>
      <span className={styles.calcTitle}>
        <span>Calculadora</span>
        <WinControls />
      </span>
      <span className={styles.calcMode}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 4h12M2 8h12M2 12h12" />
        </svg>
        <b>Estándar</b>
        <svg viewBox="0 0 16 16" className={styles.calcHistory} aria-hidden="true">
          <path d="M8 2.5a5.5 5.5 0 1 1-5.2 3.7M8 5v3.2l2.2 1.4M2.5 2.5v3.5H6" />
        </svg>
      </span>
      <span className={styles.calcExpr} data-film="calc-expr">
        {' '}
      </span>
      <span className={styles.calcResult} data-film="calc-result">
        0
      </span>
      <span className={styles.calcKeys}>
        {CALC_KEYS.map((k) => (
          <span
            key={k}
            className={cx(styles.calcKey, CALC_DIGITS.has(k) && styles.calcDigit, k === '=' && styles.calcEquals)}
            data-key={k}
          >
            {k}
          </span>
        ))}
      </span>
    </div>
  )
}
