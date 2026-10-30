import { useEffect, useRef, useState } from 'react'

/** Boolean "is in viewport" via IntersectionObserver. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (options?.once) io.disconnect()
        } else if (!options?.once) {
          setInView(false)
        }
      },
      { rootMargin: options?.rootMargin ?? '0px', threshold: options?.threshold ?? 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options?.once, options?.rootMargin, options?.threshold])

  return { ref, inView }
}
