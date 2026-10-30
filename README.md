# Studio — agency site replica (React + TanStack Router + TypeScript)

Réplica estructural y de animaciones de una landing de agencia interactiva.
Todos los recursos (logo, imágenes, videos, secuencia 3D del hero, copy) son
**placeholders generados** para que reemplaces por los de tu empresa.

## Stack

- Vite 6 + React 19 + TypeScript (strict)
- TanStack Router (file-based: `src/routes/`, árbol generado en `src/routeTree.gen.ts`)
- GSAP + ScrollTrigger para reveals; CSS Modules para estilos
- Canvas + secuencia de imágenes para el hero (intro + seguimiento del mouse)

## Scripts

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # tsc + vite build  →  dist/
npm run preview
npm run assets:generate  # regenera placeholders (necesita python3 + Pillow + numpy + ffmpeg)
```

## Dónde cambiar cada cosa

| Qué | Archivo |
|---|---|
| **Theme tokens** (colores, tipografías, escala, spacing, easings, duraciones, z-index, breakpoints) | `src/theme/tokens.ts` → se inyectan como CSS vars (`--color-text`, `--type-h2-size`, `--motion-ease-expo`…) por `src/theme/applyTheme.ts` |
| **Contenido de todas las secciones** (nav, hero, proyectos, testimonios, logos, premios, CTA, insights, footer, marca) | `src/content/site.ts` |
| Logo / wordmark | `src/components/Logo.tsx` (SVG inline) |
| Fuentes | `index.html` (Google Fonts: Archivo + Homemade Apple) y `tokens.font` |
| Secuencia del hero | `public/assets/hero-seq/frame_###.webp` + `hero.sequence` en `site.ts` (`frameCount`, `ext`, `pad`) |
| Videos de proyectos | `public/assets/videos/project-0N.mp4` + poster `.jpg` (referenciados en `projects[]`) |
| Imágenes de insights / premios / logos de clientes | `public/assets/insights`, `public/assets/awards`, `public/assets/logos` |

## Secciones y animaciones implementadas

1. **Navbar** fija, transparente, links uppercase con underline on-hover, menú overlay en mobile.
2. **Hero**: titular en 3 líneas con reveal "crop + slide-up" en carga (`useReveal` immediate), caption, y canvas de **secuencia de imágenes** (`ImageSequence.tsx`): precarga, reproduce la secuencia completa como intro y luego mapea la X del puntero a un frame con interpolación.
3. **Proyectos**: por cada card, hairline que crece desde la izquierda al entrar en viewport, nombre con reveal, tags pill con fade, video full-width que **reproduce solo cuando está visible** (IntersectionObserver), ligero zoom on-hover.
4. **What our clients say**: título con reveal, badge "see more on", **acordeones** de testimonios (READ ↔ CLOSE, `grid-template-rows` animado), y **marquee** infinito de logos (pausa on-hover).
5. **Awards**: párrafo intro, **acordeones** con contador `/ 02`, flecha rotando, entradas con stagger y **imagen sticky** a la izquierda que aparece al expandir el grupo; "+50 more awards".
6. **CTA** "Building relationships": eyebrow + titular grande + botón "Let's talk" con flecha animada.
7. **Insights**: lista en la que el ítem activo (hover/focus) **expande su thumbnail** a la izquierda desplazando el título (`grid-template-columns` animado), pill de categoría y flecha.
8. **Footer**: links sociales, back-to-top, "Get in touch ↗", email, copyright.

## Notas

- Las fuentes de la referencia son comerciales; se usan sustitutos libres. Si tienes licencia, cambia `tokens.font.sans`.
- `prefers-reduced-motion` desactiva las animaciones.
- Los videos placeholder son abstractos (4 s, 1280×776, H.264). Sustitúyelos por tus reels manteniendo la proporción ~1.65:1 o ajusta `aspect-ratio` en `Projects.module.css`.
