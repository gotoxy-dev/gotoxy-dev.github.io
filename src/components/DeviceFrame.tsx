import { useId, type ReactNode } from 'react'
import styles from './DeviceFrame.module.css'

/**
 * Phone mockup drawn in SVG (viewBox 440×900): titanium rail with side buttons, black glass
 * bezel, dynamic island and a soft glass reflection. The screen is a transparent hole; the
 * children render underneath it, clipped to the rounded screen.
 */
export function DeviceFrame({ children, className }: { children: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, '')
  const rail = `rail-${id}`
  const edge = `edge-${id}`
  const glare = `glare-${id}`

  return (
    <div className={`${styles.device} ${className ?? ''}`}>
      <div className={styles.screen}>{children}</div>
      <svg className={styles.frame} viewBox="0 0 440 900" aria-hidden="true">
        <defs>
          {/* brushed metal: light catches both long edges */}
          <linearGradient id={rail} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--color-phoneMetalDark)' }} />
            <stop offset="0.02" style={{ stopColor: 'var(--color-phoneMetalLight)' }} />
            <stop offset="0.06" style={{ stopColor: 'var(--color-phoneMetalMid)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--color-phoneMetalDark)' }} />
            <stop offset="0.94" style={{ stopColor: 'var(--color-phoneMetalMid)' }} />
            <stop offset="0.98" style={{ stopColor: 'var(--color-phoneMetalLight)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-phoneMetalDark)' }} />
          </linearGradient>
          <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--color-phoneMetalLight)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--color-phoneMetalMid)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-phoneMetalLight)' }} />
          </linearGradient>
          <linearGradient id={glare} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--color-phoneGlare)' }} />
            <stop offset="0.45" style={{ stopColor: 'var(--color-phoneGlare)' }} />
            <stop offset="0.46" stopOpacity="0" style={{ stopColor: 'var(--color-phoneGlare)' }} />
          </linearGradient>
        </defs>

        {/* side buttons: action + volume on the left, power on the right */}
        <g style={{ fill: 'var(--color-phoneButton)' }}>
          <rect x="1" y="168" width="7" height="34" rx="2.5" />
          <rect x="1" y="232" width="7" height="62" rx="2.5" />
          <rect x="1" y="306" width="7" height="62" rx="2.5" />
          <rect x="432" y="258" width="7" height="98" rx="2.5" />
        </g>

        {/* titanium rail with the screen cut out (evenodd) */}
        <path
          fillRule="evenodd"
          fill={`url(#${rail})`}
          d="M74 4 H366 A70 70 0 0 1 436 74 V826 A70 70 0 0 1 366 896 H74 A70 70 0 0 1 4 826 V74 A70 70 0 0 1 74 4 Z
             M78 14 H362 A62 62 0 0 1 424 76 V824 A62 62 0 0 1 362 886 H78 A62 62 0 0 1 16 824 V76 A62 62 0 0 1 78 14 Z"
        />
        <path
          fill="none"
          stroke={`url(#${edge})`}
          strokeWidth="1.2"
          d="M74 4.6 H366 A69.4 69.4 0 0 1 435.4 74 V826 A69.4 69.4 0 0 1 366 895.4 H74 A69.4 69.4 0 0 1 4.6 826 V74 A69.4 69.4 0 0 1 74 4.6 Z"
        />

        {/* black glass bezel around the screen */}
        <path
          fillRule="evenodd"
          style={{ fill: 'var(--color-phoneBezel)' }}
          d="M78 14 H362 A62 62 0 0 1 424 76 V824 A62 62 0 0 1 362 886 H78 A62 62 0 0 1 16 824 V76 A62 62 0 0 1 78 14 Z
             M76 26 H364 A52 52 0 0 1 416 78 V822 A52 52 0 0 1 364 874 H76 A52 52 0 0 1 24 822 V78 A52 52 0 0 1 76 26 Z"
        />

        {/* dynamic island */}
        <rect x="163" y="40" width="114" height="33" rx="16.5" style={{ fill: 'var(--color-phoneBezel)' }} />
        <circle cx="258" cy="56.5" r="5.5" style={{ fill: 'var(--color-phoneMetalDark)' }} opacity="0.5" />

        {/* glass reflection over the top-left of the screen */}
        <path fill={`url(#${glare})`} d="M76 26 H364 A52 52 0 0 1 416 78 V420 L24 760 V78 A52 52 0 0 1 76 26 Z" />
      </svg>
    </div>
  )
}
