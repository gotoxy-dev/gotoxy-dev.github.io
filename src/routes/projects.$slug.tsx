import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { CaseStudy as CaseStudyContent } from '@/content/site'
import { useLanguage } from '@/i18n'
import { caseJsonLd, useSeo } from '@/seo'
import { CaseStudy } from '@/components/CaseStudy'

export const Route = createFileRoute('/projects/$slug')({
  component: CaseStudyPage,
})

function CaseStudyPage() {
  const { slug } = Route.useParams()
  const { content } = useLanguage()
  const study = content.caseStudies.find((c) => c.slug === slug)
  if (!study) return <NotFound />
  return <CaseStudyRoute key={study.slug} study={study} />
}

function CaseStudyRoute({ study }: { study: CaseStudyContent }) {
  const { content, lang } = useLanguage()
  const project = content.projects.find((p) => p.id === study.projectId)
  const jsonLd = useMemo(() => caseJsonLd(content, study, lang), [content, study, lang])
  useSeo({
    title: `${project?.name ?? study.title} — ${study.title} | ${content.brand.name}`,
    description: study.summary,
    path: `/projects/${study.slug}`,
    image: study.media.background,
    type: 'article',
    jsonLd,
    lang,
    domain: content.brand.domain,
  })
  return <CaseStudy study={study} />
}

function NotFound() {
  const { content, lang } = useLanguage()
  useSeo({
    title: `${lang === 'es' ? 'Caso no encontrado' : 'Case study not found'} | ${content.brand.name}`,
    description: content.brand.shortDescription,
    path: '/',
    lang,
    domain: content.brand.domain,
  })
  return (
    <main className="container" style={{ paddingTop: 'var(--layout-navHeight)' }}>
      <p className="t-body">{lang === 'es' ? 'Caso no encontrado.' : 'Case study not found.'}</p>
      <Link to="/" className="ulink">
        {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
      </Link>
    </main>
  )
}
