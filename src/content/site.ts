/**
 * SITE CONTENT — single source of truth for every section.
 *
 * Copy and case studies come from gotoxy.dev and the @gotoxy.dev Instagram
 * account (reels and posts). Components only consume these objects; nothing is
 * hard-coded in the UI layer. Media lives in /public/assets.
 */

export type Tag = string

export interface NavLink {
  label: string
  href: string
}

export interface Project {
  id: string
  name: string
  tags: Tag[]
  /** mp4/webm path for the full-width looping video */
  video: string
  /** poster shown before the video is ready */
  poster: string
  href: string
  /** Shown as a card on the home (the reference shows four); every case keeps its page and next-link. */
  featured?: boolean
}

export interface Testimonial {
  id: string
  author: string
  role: string
  company: string
  scope: string
  quote: string
}

export interface ClientLogo {
  id: string
  name: string
  src: string
}

export interface AwardEntry {
  title: string
  year: string
}

export interface AwardGroup {
  id: string
  name: string
  /** image shown beside the row while it is hovered (optional) */
  image?: string
  entries: AwardEntry[]
}

export interface Insight {
  id: string
  title: string
  category: string
  image: string
  href: string
}

export interface CaseTableRow {
  label: string
  value: string
}

export interface CasePage {
  /** Small caps label above the heading (GOAL, RESULTS…) */
  label: string
  heading: string
  paragraphs: string[]
}

/** A point on a 390px-wide app screen, in CSS px from its top-left corner. */
export type ScreenPoint = [x: number, y: number]

export interface CaseJourneyStep {
  title: string
  text: string
  /** Still capture of the screen (stacked mobile layout, and the phone when there is no `app`) */
  screen: string
  /** Live HTML of the screen, 390px wide, shown inside the phone and scrolled while the step plays */
  app?: string
  /** Full height of the screen at 390px wide */
  height: number
  /** Buttons the user taps during this step, in order (the last one leads to the next step) */
  taps: ScreenPoint[]
}

export interface CaseJourney {
  /** Eyebrow above each step (e.g. "The order, step by step") */
  label: string
  steps: CaseJourneyStep[]
}

export interface CaseStudy {
  slug: string
  /** Project this case belongs to (`projects[].id`) */
  projectId: string
  title: string
  /** One-line summary used for SEO and structured data */
  summary: string
  table: CaseTableRow[]
  /** Link shown on the first page (app store, live site…) */
  link: { label: string; href: string }
  /** Second and third page copy */
  pages: [CasePage, CasePage]
  /**
   * Optional customer journey, shown between the goal and the results: one section per
   * step, a phone on the left that swaps to that step's screen (390×844 capture).
   */
  journey?: CaseJourney
  /** Visuals of the three left-hand sections */
  media: {
    /** page 1: full-bleed background + device mockup on top */
    background: string
    device?: string
    /** page 2: looping reel */
    video: string
    videoPoster: string
    /** page 3: full-bleed image */
    closing: string
    /** `background` and `closing` are landscape website captures: show them whole, in a browser window */
    screenshot?: boolean
    /** page 3 opens zoomed in (`scale`) on a point of `closing` (`origin`, CSS percentages) and pulls back to the whole view */
    closingZoom?: { scale: number; origin: string }
  }
  /** Slug of the next case study */
  next: string
}

export const brand = {
  name: 'gotoxy',
  /** Short descriptor shown next to the wordmark */
  tagline: 'Software & AI',
  legalName: 'gotoxy',
  domain: 'https://gotoxy.dev',
  description:
    'We design and implement custom software, integrations and AI automation around how your business actually works. We connect what you already use, build what is missing and leave the solution running.',
  shortDescription: 'Custom software, integrations and AI automation. Rosario, Argentina.',
  locality: 'Rosario',
  region: 'Santa Fe',
  country: 'Argentina',
  countryCode: 'AR',
  foundingYear: '2023',
  /** Booking link used by every call to action */
  bookingUrl: 'https://app.cal.com/gotoxy',
  instagram: 'https://www.instagram.com/gotoxy.dev/',
  services: ['Custom software', 'Integrations', 'Automation', 'AI agents'],
  copyright: `${new Date().getFullYear()} GOTOXY. ROSARIO, ARGENTINA. ALL RIGHTS RESERVED`,
}

