import { useEffect } from 'react'
import type { CaseStudy, SiteContent } from '@/content/site'
import type { Lang } from '@/i18n'

export interface SeoInput {
  title: string
  description: string
  /** Path starting with "/" (the canonical URL is built from the brand domain). */
  path: string
  image?: string
  /** Extra JSON-LD objects for this page (Organization and WebSite are always included on the home). */
  jsonLd?: Record<string, unknown>[]
  type?: 'website' | 'article'
  lang?: Lang
  domain: string
}

export const absolute = (domain: string, path: string) => (path.startsWith('http') ? path : `${domain}${path}`)

const DEFAULT_IMAGE = '/og.jpg'
const LOCALE: Record<Lang, string> = { en: 'en_US', es: 'es_AR' }

/** Organization entity reused by every page (also referenced from index.html). */
export const organizationJsonLd = ({ brand }: SiteContent) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${brand.domain}/#organization`,
  name: brand.name,
  legalName: brand.legalName,
  url: brand.domain,
  logo: absolute(brand.domain, '/brand-icon.svg'),
  description: brand.description,
  foundingDate: brand.foundingYear,
  address: {
    '@type': 'PostalAddress',
    addressLocality: brand.locality,
    addressRegion: brand.region,
    addressCountry: brand.countryCode,
  },
  areaServed: ['AR', 'LATAM', 'Worldwide'],
  sameAs: [brand.instagram],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: brand.bookingUrl,
    availableLanguage: ['es', 'en'],
  },
  knowsAbout: ['Custom software development', 'Systems integration', 'Business process automation', 'AI agents', 'WhatsApp Business API', 'Cloudflare Workers', 'E-commerce'],
  makesOffer: brand.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s, provider: { '@id': `${brand.domain}/#organization` } } })),
})

export const websiteJsonLd = ({ brand }: SiteContent, lang: Lang) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${brand.domain}/#website`,
  url: brand.domain,
  name: brand.name,
  description: brand.shortDescription,
  inLanguage: lang,
  publisher: { '@id': `${brand.domain}/#organization` },
})

export const homeJsonLd = (content: SiteContent, lang: Lang) => [
  organizationJsonLd(content),
  websiteJsonLd(content, lang),
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'es' ? 'Casos' : 'Case studies',
    itemListElement: content.caseStudies.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absolute(content.brand.domain, `/projects/${c.slug}`),
      name: c.title,
    })),
  },
]

export const caseJsonLd = (content: SiteContent, study: CaseStudy, lang: Lang) => {
  const { brand, projects } = content
  const project = projects.find((p) => p.id === study.projectId)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': absolute(brand.domain, `/projects/${study.slug}#article`),
      headline: study.title,
      description: study.summary,
      image: absolute(brand.domain, study.media.background),
      url: absolute(brand.domain, `/projects/${study.slug}`),
      inLanguage: lang,
      author: { '@id': `${brand.domain}/#organization` },
      publisher: { '@id': `${brand.domain}/#organization` },
      about: project?.tags,
      keywords: project?.tags.join(', '),
      articleSection: lang === 'es' ? 'Caso' : 'Case study',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'es' ? 'Inicio' : 'Home', item: brand.domain },
        { '@type': 'ListItem', position: 2, name: lang === 'es' ? 'Casos' : 'Case studies', item: `${brand.domain}/#projects` },
        { '@type': 'ListItem', position: 3, name: project?.name ?? study.title, item: absolute(brand.domain, `/projects/${study.slug}`) },
      ],
    },
  ]
}

const setMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v))
}

/**
 * Keeps <head> in sync with the current route and language: title, description,
 * canonical, Open Graph / Twitter cards and JSON-LD. The static defaults live in index.html.
 */
export function useSeo(input: SeoInput) {
  useEffect(() => {
    const url = absolute(input.domain, input.path)
    const image = absolute(input.domain, input.image ?? DEFAULT_IMAGE)
    const lang = input.lang ?? 'en'
    document.title = input.title
    setMeta('meta[name="description"]', { name: 'description', content: input.description })
    setMeta('link[rel="canonical"]', { rel: 'canonical', href: url })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: input.title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: input.description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: input.type ?? 'website' })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: LOCALE[lang] })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: input.title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: input.description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    let script = document.getElementById('route-jsonld') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = 'route-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(input.jsonLd ?? [])
  }, [input.title, input.description, input.path, input.image, input.type, input.jsonLd, input.lang, input.domain])
}
