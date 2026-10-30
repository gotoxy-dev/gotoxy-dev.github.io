import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const Route = createRootRoute({
  component: RootLayout,
})

/** Case-study pages are full-screen experiences without the site chrome (as on the reference). */
const isChromeless = (pathname: string) => pathname.startsWith('/projects/')

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
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
