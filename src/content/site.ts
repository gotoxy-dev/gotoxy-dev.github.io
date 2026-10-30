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
    frameCount: 60,
    pad: 3, // frame_001.webp
  },
}

export const projects: Project[] = [
  {
    id: 'orbit',
    name: 'Orbit Tower',
    tags: ['AR design', 'Mobile application'],
    video: '/assets/videos/project-01.mp4',
    poster: '/assets/videos/project-01.jpg',
    href: '#',
  },
  {
    id: 'lumen',
    name: 'Lumen Home',
    tags: ['Product design', 'TV application'],
    video: '/assets/videos/project-02.mp4',
    poster: '/assets/videos/project-02.jpg',
    href: '#',
  },
  {
    id: 'vector',
    name: 'Vector Systems',
    tags: ['3D animation', 'Enterprise website', 'Webflow'],
    video: '/assets/videos/project-03.mp4',
    poster: '/assets/videos/project-03.jpg',
    href: '#',
  },
  {
    id: 'hopper',
    name: 'Hopper Toys',
    tags: ['AR design', 'Website', '3D animation'],
    video: '/assets/videos/project-04.mp4',
    poster: '/assets/videos/project-04.jpg',
    href: '#',
  },
  {
    id: 'atelier',
    name: 'Atelier Bespoke',
    tags: ['3D', 'E-commerce website'],
    video: '/assets/videos/project-05.mp4',
    poster: '/assets/videos/project-05.jpg',
    href: '#',
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

export const site = { brand, nav, hero, projects, clients, awards, cta, insights, footer }
export default site
