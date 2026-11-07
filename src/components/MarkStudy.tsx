import { useEffect } from 'react'
import { ParticleMark } from './ParticleMark'
import type { MarkVariant } from './markSampling'
import styles from './MarkStudy.module.css'

const STUDIES: { variant: MarkVariant; title: string; text: string; tag?: string }[] = [
  {
    variant: 'grid',
    title: 'Before',
    text: 'Grid sampling: the outline follows a grid about 10 px apart, so curves turn into steps and the sides show rows.',
  },
  {
    variant: 'contour',
    title: '1 · Real outline',
    text: 'Same slab. The sides follow the logo’s curves and the faces are filled evenly, with no rows or columns.',
  },
  {
    variant: 'pillow',
    title: '2 · Rounded volume',
    text: 'The edge rolls from the faces into the sides, so the light slides over the curves instead of breaking on corners.',
    tag: 'In use',
  },
  {
    variant: 'rings',
    title: '3 · Rings',
    text: 'No fill: lines of points parallel to the outline on both faces, and the outer line through the depth.',
  },
]

/**
 * Design study for the hero "G" (/design, not linked from the site): the current particle mark
 * next to the three proposals, each live with the same physics. They turn on their own; move
 * the pointer across a panel to push the particles.
 */
export function MarkStudy() {
  // internal page: keep it out of search results while it is open
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    const title = document.title
    document.title = 'G particle study | gotoxy'
    return () => {
      meta.remove()
      document.title = title
    }
  }, [])

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.head}>
        <h1 className={styles.title}>G particle study</h1>
        <p className={styles.lead}>Each panel turns on its own. Sweep the pointer across one, slowly and then fast, to see how the particles react.</p>
      </header>
      <div className={styles.grid}>
        {STUDIES.map((s) => (
          <section key={s.variant} className={styles.panel}>
            <ParticleMark className={styles.canvas} variant={s.variant} autoRotate />
            <div className={styles.caption}>
              <span className={styles.name}>
                {s.title}
                {s.tag && <span className="pill">{s.tag}</span>}
              </span>
              <span className={styles.text}>{s.text}</span>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
