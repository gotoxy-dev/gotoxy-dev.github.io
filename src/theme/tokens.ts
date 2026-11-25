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
    /* brands shown by name in the clients marquee (colors read from each brand's own site) */
    brand: {
      whatsapp: '#25D366',
      moodle: '#F98012',
      mercadoLibre: '#FFE600',
    },
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
    /** Hero particle "G" behind the headline */
    heroParticle: '#e8e6e3',
    pill: '#969494', // outline of tag pills
    pillHover: 'rgba(255,255,255,0.2)', // READ / CLOSE button background on hover
    overlay: 'rgba(0,0,0,0.6)',
    /** Phones: navbar backdrop once the page leaves the top (blurred, see layout.nav.blur) */
    navBg: 'rgba(0,0,0,0.72)',
    /**
     * Instituto CAM product mockups (src/components/showcase/cam): the panel's own palette
     * (navy bar, white cards on a light page, status pills) and the presentation backdrop.
     */
    cam: {
      /* presentation backdrop: near-black like the other projects, a faint navy cast and blue glow */
      stage: '#0c111c',
      stageDeep: '#030407',
      stageGlow: 'rgba(47,111,237,0.22)',
      /** Report chart bars: top of their gradient (the bars stay CAM blue on any backdrop) */
      chartTop: '#1d4fd8',
      navy: '#1c2740',
      navyText: '#c9d3ea',
      blue: '#2f6fed',
      blueSoft: '#e6eefe',
      page: '#f3f5f9',
      card: '#ffffff',
      line: '#e2e6ee',
      text: '#1c2740',
      muted: '#7b859a',
      faint: '#c4cad6',
      green: '#1d9a55',
      greenSoft: '#e1f4e8',
      amber: '#b97c0c',
      amberSoft: '#fcf1d9',
      red: '#cf4040',
      redSoft: '#fae3e3',
      chatBg: '#ece5dc',
      chatOut: '#d9fdd3',
      chatHead: '#0f5d52',
      whatsapp: '#25d366',
      /* WhatsApp on Android (light theme): teal header, beige wallpaper, its own greys and ticks */
      waHead: '#008069',
      waWallpaper: '#efeae2',
      waDoodle: '#d9d1c4',
      waMeta: '#667781',
      waTick: '#53bdeb',
      waLink: '#027eb5',
      waPanel: '#f0f2f5',
      waChip: '#e1f2fb',
      /* desktop tools in the problem chapter (Windows 11 light): spreadsheet green, Mica surfaces, accent blue */
      xlGreen: '#107c41',
      xlGrid: '#e1e1e1',
      xlNote: '#fff4c2',
      winMica: '#f3f3f3',
      winKey: '#f9f9f9',
      winKeyPress: '#dadada',
      winBorder: '#e0e0e0',
      winText: '#1b1b1b',
      winMuted: '#616161',
      winAccent: '#005fb8',
      sheetHead: '#e9edf3',
      sheetGrid: '#d5dbe5',
      phone: '#0e1117',
      shadow: 'rgba(6,14,40,0.45)',
      /* results illustrations, on the case page's dark visual */
      before: '#7b7979',
      after: '#7fb0ff',
    },
  },

  font: {
    /** Reference uses "Polysans Slim" (commercial). Inter Tight 300 has the same width ("DESIGN THAT" = 727px at 117px). */
    sans: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
    /** Handwritten "Agency" word next to the logo. */
    script: "'Homemade Apple', 'Caveat', cursive",
    /**
     * Brand typefaces. gotoxy: the wordmark of our logo (also the cards' "View case study"). Clients:
     * the face each brand sets its name in on its own site (project card titles, next to the logo).
     */
    brand: {
      gotoxy: {
        family: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
        weight: 400,
        letterSpacing: '-0.02em',
        textTransform: 'lowercase',
      },
      japonInBox: { family: "'DM Sans', Arial, sans-serif", weight: 700, letterSpacing: '0.015em' },
      institutoCam: { family: "'Montserrat', Arial, sans-serif", weight: 700, letterSpacing: '0' },
    },
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
    /**
     * Phones (≤ 767 px, one tier). The hero headline stays the largest text: it is capped at 12.2vw so
     * the longest Spanish word ("CONSTRUIMOS") fits the 20px gutters, and every size below grows with a
     * smaller vw share, so it stays under the hero at any phone width (320 px: 39 > 36.8 > 33.6 > 32).
     * Section titles never shrink as the screen widens: 42px from 400px up, the tablet floor of `h2`.
     */
    phone: {
      display: { size: 'min(64px, 12.2vw)' }, // hero headline (Hero.module.css sets the same value)
      closing: { size: 'min(56px, 11.5vw)', lineHeight: 1 }, // footer "Let's talk" (reference 64px, capped under the hero)
      h2: { size: 'min(42px, 10.5vw)', lineHeight: 0.96 },
      lead: { size: '20px', lineHeight: '24px' }, // reference `.h3-mobile`
      caption: { size: '12px', lineHeight: 1.4 },
    },
  },

  /** Layout measured on the reference at 1536px (60px side gutter, full-width containers). */
  layout: {
    containerMax: 'none',
    gutter: 'clamp(20px, 3.906vw, 60px)',
    navHeight: '88px',
    navHeightTablet: '76px', // reference `.navbar-wrapper` ≤991px
    navHeightMobile: '51px', // reference `.navbar-wrapper` on phones (≤ 767 px here: one phone tier)
    nav: {
      /** Phones: once the page has scrolled this far (px) the bar gets its blurred backdrop (color.navBg) */
      solidAfter: 8,
      blur: '14px',
      /** Desktop menu items: always shown within this distance of the top (px); past it they hide while
          scrolling down and come back while scrolling up, once the scroll has moved `hideDelta` px one way */
      hideAfter: 80,
      hideDelta: 6,
    },
    /** Minimum touch target (Apple HIG / WCAG 2.5.5); smaller controls get a larger hit area (`.tap-area`) */
    tapMin: '44px',
    /** Trailing arrow of small links (reference `.footer-arrow`) */
    linkArrow: '11px',
    hero: {
      padTop: '14.03vw',
      padBottom: '19.44vw',
      canvasWidth: '127.7vw',
      canvasHeight: '63.9vw',
      canvasLeft: '-36.7vw',
      canvasTop: '3.75vw',
      /**
       * Phones (≤ 767 px): the particle G's canvas is a square centred across the screen, its centre
       * this far below the hero top, behind the headline block (390 px: headline 111–396 px). The G is
       * at most 0.71 × the square wide at any angle (≈ 57 px clear of each edge at 390 px), 0.73 × tall.
       */
      phone: {
        canvasSize: 'min(100vw, 420px)',
        markCenter: '250px',
      },
    },
    project: {
      gap: '4.167vw', // margin between cards
      inner: '0.833vw', // line → title row → media
      /** Card media of a website case: its capture in a browser window, over a blurred copy */
      browserWidth: '70%',
      /** Phones: the card is one screen tall, so its window fills more of the media than on the stacked case cover (which keeps `browserWidth`) */
      phoneBrowserWidth: '90%',
      /** Height of the brand logo beside a card's title */
      brandLogo: '22px',
      /** Phones (≤ 767 px): card media box (reference phone cards 335 × 215); the stacked case cover copies it */
      phoneRatio: '3 / 2',
      /**
       * Presentation card (a project with `feature` copy): description on the left, the product's
       * presentation image on the right (reference noomo "Fighting hurricanes" slide).
       */
      split: {
        columns: '5fr 7fr',
        gap: '4.167vw',
        mediaRatio: '1 / 1',
        /** …never taller than the screen below the navbar, so the whole slide fits in one view */
        mediaMaxHeight: 'calc(100svh - 2 * var(--layout-navHeight))',
        /** Phones: the presentation card's image may be shorter than the reference box so the card fits a short screen; never shorter than this */
        phoneMediaMin: '160px',
        titleSize: 'clamp(32px, 3.75vw, 64px)',
        titleLine: 1,
        textSize: 'clamp(15px, 1.25vw, 20px)',
        textLine: 1.35,
        textMax: '34em',
        titleGap: '2.222vw',
        tabletGap: '32px',
        phoneGap: '20px',
        /** Phones: the image comes first (like every other card), then a smaller title */
        phoneTitleSize: '28px',
        phoneTitleLine: 1.05,
      },
    },
    /**
     * Product visuals drawn in code (src/components/showcase). Mockups are drawn in em on a design
     * stage `stage` em wide; the stage's font-size scales it to its box (cover or contain).
     */
    showcase: {
      stage: 100,
      /** Presentation board: the grid of screens, tilted */
      tilt: 'perspective(240em) rotateX(22deg) rotateZ(-14deg)',
      /**
       * Home card hover (CamBoard `zoomOnHover`): the board straightens from `boardTilt` to
       * `boardFlat` (same function list, so it interpolates), and the frame's clip opens by
       * `boardBleedX` / `boardBleedY` beyond its square, the overflow fading out at the edges.
       */
      boardTilt: 'translate(-40%, -47%) perspective(240em) rotateX(22deg) rotateZ(-14deg) scale(1)',
      boardFlat: 'translate(-50%, -50%) perspective(240em) rotateX(0deg) rotateZ(0deg) scale(0.74)',
      /** Opening the case from the card: the 3 × 2 grid flat, level and pulled back (same function list) */
      boardRow: 'translate(-50%, -50%) perspective(240em) rotateX(0deg) rotateZ(0deg) scale(0.56)',
      /**
       * Case cover: the flat grid pulled back further, faint and with depth. Depth per screen
       * (0 far … 1 near, in board order): opacity range [far, near], blur below
       * `boardBlurBelow` up to `boardBlurMax` em.
       */
      boardCover: 'translate(-50%, -50%) perspective(240em) rotateX(0deg) rotateZ(0deg) scale(0.5)',
      boardDepths: [0.85, 0.35, 0.7, 0.55, 1, 0.15],
      boardCoverOpacity: [0.6, 0.9],
      boardBlurBelow: 0.45,
      boardBlurMax: 0.15,
      boardBleedX: '9%',
      boardBleedY: '5%',
      /** where the square starts inside the bleed box: bleed / (100% + 2 × bleed) → 9/118, 5/110 */
      boardMaskX: '7.6%',
      boardMaskY: '4.5%',
      /**
       * Story film: the 3D world is drawn in em where 1em = 1 % of the frame's width, and the
       * camera's perspective is in those em. Overlays (section title, band, stats) use cq units
       * and px. Each section's title enters large in the centre, travels to the top-left band and
       * shrinks to `filmTitleSize`; the world's centre sits in the area below the band (measured,
       * `filmWorldTop` until then) and the camera fits each screen inside that area.
       */
      filmPerspective: 160,
      filmWorldTop: '56%',
      filmWhipBlur: 0.9,
      filmTitleSize: 'clamp(20px, 4.6cqw, 40px)',
      /** Problem beats' caption (lower third, inside the frame): at least 14 px on phones, 16+ on desktop */
      filmBeatSize: 'clamp(14px, calc(1.4cqw + 8px), 20px)',
      filmBeatPad: 'clamp(12px, 2.5cqw, 22px)',
      /** Scale of the title in the centre, capped so the word keeps a margin inside the frame */
      filmTitleBig: 2.6,
      /** Subtitle under the big title on the entry card (the section's caption) */
      filmSubtitleSize: 'clamp(14px, 2.6cqw, 22px)',
      filmSubtitleWidth: 'min(82%, 34em)',
      filmSubtitleGap: 18,
      filmTitleFit: 0.86,
      filmBandPad: 'clamp(12px, 3cqw, 24px)',
      filmHudSize: '11px',
      filmStatSize: 'clamp(22px, 7.5cqmin, 88px)',
      filmStatLabelSize: '13px',
      filmDotPx: 2.6,
      filmDprMax: 2,
      /** Story (animated explainer): caption and controls below the stage, px */
      captionSize: '15px',
      captionTitleSize: 'clamp(18px, 1.6vw, 26px)',
      controlSize: '12px',
      controlGap: '16px',
      storyPad: 'clamp(20px, 2.5vw, 40px)',
      /** Story caption: readable line length */
      storyCaptionMax: '36em',
      /** Scroll-driven story (split layout, motion allowed): screens of scroll that play the whole film while its chapter stays pinned */
      filmScrollScreens: 8,
      /** Results illustrations: base size grows with the visual's width */
      outcomeSize: 'clamp(13px, 1.55cqi, 17px)',
      outcomeIcon: '3.4em',
    },
    /**
     * Browser window around website captures (BrowserFrame: home cards, case covers and closings).
     * Its chrome is drawn in `unit`s: 1 px from a 480 px wide window up (desktop and tablets, as
     * before), scaled down in proportion below that (phones), so a 245 px window on a phone is a
     * smaller copy of the desktop window instead of a heavier one. `unit` is in cqi (1 % of the
     * window's width: the frame is a size container). Sizes below are in units; `urlMin` floors the URL.
     */
    browser: {
      unit: 'min(1px, 100cqi / 480)',
      radius: 12,
      bar: 34,
      barPad: 14,
      dot: 10,
      dotGap: 7,
      urlSize: 11,
      urlLine: 20, // the body line-height the URL used to inherit
      urlMin: '7px',
      urlPadY: 4,
      urlPadX: 18,
      urlRadius: 6,
      /** Drop shadow offset and blur (vw: it shrinks with the screen, like the window) */
      shadow: '0 2.4vw 4vw',
    },
    clients: {
      padTop: '6.944vw',
      titleBottom: '4.167vw',
      rowHeight: '74px',
      marqueePad: '8.5vw',
      /** Marquee logos: image height and the size of the brands shown by name */
      logoHeight: '44px',
      logoText: '26px',
      /** READ / CLOSE pill (reference .21vw .69vw); phones get px, the vw values collapse to ≈ 1 × 3 px */
      readPad: '0.208vw 0.694vw',
      phone: {
        readPad: '6px 14px',
        logoHeight: '26px',
        logoText: '16px',
      },
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
      entryPad: '1vw', // entry row padding (top and bottom)
      /** Phones (≤ 767 px, reference ≤ 479 px): px spacing; the whole row toggles, at least layout.tapMin tall */
      phone: {
        padTop: '40px',
        padBottom: '100px',
        listTop: '40px',
        listBottom: '30px', // gap above "running in production today" (tablet value; the reference had none)
        rowPad: '20px',
        entryPad: '12px',
      },
    },
    cta: {
      eyebrowBottom: '4.167vw',
      wrapWidth: '80.35vw',
      wrapBottom: '5.556vw',
      sectionBottom: '17.708vw',
      /** Tablets: LET'S TALK at most this size (reference 48px), never above the headline (`type.h2`) */
      tabletButton: '48px',
      /** Phones (≤ 767 px, reference ≤ 479 px); LET'S TALK uses the headline size, `type.phone.h2` */
      phone: {
        eyebrowBottom: '40px',
        wrapBottom: '40px',
        sectionBottom: '110px',
      },
    },
    insights: {
      headHeight: '5.37vw',
      itemPadTop: '2.222vw',
      textHeight: '14.236vw',
      textBottom: '2.778vw',
      textWidth: '55.5vw',
      /** Line icon of each service (`ServiceIcon`): square side and hairline stroke */
      iconSize: '6.944vw',
      iconStroke: '1.25px',
      /** rest offsets of the hover interaction (textShift = icon + gap to the text) */
      iconShift: '-4vw',
      textShift: '-10.417vw',
      /** Touch screens and tablets show every service with its icon at rest (the desktop hover state) */
      tabletIconSize: '64px',
      tabletGap: '32px',
      phone: {
        iconSize: '48px',
        itemPad: '32px', // above the icon and below the tag (the tablet item padding)
        itemGap: '20px', // icon → text
        moreTop: '40px', // last item → "Book a call" pill
      },
    },
    footer: {
      padTop: '2.6vw',
      touchTop: '3.6vw',
      bottomTop: '5.9vw',
      /** Back-to-top circle (its hit area grows to layout.tapMin) */
      backTop: '22px',
      /** Phones (reference ≤479px): gap above / below the link list, copyright spacing */
      phoneGap: '40px',
      phoneBottom: '15px',
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
      /** The goal chapter's reel (split visual and stacked layout) */
      reelRatio: '16 / 9',
      /**
       * Stacked layout (below lg: phones and tablets). Sizes and gaps in px: the panel's vw values
       * above are measured at 1536px and collapse to a few px on a phone.
       */
      stack: {
        padTop: '72px',
        padBottom: '60px',
        gap: '32px',
        titleSize: '36px',
        headingSize: '24px',
        headingGap: '16px',
        paragraphSize: '15px',
        capsGap: '12px',
        labelSize: '12px',
        valueSize: '14px',
        rowGap: '12px',
        rowPadBottom: '12px',
        /** External link and next project (desktop `.caseLink`: caps + ↗), at least layout.tapMin tall */
        linkSize: '14px',
        /** Cover / closing visual: page captures are 900×1100 */
        coverRatio: '9 / 11',
        /**
         * Website captures in a browser window: the same box as the phone card's media
         * (layout.project.phoneRatio) and its window width, so the card → case morph is a plain move.
         */
        framedRatio: 'var(--layout-project-phoneRatio)',
        closeSize: '20px',
        journeyGap: '16px',
      },
    },
  },

  radius: {
    pill: '100px',
    media: '0px',
  },

  motion: {
    /**
     * Product visuals drawn in code (src/components/showcase). Story: a 3D film in code, seven
     * segments (problem, the five process steps, results) ≈ 81 s of playback, paused when its chapter
     * is left and resumed when it is entered again; a virtual camera cuts between the panel screens floating in 3D.
     * Outcomes: the before / after items rise one after another and their illustrations draw in.
     */
    showcase: {
      /** Story film segments, seconds: problem, signup, cross-check, campaigns, payments, reports, results */
      filmSegmentsSec: [18, 9.5, 9.5, 13.5, 9.5, 9.5, 8],
      /** Whip pan between sets (it ends on the next cut); a cut between screens fades the old one out, then the new one in (no flash) */
      filmWhipSec: 0.3,
      filmCutFadeSec: 0.25,
      /** Section title: enters large in the centre, holds, travels to the top-left, then shrinks; leaves as the next section starts */
      /** Section entry: a full-frame white or black card fades in, the title holds large on it, then the card wipes open while the title travels */
      filmCardInSec: 0.3,
      /** Problem beats' captions: fade in with the beat, crossfade at each beat change */
      filmBeatFadeSec: 0.3,
      filmTitleInSec: 0.3,
      filmTitleHoldSec: 0.8,
      /** Home card board: hover zoom onto the screen nearest the cursor (CamBoard) */
      /** the board straightens and the frame opens (s); the cursor zoom starts once it has */
      boardOpenSec: 1.1,
      boardOpenEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
      /**
       * Card → case: from whatever the board shows (resting, or zoomed on a hover) the screens
       * travel into one row before the view transition; the case cover starts on that row and,
       * once the transition is over, the screens go back to the grid and the board tilts.
       */
      boardRowSec: 0.5,
      boardRowEase: 'power3.inOut',
      boardIntroDelaySec: 1.15,
      boardIntroSec: 0.9,
      /** Story film: built this long after the case page mounts (past the card transition and the cover settling), or as soon as its chapter is in focus */
      filmBuildDelaySec: 2.4,
      /** Scroll-driven story: how long the film takes to catch up with the scroll (GSAP scrub), and one swing of the scroll hint */
      filmScrubSec: 0.5,
      filmHintSec: 1.6,
      /** Case cover depth: each screen floats (yPercent, seconds per swing) */
      boardDriftPercent: 3,
      boardDriftSec: 7,
      boardZoomSec: 0.9,
      boardZoomEase: 'power3.out',
      /** share of the frame the zoomed screen fills, and the zoom cap */
      boardZoomFill: 0.74,
      boardZoomMax: 2.6,
      /** Each section's entry card holds this much longer so its subtitle can be read (the content waits under it) */
      filmEntryExtraSec: 0.5,
      /** The subtitle under the big title comes in this long after it */
      filmSubtitleDelaySec: 0.15,
      filmTitleMoveSec: 0.85,
      filmTitleShrinkSec: 0.35,
      filmTitleOutSec: 0.15,
      filmTitleMoveEase: 'expo.inOut',
      filmCardWipeEase: 'power2.inOut',
      /** Hand-held shake on the hook shots, degrees */
      filmShakeDeg: 1.1,
      filmPopEase: 'back.out(2)',
      filmCrashEase: 'expo.out',
      filmWhipEase: 'power4.inOut',
      /** Particles: records converging into the panel and the burst of messages (fewer on phones), ambient dust */
      filmParticles: 420,
      filmParticlesPhone: 160,
      filmDust: 60,
      filmDustPhone: 28,
      ease: 'power3.out',
      countSec: 1.6,
      outcomeStaggerSec: 0.12,
      outcomeRiseSec: 0.8,
      outcomeDrawSec: 1.4,
      outcomeLiftPx: 24,
    },
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
      /**
       * Phones: the same share of the media as on desktop (80 / 40 px of an 858 px tall media ≈ 9.3 % /
       * 4.7 %); the phone media is ≈ 57 % of the screen width tall, so ≈ 21 / 10 px at 390 px.
       */
      phone: {
        projectTitle: '2.67vw',
        projectMedia: '5.33vw',
      },
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
     * Desktop menu items on scroll (Navbar): scrolling down they all fade out at once in duration.d500,
     * without moving; scrolling up they drop back in from `shift` above, left to right, `stagger` apart.
     * Entry move: duration.d400 outSine, fade: duration.d300 linear (the site's y-fade pairing).
     */
    nav: {
      shift: '14px',
      stagger: '150ms',
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
      /**
       * Opening from a home card (view transition, see src/transitions.ts): the card's media
       * shrinks into the left visual while the panel opens from the right edge towards it,
       * then the panel lines rise in one after another.
       */
      open: {
        duration: '1100ms',
        ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
        /** The rest of the home fades out quickly so the moving card reads on black */
        pageOut: '350ms',
        panelDelay: '250ms',
        panelDuration: '950ms',
        /** Closing (X, Escape, back): the same move reversed; the panel folds back to the right edge */
        panelClose: '700ms',
        textDelaySec: 0.55,
        textSec: 0.8,
        textStaggerSec: 0.07,
        textEase: 'power3.out',
      },
      /**
       * Stacked layout (below lg): the first screen's lines rise in one after another on load (after
       * the morph when opened from a card, with `open` above); each later block rises in as it
       * scrolls into view (useReveal `y-fade`, `offset` = percent of the viewport it must enter).
       */
      stack: {
        liftPx: 28,
        riseSec: 0.8,
        fadeSec: 0.5,
        staggerSec: 0.07,
        ease: 'outQuart',
        offset: 15,
      },
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

  /**
   * Hero particle "G": the logo mark extruded in 3D and sampled into points.
   * Units: logo viewBox units (geometry), CSS px, seconds.
   */
  particles: {
    /**
     * On-screen distance between neighbouring points (CSS px); the mark is sampled to keep it
     * at any size. Touch devices get the coarser one. The sampling step (logo viewBox units)
     * stays within stepMin–stepMax, which caps the point count on very large screens.
     */
    spacing: 3.8,
    spacingTouch: 4.8,
    stepMin: 0.7,
    stepMax: 3,
    /** Hero (`fitViewport`): the mark's box is at most this × the viewport height, centred at this height of it. */
    viewportFit: 1,
    viewportCenter: 0.55,
    /**
     * Touch devices: a height-only viewport change smaller than this fraction of the height (the
     * address bar showing/hiding) keeps the fitted mark and its points as they are.
     */
    viewportSlack: 0.25,
    /** Random offset of each point, as a fraction of the step (hides the grid when rotating). */
    jitter: 0.7,
    /** Extrusion depth of the mark. */
    depth: 18,
    /**
     * Design variants (src/components/markSampling.ts, previewed at /design).
     * wallBand: how close to the outline (units) a point counts as part of the side wall.
     * bevel: radius of the rounded edge of `pillow`, as a fraction of half the depth (1 = fully round).
     * bevelMaxSlope: cap on the extra points a steep part of that edge receives.
     * ringWidth / ringGap / ringSpacing: thickness of a ring, distance between rings and
     * distance between points along a ring, in `rings`.
     */
    wallBand: 0.5,
    bevel: 1,
    bevelMaxSlope: 4,
    ringWidth: 0.6,
    ringGap: 2.6,
    ringSpacing: 1.1,
    /** Logo height / side of the square the canvas fits it in. */
    fill: 0.82,
    /** Forward tilt (rad) so the top faces catch the light. */
    tilt: 0.22,
    /** Dot side in CSS px at the focal plane. */
    dotSize: 1.7,
    /** Opacity range of a dot, from shadow to full light. */
    alphaMin: 0.07,
    alphaMax: 0.6,
    /** Opacity factor for points whose face looks away from the camera. */
    backFace: 0.35,
    /** Extra opacity of a moving point, reached at `glowSpeed` px/s. */
    glow: 0.35,
    glowSpeed: 1400,
    /** Spring that pulls every point to its place on the G (1/s²) and its damping (1/s). */
    stiffness: 55,
    damping: 5.5,
    /** Air drag (1/s): points trail behind when the G spins fast. */
    airDrag: 0.9,
    /** Per-point mass range: heavier points move less and settle slower. */
    massMin: 0.6,
    massMax: 1.6,
    /** Pointer influence radius, as a fraction of the square side. */
    radius: 0.2,
    /** Coupling (1/s) that drags points along with the pointer's velocity. */
    flow: 7,
    /** Radial push per px/s of pointer speed. */
    push: 1.1,
    /** Pointer speed clamp (px/s) and how fast it fades once the pointer stops (1/s). */
    maxPointerSpeed: 4500,
    pointerDecay: 14,
    /** Max distance (fraction of the square side) a point can be pushed from its place. */
    maxOffset: 0.45,
    /** Rotation spring towards the pointer-driven angle (1/s²) and its damping (1/s). */
    spin: 26,
    spinDamping: 8,
    /** Intro: points start scattered this far (fraction of the side) and the G turns in from this angle (rad). */
    introScatter: 0.3,
    introAngle: -1.3,
    /**
     * Auto-rotation (rad/s) of the /design previews, and idle turn of the hero G on touch devices,
     * which starts this long (s) after load and after the finger lets go of it.
     */
    autoRotate: 0.35,
    idleDelay: 2.5,
  },

  z: {
    nav: 999,
    heroCanvas: 0,
    heroText: 2,
  },

  /** Phones are one tier: below `md` (≤ 767 px); tablets `md`–`lg`; desktop from `lg` (992 px). */
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
