import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

type CompiledStyle = Readonly<Record<string, unknown>> | false | null | undefined

const elementStyles = stylex.create({
  borderBox: {
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    WebkitTapHighlightColor: 'transparent',
  },
})

export function className(...styles: ReadonlyArray<CompiledStyle>) {
  return stylex.props(elementStyles.borderBox, ...(styles as ReadonlyArray<StyleXStyles>)).className
}

export function stylexProps(...styles: ReadonlyArray<unknown>) {
  return stylex.props(elementStyles.borderBox, ...(styles as ReadonlyArray<StyleXStyles>))
}

export const globalStyles = stylex.create({
  html: {
    scrollBehavior: {
      default: 'smooth',
      '@media (prefers-reduced-motion: reduce)': 'auto',
    },
  },
  body: {
    backgroundColor: '#f4f1eb',
    color: '#171718',
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSynthesis: 'none',
    margin: 0,
    minWidth: 320,
    textRendering: 'optimizeLegibility',
  },
  root: {
    minHeight: '100vh',
  },
  nativeControl: {
    font: 'inherit',
    WebkitTapHighlightColor: 'transparent',
  },
  link: {
    color: 'inherit',
    WebkitTapHighlightColor: 'transparent',
  },
})

export const sharedStyles = stylex.create({
  siteShell: {
    minHeight: '100vh',
  },
  siteHeader: {
    alignItems: 'center',
    backgroundColor: '#f4f1eb',
    borderBottomColor: '#1d1c1a',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 72,
    paddingInline: '5vw',
    position: 'relative',
    transition: 'background 180ms ease, color 180ms ease',
    zIndex: 20,
    '@media (max-width: 780px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: 18,
      paddingBlock: 18,
    },
  },
  headerLiquid: {
    backgroundColor: '#080d22',
    borderBottomColor: 'rgb(255 255 255 / 0.16)',
    color: '#f7fbff',
  },
  headerTexture: {
    backgroundColor: '#d9c8a6',
    borderBottomColor: '#56452f',
    color: '#34291d',
  },
  headerPrint: {
    backgroundColor: '#f2eddf',
    borderBottomColor: '#17140f',
    borderBottomStyle: 'double',
    borderBottomWidth: 3,
    color: '#17140f',
  },
  headerSignal: {
    backgroundColor: '#03110b',
    borderBottomColor: 'rgb(141 255 179 / 0.28)',
    color: '#d8ffe3',
  },
  headerKinetic: {
    backgroundColor: '#d8d9d4',
    borderBottomColor: '#181b1b',
    color: '#181b1b',
  },
  wordmark: {
    color: 'inherit',
    fontFamily: 'Georgia, serif',
    fontSize: '1.7rem',
    fontStyle: 'italic',
    fontWeight: 700,
    textDecoration: 'none',
  },
  wordmarkPrint: {
    fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    fontStyle: 'normal',
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
  },
  wordmarkInstrument: {
    fontFamily: '"Arial Narrow", "Roboto Condensed", ui-sans-serif, sans-serif',
    fontStyle: 'normal',
    fontWeight: 900,
    letterSpacing: '-0.05em',
  },
  siteNav: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    display: 'flex',
    gap: 4,
    '@media (max-width: 780px)': {
      alignSelf: 'auto',
      flexWrap: 'wrap',
    },
  },
  navLink: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    paddingInline: 16,
    textDecoration: 'none',
    textTransform: 'uppercase',
    backgroundColor: {
      default: 'transparent',
      ':hover': '#1d1c1a',
    },
    color: {
      default: '#171718',
      ':hover': '#f4f1eb',
    },
    '@media (max-width: 780px)': {
      padding: 10,
    },
  },
  navLinkActive: {
    backgroundColor: '#1d1c1a',
    color: '#f4f1eb',
  },
  navLiquid: {
    backgroundColor: { ':hover': 'rgb(255 255 255 / 0.13)' },
    boxShadow: { ':hover': 'inset 0 0 0 1px rgb(255 255 255 / 0.18)' },
    color: { default: '#f7fbff', ':hover': '#f7fbff' },
  },
  navLiquidActive: {
    backgroundColor: 'rgb(255 255 255 / 0.13)',
    boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.18)',
    color: 'inherit',
  },
  navTexture: {
    backgroundColor: { ':hover': '#3f3324' },
    color: { default: '#34291d', ':hover': '#f3ead7' },
  },
  navTextureActive: {
    backgroundColor: '#3f3324',
    color: '#f3ead7',
  },
  navPrint: {
    backgroundColor: { ':hover': '#e33624' },
    color: { default: '#17140f', ':hover': '#fffaf0' },
  },
  navPrintActive: {
    backgroundColor: '#e33624',
    color: '#fffaf0',
  },
  navSignal: {
    backgroundColor: { ':hover': 'rgb(141 255 179 / 0.12)' },
    boxShadow: {
      ':hover': 'inset 0 0 0 1px rgb(141 255 179 / 0.35), 0 0 18px rgb(141 255 179 / 0.12)',
    },
    color: { default: '#d8ffe3', ':hover': '#8dffb3' },
  },
  navSignalActive: {
    backgroundColor: 'rgb(141 255 179 / 0.12)',
    boxShadow: 'inset 0 0 0 1px rgb(141 255 179 / 0.35), 0 0 18px rgb(141 255 179 / 0.12)',
    color: '#8dffb3',
  },
  navKinetic: {
    backgroundColor: { ':hover': '#181b1b' },
    color: { default: '#181b1b', ':hover': '#d8d9d4' },
    transform: { ':hover': 'translateY(2px)' },
  },
  navKineticActive: {
    backgroundColor: '#181b1b',
    color: '#d8d9d4',
    transform: 'translateY(2px)',
  },
  landingContainer: {
    marginInline: 'auto',
    maxWidth: 1240,
    paddingInline: '5vw',
  },
  landingHero: {
    paddingBlock: 'clamp(90px, 14vw, 180px)',
  },
  landingTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(3rem, 8vw, 7.5rem)',
    fontWeight: 400,
    letterSpacing: '-0.065em',
    lineHeight: 0.9,
    marginBlock: '24px 40px',
    maxWidth: 1100,
  },
  landingCopy: {
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    lineHeight: 1.55,
    marginLeft: 'auto',
    maxWidth: 570,
  },
  eyebrow: {
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    margin: 0,
    textTransform: 'uppercase',
  },
  grammarIndex: {
    paddingBottom: 120,
  },
  sectionHeading: {
    borderTopColor: 'currentColor',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'grid',
    gap: 16,
    gridTemplateColumns: '1fr 3fr',
    paddingBlock: '20px 36px',
    '@media (max-width: 780px)': {
      gridTemplateColumns: '1fr',
    },
  },
  sectionHeadingTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(2rem, 4vw, 3.8rem)',
    fontWeight: 400,
    letterSpacing: '-0.04em',
    margin: 0,
  },
  grammarGrid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(6, 1fr)',
    '@media (max-width: 780px)': {
      gridTemplateColumns: '1fr',
    },
  },
  grammarCard: {
    borderColor: '#1d1c1a',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 360,
    padding: 28,
    textDecoration: 'none',
    transition: 'transform 160ms ease, box-shadow 160ms ease',
    boxShadow: { ':hover': '8px 8px 0 #1d1c1a' },
    transform: { ':hover': 'translate(-4px, -4px)' },
    '@media (max-width: 780px)': {
      gridColumn: 'auto',
    },
  },
  grammarCardThird: {
    gridColumn: 'span 2',
  },
  grammarCardHalf: {
    gridColumn: 'span 3',
  },
  grammarCardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '3rem',
    fontWeight: 400,
    marginBlock: 'auto 16px',
  },
  grammarCardCopy: {
    lineHeight: 1.5,
  },
  cardLiquid: {
    backgroundImage: 'linear-gradient(145deg, rgb(255 255 255 / 0.4), rgb(143 215 244 / 0.55))',
  },
  cardTexture: {
    backgroundColor: '#c9b58b',
    backgroundImage: 'radial-gradient(circle, rgb(72 52 33 / 0.16) 0 1px, transparent 1.5px)',
    backgroundSize: '8px 8px',
  },
  cardPrint: {
    backgroundColor: '#ef4d3e',
    color: '#fff8e9',
  },
  cardSignal: {
    backgroundColor: '#04120c',
    backgroundImage:
      'linear-gradient(rgb(141 255 179 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(141 255 179 / 0.12) 1px, transparent 1px), radial-gradient(circle at 72% 30%, rgb(141 255 179 / 0.26), transparent 30%)',
    backgroundSize: '22px 22px, 22px 22px, auto',
    color: '#d8ffe3',
    textShadow: '0 0 14px rgb(141 255 179 / 0.28)',
  },
  cardKinetic: {
    backgroundImage:
      'linear-gradient(90deg, rgb(24 27 27 / 0.08) 1px, transparent 1px), linear-gradient(rgb(24 27 27 / 0.08) 1px, transparent 1px), linear-gradient(145deg, #ecece8, #c9cbc5)',
    backgroundSize: '32px 32px, 32px 32px, auto',
    boxShadow: 'inset 0 -8px 0 rgb(24 27 27 / 0.2)',
  },
  cardAction: {
    borderTopColor: 'currentColor',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    fontSize: '0.78rem',
    fontWeight: 700,
    marginTop: 24,
    paddingTop: 16,
    textTransform: 'uppercase',
  },
  grammarPage: {
    color: 'var(--guide-ink)',
    fontFamily: 'var(--guide-font, inherit)',
    minHeight: '100vh',
    overflow: 'hidden',
    paddingInline: 'max(5vw, calc((100vw - 1380px) / 2))',
    position: 'relative',
    '@media (max-width: 780px)': {
      paddingInline: 20,
    },
  },
  grammarHero: {
    display: 'grid',
    gap: 'clamp(40px, 7vw, 100px)',
    gridTemplateColumns: 'minmax(0, 0.9fr) minmax(420px, 1.1fr)',
    minHeight: 'min(850px, calc(100vh - 72px))',
    paddingBlock: 'clamp(70px, 10vw, 130px)',
    '@media (max-width: 980px)': {
      gridTemplateColumns: '1fr',
    },
  },
  grammarHeroCopy: {
    alignSelf: 'center',
  },
  grammarKicker: {
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.16em',
    marginBlock: '0 30px',
    textTransform: 'uppercase',
  },
  grammarHeroTitle: {
    fontFamily: 'var(--guide-display, Georgia, serif)',
    fontSize: 'clamp(4.4rem, 8vw, 8.6rem)',
    fontWeight: 400,
    letterSpacing: '-0.075em',
    lineHeight: 0.82,
    margin: 0,
  },
  grammarIntro: {
    fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)',
    lineHeight: 1.6,
    marginBlock: '44px 32px',
    maxWidth: 580,
  },
  grammarJumpLink: {
    alignItems: 'center',
    color: 'inherit',
    display: 'inline-flex',
    fontSize: '0.76rem',
    fontWeight: 800,
    gap: 16,
    letterSpacing: '0.12em',
    paddingBlock: 10,
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  grammarJumpGlyph: {
    fontSize: '1.25rem',
  },
  sectionNav: {
    borderBlockColor: 'var(--guide-line)',
    borderBlockStyle: 'solid',
    borderBlockWidth: 1,
    display: 'grid',
    gap: 'clamp(24px, 4vw, 64px)',
    gridTemplateColumns: 'minmax(110px, 0.65fr) repeat(3, minmax(0, 1fr))',
    marginBottom: 120,
    paddingBlock: '26px 30px',
    '@media (max-width: 980px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    '@media (max-width: 780px)': {
      gap: 30,
      gridTemplateColumns: '1fr',
      marginInline: 0,
    },
  },
  sectionNavSummary: {
    '@media (max-width: 980px)': {
      gridColumn: '1 / -1',
    },
    '@media (max-width: 780px)': {
      gridColumn: 'auto',
    },
  },
  sectionNavMeta: {
    color: 'var(--guide-muted)',
    display: 'block',
    fontFamily: 'var(--guide-mono, ui-monospace, monospace)',
    fontSize: '0.62rem',
    letterSpacing: '0.1em',
    marginBottom: 13,
    textTransform: 'uppercase',
  },
  sectionNavTitle: {
    display: 'block',
    fontFamily: 'var(--guide-display, inherit)',
    fontSize: '1.2rem',
    fontWeight: 500,
  },
  sectionNavLinks: {
    display: 'grid',
    gap: 8,
    '@media (max-width: 780px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
  sectionNavLink: {
    alignItems: 'center',
    color: 'inherit',
    display: 'flex',
    fontSize: '0.7rem',
    fontWeight: 800,
    justifyContent: 'space-between',
    letterSpacing: '0.08em',
    opacity: { default: 1, ':hover': 0.58 },
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  guideSection: {
    marginBlock: '0 140px',
    marginInline: 'auto',
    maxWidth: 1380,
    scrollMarginTop: 30,
  },
  guideSectionHeading: {
    borderTopColor: 'var(--guide-line)',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'grid',
    gap: 30,
    gridTemplateColumns: 'minmax(70px, 1fr) 3fr',
    paddingBlock: '24px 48px',
    '@media (max-width: 780px)': {
      gridTemplateColumns: '1fr',
    },
  },
  guideSectionIndex: {
    fontFamily: 'var(--guide-mono, ui-monospace, monospace)',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  guideSectionTitle: {
    fontFamily: 'var(--guide-display, Georgia, serif)',
    fontSize: 'clamp(2.7rem, 5vw, 5.5rem)',
    fontWeight: 400,
    letterSpacing: '-0.055em',
    lineHeight: 0.95,
    marginBlock: '0 22px',
  },
  guideSectionDescription: {
    color: 'var(--guide-muted)',
    lineHeight: 1.65,
    margin: 0,
    maxWidth: 680,
  },
  themePicker: {
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  themePickerLabel: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.13em',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  visuallyHidden: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  themePickerOptions: {
    display: 'grid',
    gap: 14,
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    '@media (max-width: 980px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 780px)': {
      gridTemplateColumns: '1fr',
    },
  },
  themePickerOption: {
    backgroundColor: 'var(--control-surface)',
    borderColor: 'var(--control-border)',
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'inherit',
    cursor: 'pointer',
    minHeight: 160,
    padding: 24,
    textAlign: 'left',
    outline: { ':focus-visible': '3px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
  },
  themePickerOptionActive: {
    backgroundColor: 'var(--control-surface-strong)',
    boxShadow: 'var(--control-shadow)',
    outlineColor: 'var(--control-accent)',
    outlineOffset: -2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  themePickerLiquid: {
    backdropFilter: 'blur(var(--generated-liquid-blur, 24px)) saturate(150%)',
    borderRadius: 26,
    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.16)',
    overflow: 'hidden',
    position: 'relative',
    '::before': {
      backgroundImage: 'radial-gradient(circle, var(--liquid-accent), transparent 66%)',
      content: '""',
      filter: 'blur(8px)',
      height: 100,
      opacity: 0.3,
      position: 'absolute',
      right: -25,
      top: -30,
      width: 100,
    },
  },
  themePickerLiquidActive: {
    boxShadow:
      'inset 0 1px 0 rgb(255 255 255 / 0.4), 0 24px 70px rgb(0 0 25 / 0.35), 0 0 38px color-mix(in srgb, var(--liquid-accent) 22%, transparent)',
  },
  themePickerTexture: {
    borderRadius: 3,
    boxShadow: 'inset 0 0 0 4px rgb(255 255 255 / 0.12), 3px 5px 12px rgb(60 42 21 / 0.12)',
    position: 'relative',
    '::after': {
      borderColor: 'currentColor',
      borderStyle: 'dashed',
      borderWidth: 1,
      content: '""',
      inset: 8,
      opacity: 0.18,
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  themePickerTextureActive: { transform: 'translateY(-4px) rotate(-0.4deg)' },
  themePickerPrintOptions: { gap: 0 },
  themePickerPrint: {
    borderColor: 'var(--guide-line)',
    borderRadius: 0,
    borderWidth: '1px 1px 1px 0',
    boxShadow: 'none',
  },
  themePickerPrintFirst: { borderLeftWidth: 1 },
  themePickerPrintActive: {
    backgroundColor: 'var(--print-accent)',
    color: '#fffaf0',
    outlineWidth: 0,
  },
  themePickerPrintDescriptionActive: { color: 'rgb(255 250 240 / 0.76)' },
  themePickerSignal: {
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent 0 4px, rgb(255 255 255 / 0.018) 4px 5px), linear-gradient(140deg, transparent, color-mix(in srgb, var(--signal-emission) 7%, transparent))',
    borderRadius: 1,
    position: 'relative',
    '::after': {
      backgroundColor: 'var(--signal-emission)',
      bottom: 17,
      boxShadow: '0 0 var(--signal-bloom) var(--signal-emission)',
      content: '""',
      height: 2,
      left: 24,
      opacity: 0,
      position: 'absolute',
      transition: 'opacity 180ms ease, width var(--signal-decay) ease',
      width: 0,
    },
  },
  themePickerSignalActive: {
    '::after': { opacity: 'var(--signal-intensity)', width: 'calc(100% - 48px)' },
  },
  themePickerKinetic: {
    borderRadius: 'var(--kinetic-radius)',
    boxShadow:
      '0 calc(var(--kinetic-travel) * 0.35) 0 color-mix(in srgb, var(--kinetic-foreground) 24%, transparent), 0 calc(var(--kinetic-travel) * 0.7) calc(var(--kinetic-mass) * 7px) color-mix(in srgb, var(--kinetic-foreground) 12%, transparent)',
    position: 'relative',
    transition:
      'transform var(--kinetic-duration) cubic-bezier(0.2, 1.4, 0.3, 1), box-shadow var(--kinetic-duration) ease',
    '::before': {
      borderColor: 'var(--guide-line)',
      borderRadius: 'inherit',
      borderStyle: 'solid',
      borderWidth: 1,
      content: '""',
      inset: 7,
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  themePickerKineticActive: {
    boxShadow:
      'inset 0 2px calc(var(--kinetic-mass) * 3px) color-mix(in srgb, var(--kinetic-foreground) 18%, transparent)',
    transform: 'translateY(calc(var(--kinetic-travel) * var(--kinetic-actuation)))',
  },
  themePickerName: {
    display: 'block',
    fontFamily: 'var(--guide-display, inherit)',
    fontSize: '1.6rem',
    marginBottom: 42,
  },
  themePickerDescription: {
    color: 'var(--guide-muted)',
    display: 'block',
    lineHeight: 1.45,
  },
  notFound: {
    paddingBlock: 120,
  },
  notFoundTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    fontWeight: 400,
    letterSpacing: '-0.06em',
  },
})
