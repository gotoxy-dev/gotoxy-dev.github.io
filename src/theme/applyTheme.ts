import { tokens } from './tokens'

/**
 * Flattens the token object into CSS custom properties on <html>.
 *   tokens.color.text      -> --color-text
 *   tokens.type.h2.size    -> --type-h2-size
 *   tokens.motion.ease.outSine -> --motion-ease-outSine
 */
function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${key}` : key
    if (value !== null && typeof value === 'object') {
      Object.assign(out, flatten(value as Record<string, unknown>, name))
    } else {
      out[`--${name}`] = String(value)
    }
  }
  return out
}

export function applyTheme(root: HTMLElement = document.documentElement) {
  const vars = flatten(tokens as unknown as Record<string, unknown>)
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
}

/** Helper so components can read a token in JS (e.g. for GSAP). */
export const t = tokens