export const nav: { links: NavLink[]; cta: NavLink } = {
  links: [
    { label: 'Case studies', href: '/#projects' },
    { label: 'How we work', href: '/#process' },
    { label: 'What we do', href: '/#services' },
    { label: 'In numbers', href: '/#numbers' },
  ],
  cta: { label: "Let's talk", href: brand.bookingUrl },
}

export const hero = {
  /** Each line is revealed independently; `align: 'right'` pushes the line to the right edge. */
  lines: [
    { text: 'We connect what', align: 'left' as const },
    { text: 'you use.', align: 'left' as const, trailing: 'We build' },
    { text: 'what’s missing.', align: 'right' as const },
  ],
  caption: ['Software · Integrations · Automation · AI', 'Rosario, Argentina'],
  /** Image sequence drawn on the canvas behind the headline */
  sequence: {
    dir: '/assets/hero-seq',
    ext: 'webp',
    frameCount: 39,
    pad: 3, // frame_001.webp
  },
}

export const projects: Project[] = [
  {
    id: 'japon',
    name: 'Japón in Box',
    tags: ['Hospitality', 'E-commerce', 'Payments'],
    video: '/assets/videos/project-01.webm',
    poster: '/assets/videos/project-01.jpg',
    href: '/projects/japon-in-box',
    featured: true,
  },
  {
    id: 'cam',
    name: 'Instituto CAM',
    tags: ['Education', 'WhatsApp API', 'Automation'],
    video: '/assets/videos/project-02.webm',
    poster: '/assets/videos/project-02.jpg',
    href: '/projects/instituto-cam',
    featured: true,
  },
  {
    id: 'animageneris',
    name: 'Animageneris',
    tags: ['Content operation', 'AI', 'Mobile app'],
    video: '/assets/videos/project-03.webm',
    poster: '/assets/videos/project-03.jpg',
    href: '/projects/animageneris',
  },
  {
    id: 'agents',
    name: 'Tool-enabled AI agents',
    tags: ['Operations', 'AI agents', 'Integrations'],
    video: '/assets/videos/project-04.webm',
    poster: '/assets/videos/project-04.jpg',
    href: '/projects/ai-agents-operations',
    featured: true,
  },
  {
    id: 'inspection',
    name: 'Site inspection reports',
    tags: ['Health & safety', 'Custom software', 'AI'],
    video: '/assets/videos/project-05.webm',
    poster: '/assets/videos/project-05.jpg',
    href: '/projects/site-inspection-reports',
    featured: true,
  },
  {
    id: 'speech',
    name: 'Real-time English correction',
    tags: ['iOS', 'Real-time speech', 'Low-latency AI'],
    video: '/assets/videos/project-06.webm',
    poster: '/assets/videos/project-06.jpg',
    href: '/projects/english-conversation-app',
  },
]

