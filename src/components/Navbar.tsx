import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useLanguage, type Lang } from '@/i18n'
import { tokens } from '@/theme/tokens'
import { Logo } from './Logo'
import styles from './Navbar.module.css'

const LANGS: Lang[] = ['es', 'en']
/** The menu panel only exists below the desktop layout */
const DESKTOP_QUERY = `(min-width: ${tokens.breakpoints.lg}px)`

const external = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

export function Navbar() {
  const { content: { nav }, lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

  // phones: the bar gets its backdrop once the page leaves the top (Navbar.module.css)
  useEffect(() => {
    const update = () => setSolid(window.scrollY > tokens.layout.nav.solidAfter)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // desktop menu items: hidden while scrolling down, back while scrolling up or near the top.
  // They stay shown until the visitor first scrolls by hand, so a page that loads already scrolled
  // (restored position, #anchor) still shows every item.
  const [itemsHidden, setItemsHidden] = useState(false)
  useEffect(() => {
    const { hideAfter, hideDelta } = tokens.layout.nav
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    let armed = false
    let last = window.scrollY
    const arm = () => {
      armed = true
      inputs.forEach((type) => window.removeEventListener(type, arm))
    }
    const update = () => {
      const y = window.scrollY
      if (!armed || y <= hideAfter) {
        setItemsHidden(false)
        last = y
        return
      }
      if (Math.abs(y - last) < hideDelta) return
      setItemsHidden(y > last)
      last = y
    }
    inputs.forEach((type) => window.addEventListener(type, arm, { passive: true }))
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      inputs.forEach((type) => window.removeEventListener(type, arm))
      window.removeEventListener('scroll', update)
    }
  }, [])

  // Scroll lock while the menu is open. The page keeps its scroll offset (a fixed <body> would reset
  // it to 0 and rewind the scroll-scrubbed animations under the panel): <html> stops scrolling and
  // touch moves are cancelled, which also holds on iOS versions that ignore `overflow: hidden`.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const stop = (e: TouchEvent) => e.preventDefault()
    root.style.overflow = 'hidden'
    document.addEventListener('touchmove', stop, { passive: false })
    return () => {
      root.style.overflow = ''
      document.removeEventListener('touchmove', stop)
    }
  }, [open])

  // Escape closes the menu (and only the menu: not the case study under it) and returns focus to
  // the trigger; growing to the desktop layout, where the trigger is hidden, closes it too.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(false)
      burgerRef.current?.focus()
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onDesktop = () => desktop.matches && setOpen(false)
    document.addEventListener('keydown', onKey, true)
    desktop.addEventListener('change', onDesktop)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [open])

  const items = [...nav.links, nav.cta]

  return (
    <>
      <header className={`${styles.nav} ${solid ? styles.solid : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={`${styles.logo} tap-area`} aria-label="Home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className={`${styles.menu} ${itemsHidden ? styles.itemsHidden : ''}`} aria-label="Primary">
            {/* language switch, as on gotoxy.dev */}
            <span className={`${styles.langs} ${styles.item}`} style={{ '--i': 0 } as React.CSSProperties} role="group" aria-label="Language">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`${styles.lang} ${lang === l ? styles.langActive : ''}`}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </span>
            {items.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                className={`${styles.link} ${styles.item} ulink`}
                style={{ '--i': i + 1 } as React.CSSProperties}
                {...external(l.href)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* reference phones: a text "MENU" trigger instead of an icon */}
          <button
            ref={burgerRef}
            className={`${styles.burger} ${open ? styles.open : ''} tap-area`}
            aria-label={lang === 'es' ? 'Abrir o cerrar el menú' : 'Toggle menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (lang === 'es' ? 'Cerrar' : 'Close') : (lang === 'es' ? 'Menú' : 'Menu')}
          </button>
        </div>
      </header>

      {/* closed: off screen and inert, so its links are neither focusable nor read */}
      <div className={`${styles.overlay} ${open ? styles.open : ''}`} aria-hidden={!open} inert={!open}>
        <span className={styles.langs} role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button key={l} type="button" className={`${styles.lang} ${lang === l ? styles.langActive : ''}`} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </span>
        {items.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            className={styles.overlayLink}
            style={{ '--i': i } as React.CSSProperties}
            onClick={() => setOpen(false)}
            {...external(l.href)}
          >
            <span className={styles.overlayLine} />
            {l.label}
          </a>
        ))}
      </div>
    </>
  )
}
