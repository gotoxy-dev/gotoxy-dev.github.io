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
  /**
   * Presentation card: the description on the left and the product's presentation image on the
   * right (the case's `showcase` board), instead of the full-width media.
   */
  feature?: ProjectFeature
  /** The client's own logo and typeface, shown as the card's title (`tokens.font.brand`) */
  brand?: ProjectBrand
}

export interface ProjectBrand {
  logo: string
  /** Aspect ratio of the logo's drawn area when the file has empty margins around it (cropped with object-fit) */
  logoAspect?: string
  font: 'japonInBox' | 'institutoCam'
}

export interface ProjectFeature {
  title: string
  text: string
  /** Call to action that opens the case (the whole card is the link) */
  cta: string
}

export interface Testimonial {
  id: string
  author: string
  role: string
  company: string
  scope: string
  quote: string
}

/**
 * A marquee logo: the brand's own logo file (`src`), optionally with the part of its name the file
 * does not carry (`label`) set before it, or after it with `labelAfter`, in the brand's own
 * typeface when the site has it (`font`, a key of tokens.font.brand) or else in the site font.
 */
export interface ClientLogo {
  id: string
  name: string
  src: string
  label?: string
  labelAfter?: boolean
  font?: 'japonInBox' | 'institutoCam'
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

export type ServiceIconName = 'integrations' | 'software' | 'automation' | 'ai'

export interface Insight {
  id: string
  title: string
  category: string
  /** Line icon shown beside the service (`ServiceIcon`) */
  icon: ServiceIconName
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

export interface CaseStoryScene {
  /** Small caps label (THE PROBLEM…) */
  label: string
  title: string
  text: string
}

export type CaseOutcomeIcon = 'signup' | 'campus' | 'messages' | 'payments' | 'control'

export interface CaseOutcome {
  icon: CaseOutcomeIcon
  title: string
  before: string
  after: string
}

/**
 * Product visuals drawn in code (src/components/showcase) instead of the media images: the
 * presentation board (home card and chapter 1), an animated explainer (chapter 2) and the
 * before / after of the team's daily operation (chapter 3).
 */
export interface CaseShowcase {
  /** Which product's visuals (key of the showcase registry) */
  id: 'cam'
  /** Accessible description of the presentation board */
  boardLabel: string
  story: {
    /** Eyebrow above the scene captions */
    label: string
    /** Problem, solution, results */
    scenes: [CaseStoryScene, CaseStoryScene, CaseStoryScene]
    /** Captions of the solution scene, one per step of the process, in order */
    steps: string[]
    /** One big word per step, cut on screen as the step starts (kinetic type) */
    words: string[]
    /** One line per beat of the problem chapter, shown in the film while the beat plays */
    problemBeats: string[]
    /** Figures shown in the results scene */
    stats: { value: string; label: string }[]
    replay: string
    pause: string
    play: string
  }
  outcomes: {
    before: string
    after: string
    items: CaseOutcome[]
  }
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
  /** Visuals drawn in code; when present they replace `media` on the page (media stays for SEO) */
  showcase?: CaseShowcase
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
    brand: { logo: '/assets/logos/client-japon-isotipo.webp', font: 'japonInBox' },
  },
  {
    id: 'cam',
    name: 'Instituto CAM',
    tags: ['Education', 'WhatsApp API', 'Automation'],
    video: '/assets/videos/project-02.webm',
    poster: '/assets/videos/project-02.jpg',
    href: '/projects/instituto-cam',
    featured: true,
    brand: { logo: '/assets/logos/client-instituto-cam.png', logoAspect: '434 / 129', font: 'institutoCam' },
    feature: {
      title: 'Academic management, WhatsApp and payments in one platform',
      text: 'Instituto CAM supports Brazilian students at universities in Paraguay. It ran thousands of students on spreadsheets, one-by-one messages and manual uploads to the virtual campus. We built a custom web platform that runs the whole operation.',
      cta: 'View case study',
    },
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
    { id: 'l2', name: 'Instituto CAM', src: '/assets/logos/client-instituto-cam.png', label: 'INSTITUTO', font: 'institutoCam' },
    { id: 'l4', name: 'WhatsApp Business API', src: '/assets/logos/stack-whatsapp.svg', label: 'WhatsApp Business API', labelAfter: true },
    { id: 'l9', name: 'Meta', src: '/assets/logos/stack-meta.svg', label: 'Meta', labelAfter: true },
    { id: 'l5', name: 'Cloudflare Workers', src: '/assets/logos/stack-cloudflare.svg' },
    { id: 'l7', name: 'Moodle', src: '/assets/logos/stack-moodle.svg', label: 'Moodle', labelAfter: true },
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
      icon: 'integrations',
      href: brand.bookingUrl,
    },
    {
      id: 'software',
      title: 'Custom software built around a specific operation.',
      category: 'Custom software',
      icon: 'software',
      href: brand.bookingUrl,
    },
    {
      id: 'automation',
      title: 'Automation that removes manual work from daily tasks.',
      category: 'Automation',
      icon: 'automation',
      href: brand.bookingUrl,
    },
    {
      id: 'ai',
      title: 'AI agents connected to your data, rules and permissions, with human approval.',
      category: 'AI agents',
      icon: 'ai',
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
        heading: 'One platform that runs the whole operation',
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
          'Afterwards we extended it into the institute’s own panel: automatic Moodle enrolment, campaigns, resends, payments in three currencies with several cashiers, roles and a change history. The institute controls everything without depending on us.',
        ],
      },
    ],
    media: caseMedia('instituto-cam'),
    showcase: {
      id: 'cam',
      boardLabel: 'Instituto CAM panel: students, WhatsApp campaign, delivery report, payments, and the student’s signup form and WhatsApp messages',
      story: {
        label: 'The story, step by step',
        scenes: [
          {
            label: 'The problem',
            title: 'Thousands of students, spreadsheets and one message at a time',
            text: 'Data typed by hand, duplicates and phones with no format. Every campus login and every class schedule went out one message at a time.',
          },
          {
            label: 'The solution',
            title: 'One platform that runs the whole operation',
            text: 'Online signup, cross-check against the university, automatic Moodle enrolment, WhatsApp campaigns and payments, in a single panel.',
          },
          {
            label: 'The results',
            title: 'From manual tasks to a daily operation',
            text: 'The team works from one panel. On the first day of the campaign close to 2,000 messages went out.',
          },
        ],
        steps: [
          'Students sign up on their own, through the registration module',
          'CAM’s operators audit the records and cross-check every student, commission by commission',
          'Once checked, they pick the WhatsApp templates, add the Moodle and Zoom links and send the campaign to each commission',
          'They also manage the payments, in guaraníes, dollars and reais',
          'Reports show the statistics, campaign errors and every kind of issue',
        ],
        words: ['Signup', 'Cross-check', 'Campaigns', 'Payments', 'Reports'],
        problemBeats: [
          'Spreadsheets typed by hand: duplicates and phones with no format',
          'Every login and every class schedule, one WhatsApp at a time',
          'Moodle accounts created by hand, one student at a time',
          'Payments noted in Excel sheets, in guaraníes, dollars and reais',
          'Copies of the list, and nobody knows who changed what',
        ],
        stats: [
          { value: '3,000+', label: 'students in one panel' },
          { value: '≈2,000', label: 'messages on the first campaign day' },
          { value: '3', label: 'currencies, several cashiers' },
        ],
        replay: 'Watch again',
        pause: 'Pause',
        play: 'Play',
      },
      outcomes: {
        before: 'Before',
        after: 'Now',
        items: [
          {
            icon: 'signup',
            title: 'Signup',
            before: 'Spreadsheets typed by hand, with duplicates and missing data',
            after: 'Online form in Portuguese and Spanish, with the phone validated by country',
          },
          {
            icon: 'campus',
            title: 'Virtual campus',
            before: 'Accounts and commissions loaded into Moodle one by one',
            after: 'Automatic enrolment by commission, and a check of the differences between campus and system',
          },
          {
            icon: 'messages',
            title: 'Messaging',
            before: 'Logins and schedules sent one message at a time',
            after: 'Campaigns to 3,000+ students with delivery tracking, resends and automatic replies',
          },
          {
            icon: 'payments',
            title: 'Payments',
            before: 'Paper receipts and separate accounts for each currency',
            after: 'Guaraníes, dollars and reais, several cashiers and the receipt sent to the student by WhatsApp',
          },
          {
            icon: 'control',
            title: 'Control',
            before: 'No record of who changed what',
            after: 'Users, roles and a change history; PDF and Excel reports',
          },
        ],
      },
    },
    next: 'japon-in-box',
  },
]

export const site = { brand, nav, hero, projects, clients, awards, cta, insights, footer, caseStudies }
export type SiteContent = typeof site
export default site
