import { camSheet, type Tone } from '../camData'

/**
 * Invented data for the story film (S7): names, figures and messages are made up so the scenes read
 * like the product without exposing any student. Panel labels follow the product (Spanish) and the
 * student-facing messages follow WhatsApp as the students get it (Portuguese), like camData.
 */

/** Signups arriving: the small record cards that fly into the students panel */
export const storySignups = [
  { name: 'Larissa Campos', course: 'Medicina' },
  { name: 'Mateus Rocha', course: 'Odontologia' },
  { name: 'Júlia Barreto', course: 'Medicina' },
  { name: 'Rafael Moreira', course: 'Fisioterapia' },
  { name: 'Beatriz Cunha', course: 'Medicina' },
  { name: 'Thiago Prado', course: 'Enfermagem' },
  { name: 'Isabela Farias', course: 'Medicina' },
  { name: 'Lucas Brandão', course: 'Odontologia' },
  { name: 'Manuela Pinto', course: 'Medicina' },
  { name: 'Gustavo Leal', course: 'Nutrição' },
  { name: 'Letícia Rangel', course: 'Medicina' },
  { name: 'Pedro Siqueira', course: 'Fisioterapia' },
  { name: 'Sofia Vilela', course: 'Medicina' },
  { name: 'Enzo Carvalho', course: 'Enfermagem' },
] as const

export const storyUniversities = ['UNP', 'UCE', 'USA'] as const

export interface AuditRow {
  name: string
  /** What the cross-check found first; `null` = it matched straight away */
  flag: { label: string; tone: Tone } | null
}

/** Cross-check: every student, commission by commission; flagged rows end up matching */
export const storyAudit: { commission: string; count: number; rows: AuditRow[] }[] = [
  {
    commission: '2A-1',
    count: 48,
    rows: [
      { name: 'Ana Beatriz Moura', flag: null },
      { name: 'Larissa Campos', flag: { label: 'Duplicado', tone: 'red' } },
      { name: 'Diego Fontes Araújo', flag: null },
      { name: 'Mateus Rocha', flag: null },
    ],
  },
  {
    commission: '2B-2',
    count: 41,
    rows: [
      { name: 'Bruno Teixeira Lopes', flag: null },
      { name: 'Júlia Barreto', flag: null },
      { name: 'Rafael Moreira', flag: { label: 'Otra comisión', tone: 'amber' } },
      { name: 'Beatriz Cunha', flag: null },
    ],
  },
  {
    commission: '3C-1',
    count: 37,
    rows: [
      { name: 'Camila Duarte Reis', flag: { label: 'Sin Moodle', tone: 'amber' } },
      { name: 'Thiago Prado', flag: null },
      { name: 'Isabela Farias', flag: null },
      { name: 'Lucas Brandão', flag: null },
    ],
  },
  {
    commission: '4B-1',
    count: 44,
    rows: [
      { name: 'Eduarda Pires Nogueira', flag: { label: 'Duplicado', tone: 'red' } },
      { name: 'Manuela Pinto', flag: null },
      { name: 'Gustavo Leal', flag: null },
      { name: 'Felipe Andrade Cruz', flag: null },
    ],
  },
]

export const storyAuditTotals = { records: 3126, matched: 3126 }

/** Campaign assignment: the commissions picked and the message sequence */
export const storyAssign = {
  title: 'Asignar campaña',
  template: 'Credenciales de Moodle + clase por Zoom',
  commissions: ['2A-1', '2A-2', '2B-1', '2B-2', '3A-1', '3C-1'],
  audience: 2000,
  audienceLabel: 'alumnos',
  button: 'Enviar campaña',
}

/** What each student gets on WhatsApp (burst of messages) */
export const storyMessages = [
  { title: 'Moodle', text: 'Seu acesso: usuário e senha do campus virtual' },
  { title: 'Zoom', text: 'Aula de quarta às 15:30 · link da sala' },
  { title: 'Moodle', text: 'Você foi matriculado na comissão 2A-1' },
  { title: 'Zoom', text: 'Prova parcial: sexta às 09:00' },
]

/** Links the campaign sends (invented, reserved .example domain) and the preview cards WhatsApp draws for them */
export const storyLinks = {
  moodle: { url: 'https://campus.cam-edu.example/login', title: 'Campus virtual · Instituto CAM', site: 'campus.cam-edu.example' },
  zoom: { url: 'https://zoom.cam-edu.example/j/2a1-1530', title: 'Reunión de Zoom · 2A-1 · quarta 15:30', site: 'zoom.cam-edu.example' },
}

