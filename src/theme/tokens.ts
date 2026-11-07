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
    textStrong: '#e8e6e3', // nav links (reference rgb(232,230,227))
    textMuted: '#969494', // rgb(150,148,148) — captions, tags, roles
    textDim: '#575757', // secondary hairlines / footer small print
    line: '#333333', // rgb(51,51,51) — list hairlines
    lineStrong: '#575757',
    lineHover: '#ffffff', // award rows on hover
    pager: '#484848', // case-study pager dash / inactive label
    /* SVG phone: brushed titanium rail, black glass bezel */
    phoneMetalLight: '#c9cacd',
    phoneMetalMid: '#7d7f84',
    phoneMetalDark: '#2e3034',
    phoneBezel: '#050505',
    phoneButton: '#5c5e63',
    phoneGlare: 'rgba(255,255,255,0.07)',
    phoneShadow: 'rgba(0,0,0,0.55)',
    /* tap ring reads on light and dark screens: dark ring, white halo */
    tapRing: 'rgba(17,17,16,0.7)',
    tapHalo: 'rgba(255,255,255,0.95)',
    tapFill: 'rgba(17,17,16,0.18)',
    /* mobile journey captions floating over the phone */
    captionBg: 'rgba(12,12,12,0.78)',
    captionEdge: 'rgba(255,255,255,0.1)',
    /* browser window around website captures */
    browserBar: '#1c1c1e',
    browserDot: '#3a3a3d',
    browserUrl: '#2a2a2d',
    browserEdge: 'rgba(255,255,255,0.08)',
    accent: '#d2cfcf',
    pill: '#969494', // outline of tag pills
    pillHover: 'rgba(255,255,255,0.2)', // READ / CLOSE button background on hover
    overlay: 'rgba(0,0,0,0.6)',
  },

  font: {
    /** Reference uses "Polysans Slim" (commercial). Inter Tight 300 has the same width ("DESIGN THAT" = 727px at 117px). */
    sans: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
    /** Handwritten "Agency" word next to the logo. */
    script: "'Homemade Apple', 'Caveat', cursive",
    weight: {
      light: 300,
      regular: 400,
    },
  },

  /** Fluid type scale. Measured px at 1536px wide → vw. */
  type: {
    display: { size: 'clamp(56px, 7.64vw, 128px)', lineHeight: 1, letterSpacing: '0' }, // 117px hero h1, 58.7px on tablets; phones override to 64px max
    h2: { size: 'clamp(42px, 5.5vw, 92px)', lineHeight: 1, letterSpacing: '0' }, // 84px section titles, CTA, footer; 42px on tablets, 48px on phones
    h3: { size: 'clamp(32px, 3.333vw, 56px)', lineHeight: 1, letterSpacing: '0' }, // 51px insights titles; 32px on phones/tablets
    lead: { size: 'clamp(32px, 2.222vw, 36px)', lineHeight: 1.1 }, // 34px awards paragraph; 32px on phones/tablets (reference h3)
    body: { size: 'clamp(16px, 1.3vw, 22px)', lineHeight: 1.25 }, // testimonials
    nav: { size: '14px', lineHeight: '0.9', letterSpacing: '0.04em' },
    small: { size: '14px', lineHeight: '20px', letterSpacing: '0' },
    caption: { size: '14px', lineHeight: '1.6', letterSpacing: '0' }, // hero caption, CTA eyebrow (reference: normal tracking)
    link: { size: '14px', lineHeight: '28px', letterSpacing: '0' }, // footer links
    more: { size: '1.389vw', lineHeight: '1.2', letterSpacing: '0' }, // "More insights" link (21.33px)
    tag: { size: '11px', lineHeight: '1.5', letterSpacing: '0.04em' },
  },

  /** Layout measured on the reference at 1536px (60px side gutter, full-width containers). */
  layout: {
    containerMax: 'none',
    gutter: 'clamp(20px, 3.906vw, 60px)',
    navHeight: '88px',
    navHeightMobile: '51px', // reference `.navbar-wrapper` ≤479px
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
      /* the vh caps only bite on short screens (they equal the vw values at 1536×864) */
      panelPadTop: 'min(5.556vw, 9.8vh)',
      panelPadSide: '4.167vw',
      panelPadBottom: 'min(4.167vw, 7.4vh)',
      titleSize: 'min(3.194vw, 5.7vh)',
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
      /** Journey phone (SVG frame 440×900), bounded by column width and by viewport height */
      phoneWidth: 'min(20vw, 40vh)',
      splitPhoneWidth: 'min(24vw, 41vh)',
      /** Website captures in a browser window (cover, results) */
      browserWidth: '84%',
      browserRadius: '12px',
      browserBar: '34px',
      /** Blurred copy of the visual behind it, for colour and depth */
      ambientBlur: '80px',
      ambientOpacity: '0.15',
      stepCounterSize: '12px',
      stepGap: '1.25vw',
      stepTitleSize: '1.6vw',
      /** Extra wait of the opening step; 0 so the title opens with the phone's slide (both after journey.startDelaySec) */
      stepRevealDelay: '0ms',
      railWidth: '1px',
      /** App screens are laid out 390px wide; the phone shows a 54px status bar and 790px of page */
      appWidth: '390px',
      appStatusBar: '54px',
      appView: '790px',
      tapSize: '44px',
      /** Mobile journey: one screen, phone width and caption width */
      mobilePhoneWidth: 'min(62vw, 33svh)',
      captionWidth: 'min(340px, calc(100vw - 48px))',
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
    /**
     * Case-study page. Scrolling snaps natively (CSS scroll-snap, one section per gesture);
     * when the visible section changes, one short tween swaps the panel page, pager and phone screen.
     */
    caseStudy: {
      /** Panel page / pager swap: the old page leaves first, the new one follows */
      swapSec: 0.6,
      swapOutSec: 0.35,
      swapInDelaySec: 0.25,
      swapEase: 'power2.out',
      /** Vertical travel of the incoming / outgoing panel page (follows scroll direction) */
      pageLiftPx: 60,
      /** Incoming panel page: its lines rise in one after another */
      lineLiftPx: 28,
      lineStaggerSec: 0.07,
      /** Left visuals, scrubbed by the scroll: the incoming one settles from a slight zoom, the
          one it covers recedes (shrinks around its centre, so it stays centred) and dims behind it */
      visualZoom: 1.08,
      visualRecede: 0.88,
      visualDim: 0.35,
      /** Closing capture with a zoom: pull back to the whole view once its chapter is entered */
      closingZoomSec: 1.6,
      closingZoomDelaySec: 0.15,
      fadeInSec: 0.5,
      /** Journey step playback inside the phone: slide in, pause, scroll to the button, tap */
      journey: {
        /** Beat before each step; then the phone slides and the title opens together */
        startDelaySec: 0.12,
        slideSec: 0.45,
        holdSec: 0.12,
        scrollSec: 0.55,
        tapSec: 0.4,
        ease: 'power2.out',
      },
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
