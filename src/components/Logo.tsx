import { useContent } from '@/i18n'
import styles from './Logo.module.css'

/** gotoxy mark (the "G" from the brand icon) + wordmark. */
export function Logo() {
  const { brand } = useContent()
  return (
    <span className={styles.logo} aria-label={`${brand.name} — ${brand.tagline}`}>
      <svg className={styles.mark} viewBox="0 0 128 128" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M61 18H49C26 18 14 32 14 55V75C14 98 29 112 52 112H73C98 112 111 98 111 75V61H66V82H87C85 89 80 92 72 92H54C41 92 35 86 35 73V57C35 44 40 39 53 39H61Z" />
        <path d="M80 14H99Q111 14 111 26V44H80Q70 44 70 34V24Q70 14 80 14Z" />
      </svg>
      <span className={styles.word}>{brand.name}</span>
    </span>
  )
}