/** Campaign step 1: the approved Meta templates, two picked in order, one previewed with its variables mapped */
export const storyTemplates = {
  title: 'Plantillas de WhatsApp',
  hint: 'Aprobadas por Meta · se envían en orden',
  list: [
    { name: 'credenciales_moodle_pt', label: 'Credenciales de Moodle', meta: 'Utilidad · pt_BR', state: 'Aprobada', pick: 1 },
    { name: 'acceso_zoom_pt', label: 'Acceso a clase por Zoom', meta: 'Utilidad · pt_BR', state: 'Aprobada', pick: 2 },
    { name: 'horario_examen_pt', label: 'Horario de examen', meta: 'Utilidad · pt_BR', state: 'Aprobada', pick: 0 },
    { name: 'recordatorio_asistencia_b1', label: 'Recordatorio de asistencia', meta: 'Marketing · pt_BR', state: 'En revisión', pick: 0 },
  ],
  sequence: 'Secuencia',
  preview: {
    title: 'Vista previa',
    header: 'Acesso ao campus virtual',
    body: ['Olá, ', '{{1}}', '! Seu usuário do Moodle é ', '{{2}}', '. Entre no campus: ', '{{3}}'],
    footer: 'Instituto CAM · mensagem automática',
    buttons: ['Abrir campus', 'Preciso de ajuda'],
  },
  mappingTitle: 'Variables → columnas',
  mapping: [
    { v: '{{1}}', to: 'Nombre' },
    { v: '{{2}}', to: 'Usuario' },
    { v: '{{3}}', to: storyLinks.moodle.url },
  ],
}

/** Quick replies under the campaign's template message */
export const storyReplies = ['Confirmar presença', 'Preciso de ajuda']

/** Payments arriving, in the three currencies */
export const storyTickets = [
  { method: 'PIX', amount: 'R$ 300' },
  { method: 'Efectivo', amount: 'Gs. 220.000' },
  { method: 'Transferencia', amount: 'US$ 40' },
  { method: 'PIX', amount: 'R$ 180' },
  { method: 'Efectivo', amount: 'Gs. 650.000' },
  { method: 'Tarjeta', amount: 'US$ 95' },
]

export const storyReceipt = {
  title: 'Comprobante',
  number: 'Recibo N° 100482',
  amount: 'Gs. 650.000',
  via: 'Enviado por WhatsApp',
}

/** Report: the different kinds of issue a campaign and the operation run into */
export const storyIncidents = {
  title: 'Incidencias',
  kpis: [
    { value: 12, label: 'Fallidos', tone: 'red' as Tone },
    { value: 9, label: 'Reenviados', tone: 'blue' as Tone },
    { value: 21, label: 'Pagos pendientes', tone: 'amber' as Tone },
  ],
  rows: [
    { label: 'Número sin WhatsApp', value: 5, tone: 'red' as Tone },
    { label: 'Número inválido', value: 4, tone: 'red' as Tone },
    { label: 'Mensaje no entregado', value: 3, tone: 'amber' as Tone },
    { label: 'Diferencia con Moodle', value: 6, tone: 'amber' as Tone },
    { label: 'Pago pendiente', value: 21, tone: 'blue' as Tone },
  ],
}

/** Problem hook: the operator's count, one message at a time, against the user's "más de 3.000" */
export const storyHookTarget = 3000

/** Problem: the campus accounts, created by hand one by one in Moodle's own admin form */
export const storyMoodleForm = {
  title: 'Moodle · Agregar usuario',
  fields: [
    { label: 'Nombre de usuario', value: 'camila.reis' },
    { label: 'Nombre', value: 'Camila' },
    { label: 'Apellido', value: 'Duarte Reis' },
    { label: 'Correo', value: 'camila.reis@•••••.com' },
    { label: 'Curso', value: 'Medicina · 2A-1' },
  ],
  button: 'Crear usuario',
  counter: 'Usuarios creados',
}

/*
 * Problem: the tools the team used, as Excel-like windows (invented data, the product's own Spanish).
 * Rows are the sheet's rows from 2 on (row 1 is the header); a cell can carry a tone the window draws.
 */
