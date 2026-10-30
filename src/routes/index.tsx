import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { brand } from '@/content/site'
import { homeJsonLd, useSeo } from '@/seo'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { Clients } from '@/components/Clients'
import { Awards } from '@/components/Awards'
import { Cta } from '@/components/Cta'
import { Insights } from '@/components/Insights'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const jsonLd = useMemo(() => homeJsonLd(), [])
  useSeo({
    title: `${brand.name} — Custom software, integrations & AI automation`,
    description: brand.description,
    path: '/',
    jsonLd,
  })
  return (
    <>
      <Hero />
      <Projects />
      <Clients />
      <Awards />
      <Cta />
      <Insights />
    </>
  )
}
