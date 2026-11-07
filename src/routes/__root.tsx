import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const Route = createRootRoute({
  component: RootLayout,
})

/** Case-study pages are full-screen experiences without the site chrome (as on the reference). */
const isChromeless = (pathname: string) => pathname.startsWith('/projects/')

function RootLayout() {
  // The resolved location changes with the new page, inside the view transition (src/transitions.ts);
  // `location` changes as soon as the navigation starts, which would drop or add the chrome in the
  // "before" snapshot.
  const pathname = useRouterState({ select: (s) => (s.resolvedLocation ?? s.location).pathname })
  const chromeless = isChromeless(pathname)
  return (
    <>
      {!chromeless && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!chromeless && <Footer />}
    </>
  )
}
