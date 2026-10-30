/**
 * SITE CONTENT — single source of truth for every section.
 *
 * Replace the placeholder copy, media paths and links here with your
 * company's data. Components only consume these objects; nothing is
 * hard-coded in the UI layer.
 *
 * Media paths point to generated placeholders in /public/assets
 * (run `npm run assets:generate` to rebuild them).
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

export interface CaseStudy {
  slug: string
  /** Project this case belongs to (`projects[].id`) */
  projectId: string
  title: string
  table: CaseTableRow[]
  /** Link shown on the first page (app store, live site…) */
  link: { label: string; href: string }
  /** Second and third page copy */
  pages: [CasePage, CasePage]
  /** Visuals of the three left-hand sections */
  media: {
    /** page 1: full-bleed background + device mockup on top */
    background: string
    device: string
    /** page 2: looping reel */
    video: string
    videoPoster: string
    /** page 3: full-bleed image */
    closing: string
  }
  /** Slug of the next case study */
  next: string
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
  /** image shown on the left while the group is expanded (optional) */
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

export const brand = {
  name: 'Studio',
  /** second word drawn in the script font next to the wordmark */
  tagline: 'Agency',
  /** inline SVG wordmark lives in components/Logo.tsx — swap it there */
  email: 'hello@yourstudio.com',
  copyright: `${new Date().getFullYear()} STUDIO AGENCY. ALL RIGHTS RESERVED`,
}

export const nav: { links: NavLink[]; cta: NavLink } = {
  links: [
    { label: 'Our story', href: '/#story' },
    { label: 'Product design', href: '/#projects' },
    { label: 'Websites', href: '/#projects' },
    { label: 'Brand identity', href: '/#projects' },
  ],
  cta: { label: "Let's talk", href: '/#contact' },
}

export const hero = {
  /** Each line is revealed independently; `align: 'right'` pushes the line to the right edge. */
  lines: [
    { text: 'Design that', align: 'left' as const },
    { text: 'Elevates', align: 'left' as const, trailing: 'Your' },
    { text: 'Digital presence', align: 'right' as const },
  ],
  caption: ['User-centered,', 'Thoughtful, creative'],
  /** Image sequence drawn on the canvas behind the headline */
  sequence: {
    dir: '/assets/hero-seq',
    ext: 'webp',
    frameCount: 39, // same count as the reference sequence
    pad: 3, // frame_001.webp
  },
}

export const projects: Project[] = [
  {
    id: 'orbit',
    name: 'Orbit Tower',
    tags: ['AR design', 'Mobile application'],
    video: '/assets/videos/project-01.webm',
    poster: '/assets/videos/project-01.jpg',
    href: '/projects/orbit-tower-mobile-app',
  },
  {
    id: 'lumen',
    name: 'Lumen Home',
    tags: ['Product design', 'TV application'],
    video: '/assets/videos/project-02.webm',
    poster: '/assets/videos/project-02.jpg',
    href: '/projects/lumen-home-tv-application',
  },
  {
    id: 'vector',
    name: 'Vector Systems',
    tags: ['3D animation', 'Enterprise website', 'Webflow'],
    video: '/assets/videos/project-03.webm',
    poster: '/assets/videos/project-03.jpg',
    href: '/projects/vector-systems-enterprise-website',
  },
  {
    id: 'hopper',
    name: 'Hopper Toys',
    tags: ['AR design', 'Website', '3D animation'],
    video: '/assets/videos/project-04.webm',
    poster: '/assets/videos/project-04.jpg',
    href: '/projects/hopper-toys-ar-website',
  },
  {
    id: 'atelier',
    name: 'Atelier Bespoke',
    tags: ['3D', 'E-commerce website'],
    video: '/assets/videos/project-05.webm',
    poster: '/assets/videos/project-05.jpg',
    href: '/projects/atelier-bespoke-ecommerce',
  },
]

