import { createFileRoute } from '@tanstack/react-router'
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
