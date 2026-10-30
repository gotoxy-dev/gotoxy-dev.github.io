# AGENTS.md — guía para agentes de código

## Qué es este repo
Réplica de una landing de agencia interactiva (estructura + animaciones) en **React 19 + Vite 6 + TanStack Router (file-based) + TypeScript strict**. Todos los recursos y textos son placeholders que el dueño reemplazará por los de su empresa.

## Comandos
- `npm install`
- `npm run dev` → http://localhost:5173
- `npm run build` → `tsc -b && vite build` (debe pasar sin errores antes de dar por terminada cualquier tarea)
- `npm run assets:generate` → regenera placeholders (python3 + Pillow + numpy + ffmpeg)

## Reglas de arquitectura (no romper)
1. **Tokens centralizados**: `src/theme/tokens.ts` es la única fuente de colores, tipografías, escala, spacing, easings, duraciones, z-index y breakpoints. `applyTheme()` los inyecta como CSS vars (`--color-text`, `--type-h2-size`, `--motion-ease-expo`…). **Nunca** hardcodear colores/tamaños en componentes o CSS; agregar el token y usar la var.
2. **Contenido centralizado**: `src/content/site.ts` contiene todo el texto, links y rutas de media de cada sección, tipado. Los componentes solo consumen esos objetos.
3. **Rutas**: `src/routes/` (file-based). `src/routeTree.gen.ts` lo genera el plugin de TanStack en dev/build — no editarlo a mano.
4. **Estilos**: CSS Modules por componente (`X.module.css`). Clases globales compartidas (`.container`, `.pill`, `.crop`, `.hairline`, `.ulink`, `.t-*`) viven en `src/styles/global.css`; dentro de un módulo se referencian con `:global(.pill)`.
5. **Animaciones**: `src/hooks/useReveal.ts` (GSAP + ScrollTrigger) anima descendientes con `data-reveal="line|fade|scale-x"`; el texto que hace slide-up va envuelto en `<span class="crop">`. Acordeones y expansiones usan `grid-template-rows/columns` animadas en CSS. Respetar `prefers-reduced-motion`.
6. Alias `@/` → `src/`.

## Mapa de componentes
`Navbar` · `Hero` (+ `ImageSequence` canvas: intro + mouse-X) · `Projects` (video autoplay solo en viewport) · `Clients` (acordeones + marquee) · `Awards` (acordeones + imagen sticky) · `Cta` · `Insights` (hover expande thumbnail) · `Footer` · `Logo`.

## Pendiente / ideas de continuación
- Reemplazar `public/assets/**` y `site.ts` con recursos y copy reales.
- Páginas internas (`/our-story`, `/projects/$slug`, `/insights/$slug`) como nuevas rutas en `src/routes/`.
- Opcional: smooth scroll (Lenis), preloader, formulario de contacto.
- Verificar visualmente en desktop 1536px y mobile 390px tras cada cambio.
