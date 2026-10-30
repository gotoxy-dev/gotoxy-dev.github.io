import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { brand, caseStudies, projects, type CaseStudy as CaseStudyContent } from '@/content/site'
import { caseJsonLd, useSeo } from '@/seo'
import { CaseStudy } from '@/components/CaseStudy'

export const Route = createFileRoute('/projects/$slug')({
  component: CaseStudyPage,
})

function CaseStudyPage() {
  const { slug } = Route.useParams()
  const study = caseStudies.find((c) => c.slug === slug)
  if (!study) return <NotFound />
  return <CaseStudyRoute key={study.slug} study={study} />
}

function CaseStudyRoute({ study }: { study: CaseStudyContent }) {
  const project = projects.find((p) => p.id === study.projectId)
  const jsonLd = useMemo(() => caseJsonLd(study), [study])
  useSeo({
    title: `${project?.name ?? study.title} — ${study.title} | ${brand.name}`,
    description: study.summary,
    path: `/projects/${study.slug}`,
    image: study.media.background,
    type: 'article',
    jsonLd,
  })
  return <CaseStudy study={study} />
}

function NotFound() {
  useSeo({ title: `Case study not found | ${brand.name}`, description: brand.shortDescription, path: '/' })
  return (
    <main className="container" style={{ paddingTop: 'var(--layout-navHeight)' }}>
      <p className="t-body">Case study not found.</p>
      <Link to="/" className="ulink">
        Back to home
      </Link>
    </main>
  )
}
