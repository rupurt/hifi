import * as stylex from '@stylexjs/stylex'

export const liquidStyles = stylex.create({
  page: {
    '--guide-ink': '#f7fbff',
    '--guide-muted': 'rgb(231 241 255 / 0.66)',
    '--guide-line': 'rgb(255 255 255 / 0.2)',
    '--guide-display': '"Avenir Next", Inter, "Helvetica Neue", ui-sans-serif, sans-serif',
    '--guide-font': 'Inter, ui-sans-serif, sans-serif',
    '--guide-mono': '"SFMono-Regular", Consolas, monospace',
    '--generated-control-surface': 'var(--liquid-glass)',
    '--generated-control-surface-strong': 'var(--liquid-glass-strong)',
    '--generated-control-border': 'rgb(255 255 255 / 0.22)',
    '--generated-control-accent': 'var(--liquid-accent)',
    '--generated-control-accent-contrast': 'var(--liquid-accent-contrast)',
    '--generated-control-text': '#f7fbff',
    '--generated-control-muted': 'rgb(231 241 255 / 0.66)',
    '--generated-control-shadow':
      'inset 0 1px 0 rgb(255 255 255 / 0.2), 0 24px 60px rgb(0 0 28 / 0.3)',
    '--control-backdrop-filter':
      'blur(var(--generated-liquid-blur, 28px)) saturate(150%)',
    '--control-danger': '#ff7c99',
    '--control-interactive-backdrop-filter':
      'blur(min(var(--generated-liquid-blur, 16px), 16px))',
    '--control-warning': '#ffd184',
    '--control-positive': '#70ebc5',
    backgroundColor: '#080d22',
  },
  generatedPage: (values: {
    readonly accent: string
    readonly backgroundImage: string
    readonly blur: string
    readonly controlRadius: string
    readonly glass: string
    readonly glassStrong: string
  }) => ({
    '--control-radius': values.controlRadius,
    '--generated-liquid-blur': values.blur,
    '--liquid-accent': values.accent,
    '--liquid-accent-contrast': '#07101e',
    '--liquid-control-radius': values.controlRadius,
    '--liquid-glass': values.glass,
    '--liquid-glass-strong': values.glassStrong,
    backgroundImage: values.backgroundImage,
  }),
  atmosphere: { inset: 0, overflow: 'hidden', pointerEvents: 'none', position: 'absolute' },
  contentLayer: { position: 'relative', zIndex: 1 },
  orb: { borderRadius: '50%', filter: 'blur(12px)', opacity: 0.74, position: 'absolute' },
  orbA: {
    backgroundImage:
      'radial-gradient(circle at 35% 30%, #fff, #38adff 23%, #7745e8 62%, transparent 72%)',
    height: 620,
    right: -170,
    top: 80,
    width: 620,
  },
  orbB: {
    backgroundImage:
      'radial-gradient(circle at 40% 35%, #ffd9f2, #ff4eaf 30%, #5530d5 62%, transparent 72%)',
    height: 470,
    left: -240,
    top: 620,
    width: 470,
  },
  orbC: {
    backgroundImage:
      'radial-gradient(circle at 40% 35%, #d7fff8, #1fd8c3 28%, #154c88 62%, transparent 72%)',
    height: 560,
    right: '18%',
    top: 1550,
    width: 560,
  },
  grid: {
    backgroundImage:
      'linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)',
    backgroundSize: '64px 64px',
    inset: 0,
    maskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)',
    position: 'absolute',
  },
  heroEmphasis: {
    color: 'var(--liquid-accent)',
    fontStyle: 'normal',
    textShadow: '0 0 45px color-mix(in srgb, var(--liquid-accent) 45%, transparent)',
  },
  heroVisual: {
    alignSelf: 'center',
    minHeight: 620,
    position: 'relative',
    '@media (max-width: 680px)': { minHeight: 560 },
  },
  primaryLens: {
    height: 540,
    position: 'absolute',
    right: 0,
    top: 30,
    width: 'min(100%, 650px)',
    '@media (max-width: 680px)': { height: 500 },
  },
  lensCopy: {
    color: '#fff',
    maxWidth: 370,
    pointerEvents: 'auto',
    textAlign: 'left',
    textShadow: '0 2px 20px rgb(5 9 29 / 0.55)',
  },
  lensMeta: {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 900,
    letterSpacing: '0.14em',
    marginBottom: 18,
    textTransform: 'uppercase',
  },
  lensTitle: {
    display: 'block',
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(2.2rem, 4vw, 4.2rem)',
    fontWeight: 400,
    letterSpacing: '-0.05em',
    lineHeight: 0.95,
  },
  lensCopyText: { lineHeight: 1.5, marginBlock: 20 },
  lensButton: {
    backgroundColor: 'rgb(255 255 255 / 0.16)',
    borderColor: 'rgb(255 255 255 / 0.36)',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    color: '#fff',
    padding: '12px 18px',
  },
  floatCard: {
    backdropFilter: 'blur(var(--generated-liquid-blur, 24px)) saturate(150%)',
    backgroundColor: 'rgb(224 242 255 / 0.12)',
    borderColor: 'rgb(255 255 255 / 0.28)',
    borderRadius: 22,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.38), 0 24px 70px rgb(0 0 22 / 0.38)',
    padding: '17px 20px',
    position: 'absolute',
    zIndex: 2,
  },
  floatCardA: { left: -10, top: 0 },
  floatCardB: { bottom: 16, right: -15 },
  floatLabel: {
    color: 'var(--guide-muted)',
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  floatValue: { display: 'block', fontSize: '1.3rem', marginTop: 5 },
})
