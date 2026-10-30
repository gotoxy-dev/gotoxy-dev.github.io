import { brand } from '@/content/site'
import styles from './Logo.module.css'

/**
 * Original placeholder wordmark: geometric letterforms + handwritten tagline.
 * Replace this component with your own SVG logo.
 */
export function Logo() {
  return (
    <span className={styles.logo} aria-label={`${brand.name} ${brand.tagline}`}>
      <svg className={styles.mark} viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* abstract "S" built from two arcs + dots */}
        <path d="M8 24a8 8 0 0 1 0-16h10a6 6 0 0 1 0 12H9a2 2 0 0 0 0 4h11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="34" cy="16" r="7.2" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="52" cy="16" r="7.2" stroke="currentColor" strokeWidth="2.6" />
        <path d="M66 24V8l10 16V8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86 24V8h8a4 4 0 0 1 0 8h-8m8 0 6 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="112" cy="16" r="7.2" stroke="currentColor" strokeWidth="2.6" />
      </svg>
      <span className={styles.script}>{brand.tagline}</span>
    </span>
  )
}
