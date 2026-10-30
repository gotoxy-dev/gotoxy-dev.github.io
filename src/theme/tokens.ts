/**
 * THEME TOKENS — single source of truth.
 *
 * Every visual decision (colors, typography, spacing, motion) lives here and is
 * injected as CSS custom properties by `applyTheme()` (see ./applyTheme.ts).
 * Components never hard-code values: they read `var(--color-text)` etc.
 *
 * Values were measured on the reference site (dark theme, 1536px viewport).
 * Motion values come from the reference Webflow IX2 export
 * (see reference/noomo/spec/home-animations-unique.md).
 */

export const tokens = {
  color: {
    bg: '#000000',
    surface: '#0a0a0a',
    text: '#d2cfcf', // rgb(210,207,207) — headlines & body
    textStrong: '#ffffff', // nav links
    textMuted: '#969494', // rgb(150,148,148) — captions, tags, roles
    textDim: '#575757', // secondary hairlines / footer small print
    line: '#333333', // rgb(51,51,51) — list hairlines
    lineStrong: '#575757',
    lineHover: '#ffffff', // award rows on hover
    pager: '#484848', // case-study pager dash / inactive label
    caseVideoBg: '#161616',
    accent: '#d2cfcf',
    pill: '#969494', // outline of tag pills
    pillHover: 'rgba(255,255,255,0.2)', // READ / CLOSE button background on hover
    overlay: 'rgba(0,0,0,0.6)',
  },

  font: {
    /** Reference uses "Polysans Slim" (commercial). Archivo 300/400 is the free stand-in. */
    sans: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
    /** Handwritten "Agency" word next to the logo. */
    script: "'Homemade Apple', 'Caveat', cursive",
    weight: {
      light: 300,
      regular: 400,
    },
  },

  /** Fluid type scale. Measured px at 1536px wide → vw. */
  type: {
    display: { size: 'clamp(56px, 7.64vw, 128px)', lineHeight: 1, letterSpacing: '-0.01em' }, // 117px hero h1
    h2: { size: 'clamp(40px, 5.5vw, 92px)', lineHeight: 1, letterSpacing: '-0.01em' }, // 84px section titles, CTA, footer
    h3: { size: 'clamp(26px, 3.333vw, 56px)', lineHeight: 1, letterSpacing: '-0.005em' }, // 51px insights titles
    lead: { size: 'clamp(20px, 2.222vw, 36px)', lineHeight: 1.1 }, // 34px awards paragraph
    body: { size: 'clamp(16px, 1.3vw, 22px)', lineHeight: 1.25 }, // testimonials
    nav: { size: '14px', lineHeight: '0.9', letterSpacing: '0.04em' },
    small: { size: '14px', lineHeight: '20px', letterSpacing: '0' },
    caption: { size: '14px', lineHeight: '1.6', letterSpacing: '0.02em' }, // hero caption, CTA eyebrow, "+50 more"
    tag: { size: '11px', lineHeight: '1.5', letterSpacing: '0.04em' },
  },

  /** Layout measured on the reference at 1536px (60px side gutter, full-width containers). */
  layout: {
    containerMax: 'none',
    gutter: 'clamp(20px, 3.906vw, 60px)',
    navHeight: '88px',
    /** Trailing arrow of small links (reference `.footer-arrow`) */
    linkArrow: '11px',
    hero: {
      padTop: '14.03vw',
      padBottom: '19.44vw',
      canvasWidth: '127.7vw',
      canvasHeight: '63.9vw',
      canvasLeft: '-36.7vw',
      canvasTop: '3.75vw',
    },
    project: {
      gap: '4.167vw', // margin between cards
      inner: '0.833vw', // line → title row → media
    },
    clients: {
      padTop: '6.944vw',
      titleBottom: '4.167vw',
      rowHeight: '74px',
      marqueePad: '8.5vw',
    },
    awards: {
      padTop: '6.458vw',
      padBottom: '11.111vw',
      textWidth: '50%',
      listOffset: '31vw', // list margin-left
      listTop: '7.222vw',
      listBottom: '2.778vw',
      rowHeight: '50px',
      previewWidth: '13.889vw',
      previewHeight: '8.194vw',
      previewLeft: '-53%',
    },
    cta: {
      eyebrowBottom: '4.167vw',
      wrapWidth: '80.35vw',
      wrapBottom: '5.556vw',
      sectionBottom: '17.708vw',
    },
    insights: {
      headHeight: '5.37vw',
      itemPadTop: '2.222vw',
      textHeight: '14.236vw',
      textBottom: '2.778vw',
      textWidth: '55.5vw',
      imageWidth: '26.389vw',
      imageHeight: '14.792vw',
      /** rest offsets of the hover interaction */
      imageShift: '-27vw',
      textShift: '-31vw',
    },
    footer: {
      padTop: '2.6vw',
      touchTop: '3.6vw',
      bottomTop: '5.9vw',
    },
    /** Case-study page (reference `.case-wrapper` / `.project-section`) */
    caseStudy: {
      panelPadTop: '5.556vw',
      panelPadSide: '4.167vw',
      panelPadBottom: '4.167vw',
      titleSize: '3.194vw',
      headingSize: '2.2vw',
      paragraphSize: '1.111vw',
      valueSize: '0.972vw',
      labelSize: '0.83vw',
      rowGap: '0.833vw',
      rowPadBottom: '0.972vw',
      space: '1.389vw',
      spaceSmall: '0.694vw',
      labelWidth: '46.6%',
      deviceWidth: '38.8%',
      closeSize: '1.389vw',
      closeOffset: '1.389vw',
      pagerOffset: '2.083vw',
      dashWidth: '2.083vw',
      /** Scroll keyframes of the three pages (progress 0..1) */
      scrubSmoothing: 1.7,
    },
  },

  radius: {
    pill: '100px',
    media: '0px',
  },

  motion: {
    /** Webflow IX2 easing names → cubic-bezier (used by CSS and by GSAP via CustomEase). */
    ease: {
      outSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
      outQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      outCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
      outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
      outBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      linear: 'linear',
    },
    /** Durations used by the reference, keyed by their millisecond value. */
    duration: {
      d100: '100ms',
      d200: '200ms',
      d300: '300ms',
      d350: '350ms',
      d400: '400ms',
      d500: '500ms',
      d600: '600ms',
      d700: '700ms',
      d800: '800ms',
      d1000: '1000ms',
    },
    /** Reveal distances (translateY before an element enters). */
    distance: {
      heroLine: '8vw',
      titleLine: '7vw',
      block: '3vw',
      text: '2vw',
      projectTitle: '40px',
      projectMedia: '80px',
      awardEntry: '10px',
      awardPreview: '-8px',
      linkShift: '-10px',
      backTopArrow: '30px',
    },
    /** Webflow "smoothing" (0–100) → GSAP scrub seconds. */
    scrub: {
      default: 1, // smoothing 50
    },
    marquee: {
      durationSec: 28,
    },
  },

  z: {
    nav: 999,
    heroCanvas: 0,
    heroText: 2,
  },

  breakpoints: {
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
  },
} as const

export type Tokens = typeof tokens
export type EaseName = keyof typeof tokens.motion.ease
export type DurationName = keyof typeof tokens.motion.duration

/** `'700ms'` → `0.7` (seconds, for GSAP). */
export const sec = (value: string | number): number =>
  typeof value === 'number' ? value / 1000 : parseFloat(value) / (value.trim().endsWith('ms') ? 1000 : 1)
