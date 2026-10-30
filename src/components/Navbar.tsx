import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { nav } from '@/content/site'
import { Logo } from './Logo'
import styles from './Navbar.module.css'

export function Navbar() {
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
            {items.map((l) => (
              <a key={l.label} href={l.href} className={`${styles.link} ulink`}>
                {l.label}
              </a>
            ))}
          </nav>

          <button
            className={`${styles.burger} ${open ? styles.open : ''}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`${styles.overlay} ${open ? styles.open : ''}`} aria-hidden={!open}>
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