/** "How we work" section: the three stages, as an accordion, plus the stack we connect. */
export const clients = {
  title: ['How we', 'Work'],
  seeMoreLabel: 'Book a call',
  seeMoreHref: brand.bookingUrl,
  seeMoreLogo: '/assets/logos/review-platform.svg',
  readLabel: 'Read',
  closeLabel: 'Close',
  testimonials: [
    {
      id: 'understand',
      author: '01 / Understand',
      role: 'The first conversation',
      company: 'Map the real process',
      scope: 'Tasks · data · decisions /\nexceptions · controls',
      quote:
        'We work with the person doing the task. We map data, decisions, exceptions and controls.\n\nYou do not need to arrive with a defined solution: show us how you work today and where the difficulty appears.',
    },
    {
      id: 'build',
      author: '02 / Build and integrate',
      role: 'Only what the process needs',
      company: 'Connect and build',
      scope: 'Existing tools · APIs /\ncustom software · AI',
      quote:
        'We connect the existing tools and build only what the process needs.\n\nWe use AI during analysis, development and testing to move faster. Architecture, security and critical decisions remain in the hands of our team.',
    },
    {
      id: 'implement',
      author: '03 / Implement',
      role: 'Running with your team',
      company: 'Install and adjust',
      scope: 'Testing with the team /\ndaily-use adjustments · handover',
      quote:
        'We test with the team, adjust around daily use and leave the system installed and running.\n\nEvery project started the same way: someone showed us how they worked. From there, we connected tools, built software and implemented a tailored solution.',
    },
  ] satisfies Testimonial[],
  logos: [
    { id: 'l1', name: 'Japón in Box', src: '/assets/logos/client-japon-in-box.svg' },
    { id: 'l2', name: 'Instituto CAM', src: '/assets/logos/client-instituto-cam.png' },
    { id: 'l3', name: 'Animageneris', src: '/assets/logos/client-animageneris.svg' },
    { id: 'l4', name: 'WhatsApp Business API', src: '/assets/logos/stack-whatsapp.svg' },
    { id: 'l5', name: 'Cloudflare Workers', src: '/assets/logos/stack-cloudflare.svg' },
    { id: 'l6', name: 'Mercado Libre', src: '/assets/logos/stack-mercado-libre.svg' },
    { id: 'l7', name: 'Moodle', src: '/assets/logos/stack-moodle.svg' },
    { id: 'l8', name: 'Mercado Pago', src: '/assets/logos/stack-mercado-pago.svg' },
  ] satisfies ClientLogo[],
}

/** "In numbers" section (reuses the awards layout): one expandable row per project. */
export const awards = {
  intro:
    'Experienced engineers in software, automation and AI. We connect your systems, reduce manual work and leave the solution running with your team. Development accelerated by AI; architecture, security and critical decisions stay with people.',
  moreLabel: ['Every system above is', 'running in production today'],
  groups: [
    {
      id: 'cam',
      name: 'Instituto CAM',
      image: '/assets/cases/instituto-cam/page-1.jpg',
      entries: [
        { title: '2,300+ students registered and cross-checked', year: '2025' },
        { title: '11 days from the signature to the first WhatsApp sent', year: '2025' },
        { title: '100% automated, end to end, available 24/7', year: '2025' },
        { title: '3 weeks, 97 pull requests, 2,000+ automated tests', year: '2025' },
        { title: '14 screens in the institute’s own control panel', year: '2025' },
      ],
    },
    {
      id: 'japon',
      name: 'Japón in Box',
      image: '/assets/cases/japon-in-box/website.webp',
      entries: [
        { title: '3 locations in Rosario and Funes on one platform', year: '2025' },
        { title: '10 weeks from kickoff to production', year: '2025' },
        { title: '0 delivery-app commissions on their own channel', year: '2025' },
      ],
    },
    {
      id: 'animageneris',
      name: 'Animageneris',
      image: '/assets/cases/animageneris/page-1.jpg',
      entries: [
        { title: '20 channels researched, produced and published by one system', year: '2025' },
        { title: '40.4K followers and 2.1M likes on TikTok', year: '2025' },
        { title: 'YouTube and TikTok scheduling and publishing from a phone', year: '2025' },
      ],
    },
    { id: 'agents', name: 'Tool-enabled AI agents', entries: [] },
    { id: 'inspection', name: 'Site inspection reports', entries: [] },
    { id: 'speech', name: 'Real-time English correction', entries: [] },
  ] satisfies AwardGroup[],
}

export const cta = {
  eyebrow: ['Show us how', 'you work today'],
  /** One entry per animated line (the reference reveals five fixed lines). */
  headline: [
    'The first conversation',
    'is to understand the process.',
    'Then we define whether',
    'to integrate, automate',
    'or build.',
  ],
  button: { label: "Let's talk", href: brand.bookingUrl },
}

