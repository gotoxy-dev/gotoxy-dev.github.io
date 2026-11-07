import { useContent } from '@/i18n'
import { LOGO_MARK_PATHS } from './logoMark'
import styles from './Logo.module.css'

/** gotoxy mark (the "G" from the brand icon) + wordmark. */
export function Logo() {
  const { brand } = useContent()
  return (
    <span className={styles.logo} aria-label={`${brand.name} — ${brand.tagline}`}>
      <svg className={styles.mark} viewBox="0 0 128 128" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {LOGO_MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <span className={styles.word}>{brand.name}</span>
    </span>
  )
}
