import type { Tone } from '../camData'

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

/** Problem: payments noted on paper, in three currencies */
export const storyPaper = [
  { amount: 'Gs. 220.000', note: 'Bruno · cuota 2' },
  { amount: 'R$ 300', note: 'Camila ¿PIX?' },
  { amount: 'US$ 40', note: 'Diego · efectivo' },
  { amount: 'Gs. 650.000', note: '¿Eduarda?' },
  { amount: 'R$ 180', note: 'Felipe' },
  { amount: 'US$ 95', note: 'Ana · falta' },
]

/** Problem: the same list in many copies, and nobody knows who changed what */
export const storyVersions = [
  { file: 'alumnos_2026.xlsx', edited: '¿?' },
  { file: 'alumnos_2026_FINAL.xlsx', edited: '¿?' },
  { file: 'alumnos_FINAL_v2.xlsx', edited: '¿?' },
  { file: 'alumnos_FINAL_v3 (1).xlsx', edited: '¿?' },
]