/** "What we do" section (reuses the insights layout). */
export const insights = {
  title: 'What we do',
  moreLabel: 'Book a call',
  moreHref: brand.bookingUrl,
  items: [
    {
      id: 'integrations',
      title: 'Integrations: connect the tools your team already uses.',
      category: 'Integrations',
      image: '/assets/videos/project-04.jpg',
      href: brand.bookingUrl,
    },
    {
      id: 'software',
      title: 'Custom software built around a specific operation.',
      category: 'Custom software',
      image: '/assets/cases/instituto-cam/page-1.jpg',
      href: brand.bookingUrl,
    },
    {
      id: 'automation',
      title: 'Automation that removes manual work from daily tasks.',
      category: 'Automation',
      image: '/assets/videos/project-01.jpg',
      href: brand.bookingUrl,
    },
    {
      id: 'ai',
      title: 'AI agents connected to your data, rules and permissions, with human approval.',
      category: 'AI agents',
      image: '/assets/cases/ai-agents-operations/page-3.jpg',
      href: brand.bookingUrl,
    },
  ] satisfies Insight[],
}

export const footer = {
  backToTop: 'Back to top',
  socials: [
    { label: 'Instagram', href: brand.instagram },
    { label: 'Book a call', href: brand.bookingUrl },
    { label: 'gotoxy.dev', href: brand.domain },
  ] satisfies NavLink[],
  headline: "Let's talk",
  headlineHref: brand.bookingUrl,
  /** Secondary line under the headline */
  contact: 'Show us how you work today',
  contactHref: brand.bookingUrl,
  copyright: brand.copyright,
}

export const caseMedia = (slug: string, overrides: Partial<CaseStudy['media']> = {}) => ({
  background: `/assets/cases/${slug}/page-1.jpg`,
  device: `/assets/cases/${slug}/device.png`,
  video: `/assets/cases/${slug}/reel.webm`,
  videoPoster: `/assets/cases/${slug}/reel.jpg`,
  closing: `/assets/cases/${slug}/page-3.jpg`,
  ...overrides,
})

