/**
 * Invented data for the Instituto CAM mockups. Nothing here comes from the real system: names,
 * documents, phones, universities and figures are made up so the screens read like the product
 * without exposing any student. Screen labels follow the panel (Spanish) and the student-facing
 * messages follow the product (Portuguese), so they are not translated with the site.
 */

export const camNav = ['Alumnos', 'Datos', 'Moodle', 'WhatsApp', 'Pagos', 'Administración'] as const
export type CamTab = (typeof camNav)[number]

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'muted'

export interface CamStudent {
  name: string
  university: string
  commission: string
  check: { label: string; tone: Tone }
  moodle: { label: string; tone: Tone }
}

export const camStudents: CamStudent[] = [
  { name: 'Ana Beatriz Moura', university: 'UNP', commission: '2A-1', check: { label: 'Coincide', tone: 'green' }, moodle: { label: 'Alta', tone: 'green' } },
  { name: 'Bruno Teixeira Lopes', university: 'UCE', commission: '2B-2', check: { label: 'Coincide', tone: 'green' }, moodle: { label: 'Alta', tone: 'green' } },
  { name: 'Camila Duarte Reis', university: 'UNP', commission: '3C-1', check: { label: 'Pendiente', tone: 'amber' }, moodle: { label: '—', tone: 'muted' } },
  { name: 'Diego Fontes Araújo', university: 'USA', commission: '2A-2', check: { label: 'Coincide', tone: 'green' }, moodle: { label: 'Alta', tone: 'green' } },
  { name: 'Eduarda Pires Nogueira', university: 'UCE', commission: '4B-1', check: { label: 'Duplicado', tone: 'red' }, moodle: { label: '—', tone: 'muted' } },
  { name: 'Felipe Andrade Cruz', university: 'UNP', commission: '3A-3', check: { label: 'Coincide', tone: 'green' }, moodle: { label: 'Alta', tone: 'green' } },
  { name: 'Gabriela Viana Melo', university: 'USA', commission: '2C-1', check: { label: 'Coincide', tone: 'green' }, moodle: { label: 'Alta', tone: 'green' } },
]

export const camStudentKpis = [
  { value: '3.126', label: 'Total registrados' },
  { value: '84', label: 'Registrados hoy' },
  { value: '2.988', label: 'Cotejados', tone: 'green' as Tone },
  { value: '138', label: 'Pendientes', tone: 'amber' as Tone },
]

export const camCampaign = {
  name: '2A-1 · Credenciales → Zoom',
  messages: ['Credenciales de Moodle', 'Acceso a clase por Zoom'],
  total: 2000,
  sent: 1948,
  delivered: 1903,
  read: 1187,
  failed: 7,
}

/** Messages per commission for the report's bar chart (share of the tallest bar) */
export const camReportBars = [
  { commission: '2A-1', value: 0.92 },
  { commission: '2A-2', value: 0.78 },
  { commission: '2B-1', value: 1 },
  { commission: '2B-2', value: 0.84 },
  { commission: '3A-1', value: 0.66 },
  { commission: '3A-2', value: 0.88 },
  { commission: '3B-1', value: 0.72 },
  { commission: '4A-1', value: 0.95 },
]

export const camReportKpis = [
  { value: '3.126', label: 'Alumnos' },
  { value: '2.954', label: 'Enviados' },
  { value: '96%', label: 'Entregados', tone: 'green' as Tone },
  { value: '12', label: 'Fallidos', tone: 'red' as Tone },
]

export const camPayment = {
  student: 'Camila Duarte Reis',
  concept: 'Certificación CAM ELE',
  amount: 'Gs. 650.000',
  received: [
    { method: 'PIX', amount: 'R$ 300' },
    { method: 'Efectivo', amount: 'Gs. 220.000' },
  ],
  cashier: 'Lucía Benítez',
  owed: 'Gs. 0',
  receipt: 'Recibo N° 100482',
}

export const camSignup = {
  title: 'Complete seus dados',
  hint: 'Leva menos de 2 minutos.',
  fields: [
    { label: 'Universidade', value: 'UNP' },
    { label: 'Nome', value: 'Camila' },
    { label: 'Sobrenome', value: 'Duarte Reis' },
    { label: 'Documento (CPF)', value: '412.•••.•••-27' },
    { label: 'Curso', value: 'Medicina · 2º semestre' },
  ],
  phone: { prefix: '+55', flag: 'BR', value: '11 98•••-4410' },
  submit: 'Enviar cadastro',
}

/** A WhatsApp message the student receives from the institute (invented values) */
export interface CamChatMessage {
  time: string
  /** Template message: bold header, body, footer and quick-reply buttons under the bubble */
  header?: string
  body: string
  footer?: string
  buttons?: string[]
  /** Link with its preview card */
  link?: { url: string; title: string; site: string }
  /** Attached document (the payment receipt) */
  file?: { name: string; meta: string }
}

/** The student's WhatsApp chat with the institute, as WhatsApp (Android, light) shows it */
export const camChat = {
  contact: 'Instituto CAM',
  status: 'Conta comercial',
  day: 'HOJE',
  composer: 'Mensagem',
  messages: [
    {
      time: '09:41',
      header: 'Acesso ao campus virtual',
      body: 'Olá, Camila! Seu usuário do Moodle é camila.reis. A senha foi enviada só para você.',
      footer: 'Instituto CAM · mensagem automática',
      buttons: ['Confirmar presença', 'Preciso de ajuda'],
    },
    {
      time: '09:42',
      body: 'Sua aula de quarta é às 15:30 pelo Zoom.',
      link: { url: 'zoom.us/j/•••••••', title: 'Aula 2A-1 · Zoom', site: 'zoom.us' },
    },
    {
      time: '17:06',
      body: 'Recebemos seu pagamento de Gs. 650.000.',
      file: { name: 'Recibo_100482.pdf', meta: '1 página · PDF' },
    },
  ] as CamChatMessage[],
}

/** The spreadsheet the team used before: rows typed by hand (problem scene) */
export const camSheet = {
  title: 'alumnos_2026_FINAL_v3.xlsx',
  columns: ['Nombre', 'Teléfono', 'Universidad', 'Comisión', 'Moodle'],
  rows: [
    ['Ana B. Moura', '11 9•••-2231', 'UNP', '2A-1', '¿?'],
    ['Bruno T. Lopes', '(sin dato)', 'UCE', '2B-2', 'pendiente'],
    ['Camila D. Reis', '11 9•••-4410', 'UNP', '', ''],
    ['Diego F. Araújo', '21 9•••-0918', 'USA', '2A-2', 'cargado'],
    ['Eduarda P. Nogueira', '11 9•••-7745', 'UCE', '4B-1', ''],
    ['Eduarda Nogueira', '11 9•••-7745', 'UCE', '4B-1', '¿?'],
    ['Felipe A. Cruz', '', 'UNP', '3A-3', 'pendiente'],
  ],
}
