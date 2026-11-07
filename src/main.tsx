import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { applyTheme } from '@/theme/applyTheme'
import { LanguageProvider } from '@/i18n'
import { caseTransitionTypes, returningSlug, supportsViewTransitions } from '@/transitions'
import '@/styles/global.css'

applyTheme()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  // Back from a case, the home brings that case's card into view itself (src/transitions.ts),
  // before the transition captures it; restoring the old offset would move the card away.
  scrollRestoration: () => returningSlug() === null,
  // home ⇄ case study only (see src/transitions.ts)
  defaultViewTransition: supportsViewTransitions() ? { types: caseTransitionTypes } : false,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
)