/** Case-study pages (`/projects/:slug`). One per project; the order sets the "next project" chain. */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'japon-in-box',
    projectId: 'japon',
    title: 'Their own sales channel, from menu to payment',
    summary:
      'Online ordering platform for Japón in Box: menu, cart, orders and integrated payments for three locations in Rosario and Funes, built end to end in ten weeks.',
    table: [
      { label: 'Client', value: 'Japón in Box · Sushi boutique and signature cuisine, nine years in Rosario · Three locations: Norte, Centro and Funes' },
      { label: 'Involvement', value: 'Product design, end-to-end development, payments, deployment' },
      { label: 'Scope', value: 'Online ordering platform: menu, cart, orders, payments, three locations' },
      {
        label: 'Results',
        value:
          'Customers choose a location, build the order and pay by card without leaving the page, then follow the courier on the map. No delivery-app commissions. Ten weeks, three locations, running in production.',
      },
    ],
    link: { label: 'Visit japoninbox.com', href: 'https://japoninbox.com/' },
    pages: [
      {
        label: 'Goal',
        heading: 'A sales channel of their own, with the restaurant’s identity throughout.',
        paragraphs: [
          'We designed and built Japón in Box’s online ordering platform end to end: menu, shopping cart, orders and integrated payments for its three locations in Rosario and Funes.',
          'From their phone, customers choose a location, put their order together and pay online. We delivered the complete purchasing journey, with the restaurant’s identity throughout and the system running in production.',
        ],
      },
      {
        label: 'Results',
        heading: 'Orders, payments and deliveries in a single panel',
        paragraphs: [
          'The restaurant manages every order from its own panel: payment status, delivery state and courier assignment, with the customer following the delivery on the map.',
          'Card payments happen without leaving the page, and the channel carries no delivery-app commissions. Ten weeks from kickoff to production, three locations on one platform.',
        ],
      },
    ],
    journey: {
      label: 'The order, step by step',
      steps: [
        {
          title: 'Lands on the site',
          text: 'The landing introduces the restaurant and keeps “Place an order” one tap away.',
          screen: '/assets/cases/japon-in-box/screens-mobile/japon-mob-01.jpg',
          height: 845,
          taps: [[327, 43]],
        },
        {
          title: 'Picks a location',
          text: 'Norte, Centro or Funes. The menu on screen is the chosen location’s.',
          screen: '/assets/cases/japon-in-box/journey/02-location.jpg',
          app: '/assets/cases/japon-in-box/journey/app/02-location.html',
          height: 900,
          taps: [[195, 622]],
        },
        {
          title: 'Builds the order',
          text: 'Browses the menu by category and adds boxes to the cart.',
          screen: '/assets/cases/japon-in-box/journey/03-menu.jpg',
          app: '/assets/cases/japon-in-box/journey/app/03-menu.html',
          height: 2400,
          taps: [[182, 1134], [195, 2375]],
        },
        {
          title: 'Pickup or delivery',
          text: 'No account needed. For delivery, the address is checked against the location’s coverage area.',
          screen: '/assets/cases/japon-in-box/journey/04-delivery.jpg',
          app: '/assets/cases/japon-in-box/journey/app/04-delivery.html',
          height: 1900,
          taps: [[195, 1733]],
        },
        {
          title: 'Adds extras',
          text: 'Before finishing, it suggests the extras available at that location.',
          screen: '/assets/cases/japon-in-box/journey/05-extras.jpg',
          app: '/assets/cases/japon-in-box/journey/app/05-extras.html',
          height: 1300,
          taps: [[302, 412], [247, 1076]],
        },
        {
          title: 'Pays',
          text: 'Cash, bank transfer or card. Card details go straight to Payway, without leaving the page.',
          screen: '/assets/cases/japon-in-box/journey/06-payment.jpg',
          app: '/assets/cases/japon-in-box/journey/app/06-payment.html',
          height: 2290,
          taps: [[195, 2123]],
        },
        {
          title: 'Order received',
          text: 'A confirmation with the order details, while the order lands in the restaurant’s panel.',
          screen: '/assets/cases/japon-in-box/journey/07-confirmation.jpg',
          app: '/assets/cases/japon-in-box/journey/app/07-confirmation.html',
          height: 1140,
          taps: [[190, 941]],
        },
        {
          title: 'Follows the courier',
          text: 'Tracks the delivery on the map until it reaches the door.',
          screen: '/assets/cases/japon-in-box/journey/08-tracking.jpg',
          app: '/assets/cases/japon-in-box/journey/app/08-tracking.html',
          height: 955,
          taps: [],
        },
        {
          title: 'Courier at the door',
          text: 'The app lets them know the courier is at the address, with the amount to have ready.',
          screen: '/assets/cases/japon-in-box/journey/09-arrival.jpg',
          app: '/assets/cases/japon-in-box/journey/app/09-arrival.html',
          height: 930,
          taps: [],
        },
        {
          title: 'Order delivered',
          text: 'A notification confirms the delivery and closes the order with a rating.',
          screen: '/assets/cases/japon-in-box/journey/10-delivered.jpg',
          app: '/assets/cases/japon-in-box/journey/app/10-delivered.html',
          height: 790,
          taps: [],
        },
      ],
    },
    media: caseMedia('japon-in-box', {
      background: '/assets/cases/japon-in-box/website.webp',
      device: undefined,
      closing: '/assets/cases/japon-in-box/locations.webp',
      screenshot: true,
      // opens on the Japón Centro card
      closingZoom: { scale: 2.8, origin: '49% 60%' },
    }),
    next: 'instituto-cam',
  },
  {
    slug: 'instituto-cam',
    projectId: 'cam',
    title: 'From the signature to the first WhatsApp in eleven days',
    summary:
      'Student registration and messaging for Instituto CAM: on-site enrolment validated against the university, mail replaced by WhatsApp through Meta’s official API, and a control panel the institute runs on its own.',
    table: [
      { label: 'Client', value: 'Instituto CAM · Education · 15+ years, 100+ programs, campuses in Rosario and Ciudad del Este · 3,000+ students' },
      { label: 'Involvement', value: 'Process mapping, custom software, WhatsApp Business API, Moodle integration' },
      { label: 'Scope', value: 'Registration, document validation, messaging, campaigns, audit, control panel' },
      {
        label: 'Results',
        value:
          '2,300+ students registered and cross-checked, 100% automated, available 24/7. Eleven days from the signature to the first WhatsApp sent; three weeks, 97 pull requests and 2,000+ automated tests for the full panel.',
      },
    ],
    link: { label: 'Visit caminstituto.com', href: 'https://www.caminstituto.com/' },
    pages: [
      {
        label: 'Goal',
        heading: 'From a mail nobody opened to a process that sustains itself.',
        paragraphs: [
          'Instituto CAM needed to register and notify more than 3,000 students before classes started. By mail, the messages never arrived on time.',
          'We built the whole process end to end: on-site registration with document validation and a cross-check against the university’s list, and mail fully replaced by WhatsApp, with the user, password and Zoom link sent through Meta’s official API.',
        ],
      },
      {
        label: 'Results',
        heading: 'Built to carry real volume from day one, not a demo',
        paragraphs: [
          'Infrastructure on Cloudflare Workers and D1, with no servers to maintain and no personal number that can be banned. Automatic cross-checking against the university list, with manual review only for the differences.',
          'Afterwards we extended it into the institute’s own panel, fourteen screens: automatic Moodle enrolment, campaigns, resends, security and audit. The institute controls everything without depending on us.',
        ],
      },
    ],
    media: caseMedia('instituto-cam'),
    next: 'animageneris',
  },
  {
    slug: 'animageneris',
    projectId: 'animageneris',
    title: 'From posting by hand to running twenty channels',
    summary:
      'A content operation for Animageneris: a system that researches, writes, produces and publishes across twenty YouTube and TikTok channels, managed from a phone with the creator’s editorial control.',
    table: [
      { label: 'Client', value: 'Animageneris · Content operation' },
      { label: 'Involvement', value: 'Process mapping, AI pipeline, publishing integrations, mobile app' },
      { label: 'Scope', value: 'Research, scripts, voice, video, captions, scheduling, publishing, metrics' },
      {
        label: 'Results',
        value: 'Twenty channels run by one system. 40.4K followers and 2.1M likes on TikTok. The creator keeps editorial control.',
      },
    ],
    link: { label: 'Book a call', href: brand.bookingUrl },
    pages: [
      {
        label: 'Goal',
        heading: 'Publish more without adding hours of work to every piece.',
        paragraphs: [
          'Animageneris needed to publish more without adding hours of work to every piece. We started with its TikTok channel: we mapped how topics were chosen, written, produced and published, then built a system around that editorial judgment.',
          'The platform researches, prepares scripts, generates voice, video and captions, schedules and publishes to YouTube and TikTok.',
        ],
      },
      {
        label: 'Results',
        heading: 'Twenty channels, one operation, managed from a phone',
        paragraphs: [
          'The Animageneris app brings channels, publications and metrics together to manage the entire operation from a phone. The creator retains editorial control over every piece.',
          'The system extended from one channel to twenty, with 40.4K followers and 2.1M likes on TikTok.',
        ],
      },
    ],
    media: caseMedia('animageneris'),
    next: 'ai-agents-operations',
  },
  {
    slug: 'ai-agents-operations',
    projectId: 'agents',
    title: 'An AI agent connected to each company’s daily work',
    summary:
      'An agent core adapted to each operation’s data, rules and permissions: it reads email and documents, retrieves banking information and prepares complete Mercado Libre purchases, with sensitive actions waiting for human approval.',
    table: [
      { label: 'Client', value: 'Operations teams in several companies · Finance, purchasing and back office' },
      { label: 'Involvement', value: 'Agent core, tool integrations, permissions model, approval flows' },
      { label: 'Scope', value: 'Email · documents · banking · Mercado Libre · internal systems' },
      {
        label: 'Results',
        value: 'One agent core reused across operations. Context plus tools produce an action ready to approve; sensitive actions never run without a person.',
      },
    ],
    link: { label: 'Book a call', href: brand.bookingUrl },
    pages: [
      {
        label: 'Goal',
        heading: 'Where AI helps: context, tools and a person who approves.',
        paragraphs: [
          'An AI agent is useful when it knows the context of the work and can connect to the right tools. For several operations we implemented an agent core adapted to their data, rules and permissions.',
          'It can read email and documents, retrieve banking information and prepare a complete Mercado Libre purchase.',
        ],
      },
      {
        label: 'Results',
        heading: 'Actions ready to approve, controls that stay with people',
        paragraphs: [
          'Sensitive actions wait for approval. The agent prepares the purchase, the transfer or the reply; the person confirms it.',
          'AI participates where it adds value; the controls and critical decisions remain defined by people.',
        ],
      },
    ],
    media: caseMedia('ai-agents-operations'),
    next: 'site-inspection-reports',
  },
  {
    slug: 'site-inspection-reports',
    projectId: 'inspection',
    title: 'From a site inspection to a report ready for review',
    summary:
      'Custom software for a health-and-safety consulting firm: site photos become organized observations, recommendations and reports in Word, PDF and web, validated by the specialist before delivery.',
    table: [
      { label: 'Client', value: 'Health-and-safety consulting firm · Site inspections for construction and industry' },
      { label: 'Involvement', value: 'Custom software, image pipeline, AI-assisted analysis, document generation' },
      { label: 'Scope', value: 'Images · specialist review · Word · PDF · web' },
      {
        label: 'Results',
        value: 'Inspection photographs turned into a report ready for review. The professional validates the analysis before delivering the document.',
      },
    ],
    link: { label: 'Book a call', href: brand.bookingUrl },
    pages: [
      {
        label: 'Goal',
        heading: 'Receive the photos, organize them and prepare the report.',
        paragraphs: [
          'For a consulting firm we built software that receives site photos, organizes them, flags points for the specialist to review and prepares observations, recommendations and reports.',
        ],
      },
      {
        label: 'Results',
        heading: 'The specialist validates, the system does the rest',
        paragraphs: [
          'The professional reviews the flagged points and validates the analysis before the document goes out, in Word, PDF or on the web.',
          'Hours of manual assembly become a review step.',
        ],
      },
    ],
    media: caseMedia('site-inspection-reports'),
    next: 'english-conversation-app',
  },
  {
    slug: 'english-conversation-app',
    projectId: 'speech',
    title: 'An English conversation, corrected as it happens',
    summary:
      'An iOS app that transcribes speech in real time, suggests a clearer version without interrupting the conversation and preserves the audio if the connection drops.',
    table: [
      { label: 'Client', value: 'Language-learning product · iOS' },
      { label: 'Involvement', value: 'App design, infrastructure, audio flow, low-latency AI' },
      { label: 'Scope', value: 'iOS · real-time speech · low-latency AI' },
      {
        label: 'Results',
        value: 'Speak naturally and receive a corrected version without stopping. The audio is preserved when the connection fails.',
      },
    ],
    link: { label: 'Book a call', href: brand.bookingUrl },
    pages: [
      {
        label: 'Goal',
        heading: 'Speak naturally and get a clearer version, live.',
        paragraphs: [
          'A client came to us with a specific idea: speak naturally and receive a corrected version without interrupting the conversation.',
          'We designed the app, infrastructure and audio flow.',
        ],
      },
      {
        label: 'Results',
        heading: 'Real-time transcription that survives a bad connection',
        paragraphs: [
          'It transcribes in real time, suggests a clearer version and preserves the audio if the connection drops.',
          '"I think this process is more slow" becomes "I think this process is slower" while the conversation continues.',
        ],
      },
    ],
    media: caseMedia('english-conversation-app'),
    next: 'japon-in-box',
  },
]

export const site = { brand, nav, hero, projects, clients, awards, cta, insights, footer, caseStudies }
export type SiteContent = typeof site
export default site
