import { createFileRoute, Link } from '@tanstack/react-router'
import { caseStudies } from '@/content/site'
import { CaseStudy } from '@/components/CaseStudy'

export const Route = createFileRoute('/projects/$slug')({
  component: CaseStudyPage,
})

function CaseStudyPage() {
  const { slug } = Route.useParams()
  const study = caseStudies.find((c) => c.slug === slug)
  if (!study) {
    return (
      <main className="container" style={{ paddingTop: 'var(--layout-navHeight)' }}>
        <p className="t-body">Case study not found.</p>
        <Link to="/" className="ulink">
          Back to home
        </Link>
      </main>
    )
  }
  return <CaseStudy key={study.slug} study={study} />
}
