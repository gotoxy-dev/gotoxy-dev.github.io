import type { ServiceIconName } from '@/content/site'

/**
 * Line icons of the "What we do" services, drawn on a 48-unit grid. Stroke colour and width come
 * from the parent's CSS (`currentColor`, non-scaling stroke), so they stay hairlines at any size.
 */
const paths: Record<ServiceIconName, string[]> = {
  // a hub joined to four tools: everything connected through one point
  integrations: [
    'M28 24a4 4 0 1 1-8 0a4 4 0 1 1 8 0z',
    'M13.5 9a4.5 4.5 0 1 1-9 0a4.5 4.5 0 1 1 9 0z',
    'M43.5 9a4.5 4.5 0 1 1-9 0a4.5 4.5 0 1 1 9 0z',
    'M13.5 39a4.5 4.5 0 1 1-9 0a4.5 4.5 0 1 1 9 0z',
    'M43.5 39a4.5 4.5 0 1 1-9 0a4.5 4.5 0 1 1 9 0z',
    'M21.2 21.2L12.2 12.2',
    'M26.8 21.2L35.8 12.2',
    'M21.2 26.8L12.2 35.8',
    'M26.8 26.8L35.8 35.8',
  ],
  // a window with code brackets: software built for the operation
  software: [
    'M8 10h32a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z',
    'M6 17h36',
    'M19 23l-4 4.5l4 4.5',
    'M29 23l4 4.5l-4 4.5',
    'M25.5 22l-3 11',
  ],
  // a closed loop: work that repeats on its own
  automation: [
    'M37.5 19A14.5 14.5 0 0 0 11 15.5',
    'M10 8v8h8',
    'M10.5 29A14.5 14.5 0 0 0 37 32.5',
    'M38 40v-8h-8',
  ],
  // a large and a small spark: AI
  ai: [
    'M23 9Q25 23 39 25Q25 27 23 41Q21 27 7 25Q21 23 23 9Z',
    'M37 5Q37.6 9.4 42 10Q37.6 10.6 37 15Q36.4 10.6 32 10Q36.4 9.4 37 5Z',
  ],
}

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name].map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
