# AGENTS.md — guía para agentes de código

## Qué es este repo
Landing de **gotoxy** (software a medida, integraciones y automatización con IA, Rosario) construida sobre la estructura y animaciones de una landing de agencia de referencia, en **React 19 + Vite 6 + TanStack Router (file-based) + TypeScript strict**. El copy y los casos vienen de gotoxy.dev e Instagram (@gotoxy.dev); las imágenes de proyecto se generan en el navegador (ver `scripts/media-generator.html`).

## Comandos
- `npm install`
- `npm run dev` → http://localhost:5173
- `npm run build` → `tsc -b && vite build` (debe pasar sin errores antes de dar por terminada cualquier tarea)
- Deploy: cada push a `master` publica en https://gotoxy-dev.github.io/ (repo `gotoxy-dev/gotoxy-dev.github.io`, workflow `.github/workflows/deploy.yml`, pnpm + Node 24). El build copia `index.html` a `404.html` y a cada ruta del `sitemap.xml` (plugin `staticRoutes` en `vite.config.ts`): al añadir un caso, agregarlo al sitemap para que su URL responda 200.
- Medios: abrir `http://localhost:5173/scripts/media-generator.html` con el dev server, "Generate all" descarga `site-media.zip` → descomprimir en `public/assets/`. `__generateOg()` descarga `og.jpg` → `public/og.jpg`. `__generateProject(n, stillsOnly)` regenera solo el proyecto `n` (1–6). Las capturas reales de los sitios de clientes viven en `public/assets/cases/<slug>/screens/` (desktop) y `screens-mobile/` (375px) y se muestran dentro del laptop y del teléfono. (`scripts/generate-assets.py` es la versión antigua en Python y requiere ffmpeg.)

## SEO
- Metadatos estáticos en `index.html`; por ruta, `src/seo.ts` (`useSeo`) actualiza title/description/canonical/OG/Twitter e inyecta JSON-LD (Organization, WebSite, ItemList en home; Article + BreadcrumbList en cada caso).
- `public/robots.txt`, `public/sitemap.xml` y `public/llms.txt` (resumen para LLM). Al añadir un caso: `caseStudies` en `site.ts` + entrada en `sitemap.xml` y `llms.txt`.

## Reglas de arquitectura (no romper)
1. **Tokens centralizados**: `src/theme/tokens.ts` es la única fuente de colores, tipografías, escala, spacing, easings, duraciones, z-index y breakpoints. `applyTheme()` los inyecta como CSS vars (`--color-text`, `--type-h2-size`, `--motion-ease-expo`…). **Nunca** hardcodear colores/tamaños en componentes o CSS; agregar el token y usar la var.
2. **Contenido centralizado y bilingüe**: `src/content/site.ts` (EN) y `src/content/site.es.ts` (ES, voseo como gotoxy.dev) contienen todo el texto, links y rutas de media de cada sección con la misma forma (`SiteContent`). Los componentes lo leen con `useContent()` / `useLanguage()` de `src/i18n.tsx` (idioma persistido en localStorage, selector ES | EN en el Navbar). Al cambiar un texto, cambiarlo en los dos archivos.
3. **Rutas**: `src/routes/` (file-based). `src/routeTree.gen.ts` lo genera el plugin de TanStack en dev/build — no editarlo a mano.
4. **Estilos**: CSS Modules por componente (`X.module.css`). Clases globales compartidas (`.container`, `.pill`, `.crop`, `.hairline`, `.ulink`, `.t-*`) viven en `src/styles/global.css`; dentro de un módulo se referencian con `:global(.pill)`.
5. **Animaciones**: `src/hooks/useReveal.ts` (GSAP + ScrollTrigger) anima descendientes con `data-reveal="line|fade|scale-x"`; el texto que hace slide-up va envuelto en `<span class="crop">`. Acordeones y expansiones usan `grid-template-rows/columns` animadas en CSS. Respetar `prefers-reduced-motion`.
6. Alias `@/` → `src/`.

## Mapa de componentes
`Navbar` · `Hero` (+ `ParticleMark` canvas: la G del logo en 3D hecha de partículas, con canto redondeado (variante `pillow` de `markSampling.ts`, muestreada en un Web Worker vía `markCloud.ts` con la misma separación en px a cualquier tamaño; en el Hero `fitViewport` la dimensiona por el alto del viewport y con el mouse al 50 % la G queda de frente; las otras variantes se comparan en `/design`, página interna sin link ni sitemap); mouse-X la gira con inercia y la velocidad del puntero empuja las partículas con física de resortes; parámetros en `tokens.particles`) · `Projects` (video autoplay solo en viewport; los casos con `media.screenshot` muestran su captura en `BrowserFrame`; al click cada tarjeta abre su caso con una View Transition (la media se achica al visual izquierdo y el panel se abre) y al cerrar (X, Escape, atrás) la animación se invierte hasta la tarjeta, que se centra sola; el router solo anima home ⇄ caso (`defaultViewTransition` en `main.tsx`), nombres y detección de entrada/salida en `src/transitions.ts`; `ScrollTrigger.clearScrollMemory("manual")` en `motion.ts` evita que el navegador restaure el scroll por su cuenta, estilos `::view-transition-*` en `global.css`, tiempos en `tokens.motion.caseStudy.open`) · `Clients` (acordeones + marquee) · `Awards` (acordeones + imagen sticky) · `Cta` · `Insights` (hover expande thumbnail) · `Footer` · `Logo`.

## Pendiente / ideas de continuación
- Reemplazar los reels generados por grabaciones reales de cada producto; convertir WebM → MP4 cuando haya ffmpeg (Safari < 17).
- Página `/our-story` si hace falta.
- Opcional: smooth scroll (Lenis), preloader, formulario de contacto.
- Verificar visualmente en desktop 1536px y mobile 390px tras cada cambio.
