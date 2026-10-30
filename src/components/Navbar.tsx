import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useLanguage, type Lang } from '@/i18n'
import { Logo } from './Logo'
import styles from './Navbar.module.css'

const LANGS: Lang[] = ['es', 'en']

export function Navbar() {
  const { content: { nav }, lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const items = [...nav.links, nav.cta]

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className={styles.menu} aria-label="Primary">
            {/* language switch, as on gotoxy.dev */}
            <span className={styles.langs} role="group" aria-label="Language">
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
            {items.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`${styles.link} ulink`}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* reference phones: a text "MENU" trigger instead of an icon */}
          <button
            className={`${styles.burger} ${open ? styles.open : ''}`}
            aria-label={lang === 'es' ? 'Abrir o cerrar el menú' : 'Toggle menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (lang === 'es' ? 'Cerrar' : 'Close') : (lang === 'es' ? 'Menú' : 'Menu')}
          </button>
        </div>
      </header>

      <div className={`${styles.overlay} ${open ? styles.open : ''}`} aria-hidden={!open}>
        <span className={styles.langs}>
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
          >
            <span className={styles.overlayLine} />
            {l.label}
          </a>
        ))}
      </div>
    </>
  )
}