export const clients = {
  title: ['What our', 'Clients say'],
  seeMoreLabel: 'See more on',
  seeMoreLogo: '/assets/logos/review-platform.svg',
  readLabel: 'Read',
  closeLabel: 'Close',
  testimonials: [
    {
      id: 't1',
      author: 'Jordan Reyes',
      role: 'Chief Marketing Officer',
      company: 'Orbit Tower',
      scope: 'Mobile app design',
      quote:
        'The team started the new visitor app with hands-on research: usability sessions with real guests on site and a side-by-side review of several navigation models.\n\nThe redesigned experience lifted monthly active usage by roughly a fifth within the first weeks after launch.',
    },
    {
      id: 't2',
      author: 'Priya Natarajan',
      role: 'Executive Director',
      company: 'Relief Network',
      scope: 'UI UX design for web app / Mobile app /\nInteractive dashboard / Website design',
      quote:
        'They are not afraid of hard problems. The studio rebuilt our entire interface around requirements that most agencies would have pushed back on, and did it with care.',
    },
    {
      id: 't3',
      author: 'Marcus Lindqvist',
      role: 'Executive General Manager',
      company: 'Northline Finance',
      scope: 'Broker platform / Customer platform /\nCompany website / Marketing\nmaterials / Promo videos',
      quote:
        'From product and website through promotional material, animated videos and branding, the studio has delivered consistently and gone beyond what we asked for.\n\nWe know we can rely on them for high-quality work, and we value the contribution they make to our product.',
    },
  ] satisfies Testimonial[],
  logos: [
    { id: 'l1', name: 'Cadence', src: '/assets/logos/client-01.svg' },
    { id: 'l2', name: 'Orbit Tower', src: '/assets/logos/client-02.svg' },
    { id: 'l3', name: 'Webflow', src: '/assets/logos/client-03.svg' },
    { id: 'l4', name: 'Northline', src: '/assets/logos/client-04.svg' },
    { id: 'l5', name: 'Relief Network', src: '/assets/logos/client-05.svg' },
    { id: 'l6', name: 'Lumen', src: '/assets/logos/client-06.svg' },
  ] satisfies ClientLogo[],
}

export const awards = {
  intro:
    'We are an award-winning design agency with a talented team of digital creatives, product designers, developers and problem solvers, ready to bring a fresh perspective to the solutions you need.',
  moreLabel: ['+ 50 more', 'Awards'],
  groups: [
    { id: 'reddot', name: 'RedDot', entries: [] },
    {
      id: 'webby',
      name: 'Webby',
      image: '/assets/awards/award-webby.webp',
      entries: [
        { title: 'ITG Digital – Nomination, Web Services & Applications', year: '2020' },
        { title: 'Northline – Winner, Financial Services / Banking', year: '2023' },
      ],
    },
    { id: 'sfdw', name: 'San Francisco Design Week', entries: [] },
    {
      id: 'awwwards',
      name: 'Awwwards',
      image: '/assets/awards/award-awwwards.webp',
      entries: [
        { title: 'Northline Finance – Honorable mention', year: '2023' },
        { title: 'Hopper Toys – Honorable mention', year: '2023' },
        { title: 'Founder portfolio website – Site of the day', year: '2022' },
        { title: 'Vector nominated for "Mobile website of the year"', year: '2021' },
        { title: 'Vector – Website of the day', year: '2021' },
        { title: 'Vector – Mobile website of the week', year: '2021' },
        { title: 'Vector – Developer award', year: '2021' },
        { title: 'MadDad – Honorable mention', year: '2020' },
        { title: 'MadDad – Mobile design excellence', year: '2020' },
        { title: 'Vector – Honorable mention', year: '2018' },
        { title: 'Vector – Mobile design excellence', year: '2018' },
        { title: 'Vector – Site of the day', year: '2018' },
      ],
    },
    {
      id: 'cssda',
      name: 'CSS Design Award',
      image: '/assets/awards/award-cssda.webp',
      entries: [
        { title: 'Hopper Toys – Website of the day', year: '2023' },
        { title: 'Founder personal website – Website of the day', year: '2023' },
      ],
    },
    { id: 'adc-eu', name: 'ADC Europe', entries: [] },
    { id: 'adc-ua', name: 'ADC UA', entries: [] },
  ] satisfies AwardGroup[],
}

export const cta = {
  eyebrow: ['Building', 'Relationships'],
  /** One entry per animated line (the reference reveals five fixed lines). */
  headline: [
    "But we're here not to talk",
    "about ourselves - we're",
    'here to talk about you,',
    'your company, your',
    'product, and your goals.',
  ],
  button: { label: "Let's talk", href: `mailto:${brand.email}` },
}

