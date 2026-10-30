import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { site, type SiteContent } from '@/content/site'
import { siteEs } from '@/content/site.es'

export type Lang = 'en' | 'es'

const CONTENT: Record<Lang, SiteContent> = { en: site, es: siteEs }
const STORAGE_KEY = 'gotoxy-lang'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  content: SiteContent
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const detectLang = (): Lang => {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    /* storage unavailable */
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

/** Holds the active language (persisted) and exposes the matching content object. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, content: CONTENT[lang] }), [lang, setLang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

/** Content of the active language. */
export const useContent = (): SiteContent => useLanguage().content
