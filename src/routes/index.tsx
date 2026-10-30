import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '@/i18n'
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

const TITLE = {
  en: (name: string) => `${name} — Custom software, integrations & AI automation`,
  es: (name: string) => `${name} — Software, integraciones y automatización a medida`,
}

function HomePage() {
  const { content, lang } = useLanguage()
  const jsonLd = useMemo(() => homeJsonLd(content, lang), [content, lang])
  useSeo({
    title: TITLE[lang](content.brand.name),
    description: content.brand.description,
    path: '/',
    jsonLd,
    lang,
    domain: content.brand.domain,
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