export const insights = {
  title: 'Our insights',
  moreLabel: 'More insights',
  moreHref: '#',
  items: [
    {
      id: 'i1',
      title: 'How to effectively implement 3D animation on a website.',
      category: 'Interactive design',
      image: '/assets/insights/insight-01.webp',
      href: '#',
    },
    {
      id: 'i2',
      title: 'How to create an immersive website with AR and 3D.',
      category: 'Interactive design',
      image: '/assets/insights/insight-02.webp',
      href: '#',
    },
    {
      id: 'i3',
      title: 'Essential branding strategies for Web3: what you need to know.',
      category: 'Branding',
      image: '/assets/insights/insight-03.webp',
      href: '#',
    },
    {
      id: 'i4',
      title: 'What does it take to create interactive storytelling for a corporate website?',
      category: 'Interactive design',
      image: '/assets/insights/insight-04.webp',
      href: '#',
    },
  ] satisfies Insight[],
}

export const footer = {
  backToTop: 'Back to top',
  socials: [
    { label: 'Dribbble', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Insights', href: '#' },
  ] satisfies NavLink[],
  headline: 'Get in touch',
  email: brand.email,
  copyright: brand.copyright,
}

const caseMedia = (slug: string) => ({
  background: `/assets/cases/${slug}/page-1.jpg`,
  device: `/assets/cases/${slug}/device.png`,
  video: `/assets/cases/${slug}/reel.webm`,
  videoPoster: `/assets/cases/${slug}/reel.jpg`,
  closing: `/assets/cases/${slug}/page-3.jpg`,
})

/** Case-study pages (`/projects/:slug`). One per project; the order sets the "next project" chain. */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'orbit-tower-mobile-app',
    projectId: 'orbit',
    title: 'Upgrading the Orbit Tower visit',
    table: [
      { label: 'Client', value: 'Orbit Tower' },
      { label: 'Involvement', value: 'Graphic designer, UI/UX designer, Motion designer' },
      { label: 'Scope', value: 'Mobile app' },
      {
        label: 'Results',
        value:
          'Visitors now access their photos and videos within seconds instead of a 10-15 minute wait. Satisfaction went up, and app usage grew by a fifth in the first month.',
      },
    ],
    link: { label: 'Download the app', href: '#' },
    pages: [
      {
        label: 'Goal',
        heading: 'Seamless access to all experiences via mobile app.',
        paragraphs: [
          'We partnered with Orbit Tower to rethink the visitor experience with a mobile app that brings every attraction together and removes paper tickets and queues at kiosks.',
          'The work started with a broad exploration of design paradigms and on-site interviews with real visitors. That research shaped every decision in the app.',
          'Guided features such as the observation deck camera, AR views and roaming photos turned the app into an interactive guide with step-by-step explanations of each experience.',
        ],
      },
      {
        label: 'Results',
        heading: 'Transformed the traditional photo and experience process',
        paragraphs: [
          'The trust placed in us by the Orbit Tower team let us push the design beyond expectations. Since launch, adoption grew by a fifth within the first month.',
          'Visitors launch every experience from the app and get their photos in seconds. The days of waiting in line at kiosks are gone.',
          'We are grateful for the collaboration and look forward to the next steps together.',
        ],
      },
    ],
    media: caseMedia('orbit-tower-mobile-app'),
    next: 'lumen-home-tv-application',
  },
  {
    slug: 'lumen-home-tv-application',
    projectId: 'lumen',
    title: 'A calmer TV experience for every room',
    table: [
      { label: 'Client', value: 'Lumen Home' },
      { label: 'Involvement', value: 'Product designer, UI/UX designer, Motion designer' },
      { label: 'Scope', value: 'TV application' },
      {
        label: 'Results',
        value: 'Guests order services from the TV in two clicks. Requests handled per hour doubled after the rollout.',
      },
    ],
    link: { label: 'Visit the website', href: '#' },
    pages: [
      {
        label: 'Goal',
        heading: 'One screen for every request, from towels to late checkout.',
        paragraphs: [
          'Lumen Home needed a TV interface that works from across the room, with a remote, for guests of every age.',
          'We designed a large-type grid, a persistent request tray and a clear focus state so navigation never gets lost.',
          'Motion was kept slow and deliberate, matching the pace of a living room rather than a phone.',
        ],
      },
      {
        label: 'Results',
        heading: 'Fewer calls to the front desk, happier guests',
        paragraphs: [
          'The request flow replaced most front-desk calls, and staff now see every order on a single dashboard.',
          'Guest reviews mention the TV app as a highlight of the stay.',
        ],
      },
    ],
    media: caseMedia('lumen-home-tv-application'),
    next: 'vector-systems-enterprise-website',
  },
  {
    slug: 'vector-systems-enterprise-website',
    projectId: 'vector',
    title: 'An enterprise website that moves',
    table: [
      { label: 'Client', value: 'Vector Systems' },
      { label: 'Involvement', value: '3D artist, UI/UX designer, Webflow developer' },
      { label: 'Scope', value: 'Enterprise website' },
      { label: 'Results', value: 'Time on page tripled on the product tour, and demo requests grew by a third.' },
    ],
    link: { label: 'Visit the website', href: '#' },
    pages: [
      {
        label: 'Goal',
        heading: 'Explain a complex product with 3D instead of paragraphs.',
        paragraphs: [
          'Vector sells design automation for electronics. Their old site described it; the new one shows it, with a 3D board that assembles as you scroll.',
          'We built the scenes in 3D, rendered them as sequences and wired them to scroll progress in Webflow.',
        ],
      },
      {
        label: 'Results',
        heading: 'A product tour people actually finish',
        paragraphs: [
          'Visitors scroll through the whole tour, and the demo form at the end converts far better than the previous contact page.',
          'The system of sequences is reusable for every new product launch.',
        ],
      },
    ],
    media: caseMedia('vector-systems-enterprise-website'),
    next: 'hopper-toys-ar-website',
  },
  {
    slug: 'hopper-toys-ar-website',
    projectId: 'hopper',
    title: 'Bringing a toy to life with AR',
    table: [
      { label: 'Client', value: 'Hopper Toys' },
      { label: 'Involvement', value: '3D artist, AR designer, Web developer' },
      { label: 'Scope', value: 'AR experience and website' },
      { label: 'Results', value: 'Two design awards and a sold-out first production run.' },
    ],
    link: { label: 'Visit the website', href: '#' },
    pages: [
      {
        label: 'Goal',
        heading: 'Let families meet the character before it ships.',
        paragraphs: [
          'Hopper wanted buyers to see the toy in their own living room. We built a web AR experience that places the character on any surface, no app required.',
          'The website wraps the AR scene in a playful story with 3D animation on every section.',
        ],
      },
      {
        label: 'Results',
        heading: 'Recognised by the design community',
        paragraphs: [
          'The site collected honourable mentions and a site of the day, and the AR try-out became the main driver of pre-orders.',
        ],
      },
    ],
    media: caseMedia('hopper-toys-ar-website'),
    next: 'atelier-bespoke-ecommerce',
  },
  {
    slug: 'atelier-bespoke-ecommerce',
    projectId: 'atelier',
    title: 'E-commerce that feels made to measure',
    table: [
      { label: 'Client', value: 'Atelier Bespoke' },
      { label: 'Involvement', value: '3D artist, UI/UX designer, Front-end developer' },
      { label: 'Scope', value: 'E-commerce website' },
      { label: 'Results', value: 'Average order value grew by a quarter after the configurator launched.' },
    ],
    link: { label: 'Visit the website', href: '#' },
    pages: [
      {
        label: 'Goal',
        heading: 'Configure a product in 3D, then buy it in one step.',
        paragraphs: [
          'Atelier sells made-to-order goods. We designed a configurator where every option updates a 3D model in real time, and the checkout keeps the chosen configuration visible.',
        ],
      },
      {
        label: 'Results',
        heading: 'Bigger baskets, fewer returns',
        paragraphs: [
          'Seeing the product before ordering reduced returns and increased the average order value. The configurator now powers the whole catalogue.',
        ],
      },
    ],
    media: caseMedia('atelier-bespoke-ecommerce'),
    next: 'orbit-tower-mobile-app',
  },
]

export const site = { brand, nav, hero, projects, clients, awards, cta, insights, footer, caseStudies }
export default site
