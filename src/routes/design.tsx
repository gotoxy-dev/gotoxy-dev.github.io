import { createFileRoute } from '@tanstack/react-router'
import { MarkStudy } from '@/components/MarkStudy'

/** Internal design studies (not linked from the site, not in the sitemap). */
export const Route = createFileRoute('/design')({
  component: MarkStudy,
})