export type XlTone = 'dup' | 'err' | 'total' | 'missing' | 'diff'
export interface XlCell {
  v: string
  tone?: XlTone
}
export interface XlSheet {
  file: string
  nameBox: string
  formula: string
  header: string[]
  /** grid-template-columns of the data columns (em of the window) */
  widths: string
  rows: (string | XlCell)[][]
  /** Selected cell: [row index in rows, column index] */
  selected?: [number, number]
  /** Note bubble on the selected cell */
  note?: string
  sheets?: string[]
  status?: string
}

/** a · the list typed by hand: duplicates and phones with no format */
export const storyListSheet: XlSheet = {
  file: camSheet.title,
  nameBox: 'B3',
  formula: '(sin dato)',
  header: camSheet.columns,
  widths: '10.5em 8.5em 7em 6em 6.5em',
  rows: camSheet.rows,
  selected: [1, 1],
  sheets: ['Alumnos', 'Alumnos (2)', 'Hoja1'],
}

/** d · the payments: three currencies added up as plain numbers, a missing currency, a duplicate, a broken cell */
export const storyCashSheet: XlSheet = {
  file: 'Caja_cobros_FINAL.xlsx',
  nameBox: 'E10',
  formula: '=SUMA(E2:E9)',
  header: ['Fecha', 'Alumno', 'Concepto', 'Moneda', 'Importe', 'Cajera'],
  widths: '5em 7.5em 7em 5em 6.5em 5.5em',
  rows: [
    ['03/03', 'Bruno T.', 'Cuota 2', 'Gs', '220.000', 'Lucía'],
    ['03/03', 'Camila D.', 'Matrícula', 'R$', '300', 'Lucía'],
    ['04/03', 'Diego F.', 'Cuota 2', { v: '', tone: 'missing' }, '40', 'Marta'],
    [
      { v: '04/03', tone: 'dup' },
      { v: 'Eduarda P.', tone: 'dup' },
      { v: 'Certificado', tone: 'dup' },
      { v: 'Gs', tone: 'dup' },
      { v: '650.000', tone: 'dup' },
      { v: 'Marta', tone: 'dup' },
    ],
    [
      { v: '04/03', tone: 'dup' },
      { v: 'Eduarda P.', tone: 'dup' },
      { v: 'Certificado', tone: 'dup' },
      { v: 'Gs', tone: 'dup' },
      { v: '650.000', tone: 'dup' },
      { v: 'Marta', tone: 'dup' },
    ],
    ['05/03', 'Felipe A.', 'Cuota 3', 'R$', '180', 'Lucía'],
    ['05/03', 'Ana B.', 'Cuota 1', 'US$', '95', 'Marta'],
    ['06/03', 'Gabriela V.', 'Cuota 2', 'Gs', '220.000', 'Lucía'],
    ['', '', '', 'TOTAL', { v: '1.740.615', tone: 'total' }, ''],
    ['', '', '', 'En Gs.', { v: '#¡VALOR!', tone: 'err' }, ''],
  ],
  selected: [8, 4],
  note: '¿? no cuadra: Gs + US$ + R$',
  sheets: ['Marzo', 'Abril', 'Copia de Abril'],
}

/** d · the calculator: the operator adds the total again by hand (expression line, result line) */
export const storyCalcSteps = [
  { expr: '', result: '220.000', keys: ['2', '0'] },
  { expr: '220.000 +', result: '220.000', keys: ['+'] },
  { expr: '220.000 +', result: '650.000', keys: ['6', '5', '0'] },
  { expr: '220.000 + 650.000 +', result: '870.000', keys: ['+'] },
  { expr: '220.000 + 650.000 +', result: '300', keys: ['3', '0'] },
  { expr: '220.000 + 650.000 + 300 =', result: '870.300', keys: ['='] },
]

/** e · three copies of the list, tiled like Excel's "Organizar todo": the same cell holds three values */
export const storyVersionHeader = ['Nombre', 'Teléfono', 'Comisión']
export const storyVersionRow = ['Camila D. Reis', '11 9•••-4410']
export const storyWho = { status: 'Última modificación: ¿?', note: '¿quién lo cambió?', author: 'Nota' }
export const storyVersions = [
  { file: 'alumnos_FINAL.xlsx', value: '3C-1' },
  { file: 'alumnos_FINAL_v2.xlsx', value: '2A-1' },
  { file: 'alumnos_FINAL_v2 (1).xlsx', value: '3C-2' },
]
