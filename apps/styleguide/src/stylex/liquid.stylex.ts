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
    '--control-backdrop-filter': 'blur(var(--generated-liquid-blur, 28px)) saturate(150%)',
    '--control-danger': '#ff7c99',
    '--control-interactive-backdrop-filter': 'blur(min(var(--generated-liquid-blur, 16px), 16px))',
    '--control-warning': '#ffd184',
    '--control-positive': '#70ebc5',
    backgroundAttachment: 'fixed',
    backgroundColor: '#080d22',
    backgroundPosition: 'center top',
  },
  generatedPage: (values: {
    readonly accent: string
    readonly backgroundColor: string
    readonly backgroundImage: string
    readonly backgroundSize: string
    readonly blur: string
    readonly controlRadius: string
    readonly glass: string
    readonly glassStrong: string
    readonly waveA: string
    readonly waveB: string
    readonly waveC: string
  }) => ({
    '--control-radius': values.controlRadius,
    '--generated-liquid-blur': values.blur,
    '--liquid-accent': values.accent,
    '--liquid-accent-contrast': '#07101e',
    '--liquid-control-radius': values.controlRadius,
    '--liquid-glass': values.glass,
    '--liquid-glass-strong': values.glassStrong,
    '--liquid-wave-a': values.waveA,
    '--liquid-wave-b': values.waveB,
    '--liquid-wave-c': values.waveC,
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    backgroundSize: values.backgroundSize,
  }),
  atmosphere: {
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
  },
  fabricVeil: {
    backgroundImage:
      'linear-gradient(180deg, transparent 0 8%, rgb(3 7 22 / 0.2) 15%, rgb(3 7 22 / 0.05) 22%, transparent 29%, rgb(3 7 22 / 0.24) 39%, rgb(3 7 22 / 0.06) 47%, transparent 56%, rgb(3 7 22 / 0.26) 68%, rgb(3 7 22 / 0.07) 76%, transparent 84%, rgb(3 7 22 / 0.3) 100%)',
    inset: 0,
    position: 'absolute',
  },
  reliefSheet: {
    backdropFilter: 'blur(24px) saturate(72%) brightness(0.88) contrast(0.94)',
    backgroundColor: 'rgb(210 218 225 / 0.16)',
    backgroundImage:
      'linear-gradient(180deg, rgb(244 247 249 / 0.13), rgb(168 179 189 / 0.1) 18%, rgb(230 234 237 / 0.14) 34%, rgb(123 137 150 / 0.1) 52%, rgb(226 231 234 / 0.12) 69%, rgb(96 111 126 / 0.11) 84%, rgb(212 219 224 / 0.14))',
    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.16)',
    inset: 0,
    position: 'absolute',
  },
  emissionField: {
    height: '100%',
    inset: 0,
    maskImage: 'linear-gradient(90deg, rgb(0 0 0 / 0.1), #000 5%, #000 95%, rgb(0 0 0 / 0.1))',
    mixBlendMode: 'screen',
    opacity: 0.9,
    position: 'absolute',
    width: '100%',
  },
  emissionTrough: { filter: 'saturate(118%) brightness(0.72)', opacity: 0.16 },
  emissionFar: { filter: 'blur(82px) saturate(55%)', opacity: 0.18 },
  emissionMid: { filter: 'blur(52px) saturate(118%)', opacity: 0.46 },
  emissionNear: { filter: 'blur(34px) saturate(188%) brightness(0.94)', opacity: 0.74 },
  contentLayer: { position: 'relative', zIndex: 1 },
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
    '@media (max-width: 520px)': { minHeight: 640 },
  },
  heroFabric: (values: {
    readonly backgroundColor: string
    readonly backgroundImage: string
    readonly backgroundSize: string
  }) => ({
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    backgroundSize: values.backgroundSize,
  }),
  heroMaterialVariables: (values: {
    readonly blur: string
    readonly edge: string
    readonly fill: string
    readonly radius: string
    readonly shadowBlur: string
    readonly shadowY: string
    readonly specular: number
  }) => ({
    '--hero-glass-blur': values.blur,
    '--hero-glass-edge': values.edge,
    '--hero-glass-fill': values.fill,
    '--hero-glass-radius': values.radius,
    '--hero-glass-shadow-blur': values.shadowBlur,
    '--hero-glass-shadow-y': values.shadowY,
    '--hero-glass-specular': values.specular,
  }),
  heroMaterial: {
    borderColor: 'rgb(255 255 255 / 0.2)',
    borderRadius: 46,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 42px 110px rgb(0 0 24 / 0.42)',
    height: 600,
    isolation: 'isolate',
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 10,
    width: 'min(100%, 680px)',
    '@media (max-width: 680px)': { borderRadius: 34, height: 540 },
    '@media (max-width: 520px)': { height: 620 },
  },
  heroMaterialObject: { display: 'block', position: 'absolute', zIndex: 0 },
  heroMaterialObjectA: {
    backgroundColor: 'rgb(255 255 255 / 0.92)',
    borderRadius: '50%',
    height: 82,
    left: '8%',
    top: 58,
    width: 82,
  },
  heroMaterialObjectB: {
    borderColor: 'rgb(255 255 255 / 0.82)',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 3,
    height: 146,
    right: '7%',
    top: '38%',
    width: 146,
  },
  heroMaterialRule: {
    backgroundColor: 'rgb(255 255 255 / 0.86)',
    height: 3,
    left: '3%',
    position: 'absolute',
    right: '3%',
    top: '42%',
    transform: 'rotate(-7deg)',
    zIndex: 0,
  },
  heroMaterialCanvas: {
    height: '100%',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  heroMaterialGlass: {
    borderColor: 'rgb(255 255 255 / 0.4)',
    borderRadius: 'var(--hero-glass-radius)',
    borderStyle: 'solid',
    borderWidth: 'var(--hero-glass-edge)',
    inset: 20,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
  heroMaterialFallback: {
    backdropFilter: 'blur(var(--hero-glass-blur)) saturate(150%)',
    backgroundColor: 'var(--hero-glass-fill)',
    backgroundImage:
      'linear-gradient(145deg, rgb(255 255 255 / var(--hero-glass-specular)), transparent 44%), linear-gradient(0deg, rgb(3 8 28 / 0.2), transparent 42%)',
    boxShadow:
      'inset 1px 2px 1px rgb(255 255 255 / 0.62), inset -1px -2px 2px rgb(3 8 28 / 0.26), 0 var(--hero-glass-shadow-y) var(--hero-glass-shadow-blur) rgb(0 0 24 / 0.4)',
  },
  heroMaterialFrozen: {
    '::before': {
      backgroundImage:
        'linear-gradient(180deg, rgb(3 10 30 / 0.18), rgb(3 10 30 / 0.12) 42%, rgb(3 10 30 / 0.62))',
      content: '""',
      inset: 0,
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  heroMaterialContent: {
    color: '#fff',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    inset: 20,
    padding: 'clamp(24px, 4vw, 42px)',
    position: 'absolute',
    textAlign: 'left',
    textShadow: '0 2px 18px rgb(3 7 24 / 0.64)',
    zIndex: 2,
    '@media (max-width: 680px)': { padding: 24 },
  },
  heroMaterialTopline: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  heroMaterialMeta: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.58rem',
    fontWeight: 800,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
  },
  heroMaterialProfile: {
    borderColor: 'rgb(255 255 255 / 0.34)',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: '7px 10px',
  },
  heroMaterialCopy: { alignSelf: 'center', display: 'grid', gap: 15, maxWidth: 480 },
  heroMaterialName: {
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(3.1rem, 5.2vw, 5.7rem)',
    fontWeight: 700,
    letterSpacing: '-0.06em',
    lineHeight: 0.84,
  },
  heroMaterialDescription: {
    color: 'rgb(245 249 255 / 0.8)',
    lineHeight: 1.5,
    margin: 0,
    maxWidth: 420,
  },
  heroMaterialFooter: {
    backdropFilter: 'blur(18px) saturate(140%)',
    backgroundColor: 'rgb(3 8 28 / 0.34)',
    borderColor: 'rgb(255 255 255 / 0.24)',
    borderRadius: 18,
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    margin: 0,
    minInlineSize: 0,
    padding: 16,
    '@media (max-width: 520px)': { gridTemplateColumns: '1fr' },
  },
  heroConstraint: { display: 'grid', gap: 8 },
  heroConstraintHeader: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  heroConstraintValue: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.62rem',
    fontVariantNumeric: 'tabular-nums',
  },
  heroConstraintInput: {
    accentColor: 'var(--liquid-accent)',
    cursor: 'pointer',
    margin: 0,
    width: '100%',
  },
  heroConstraintCaption: {
    color: 'rgb(245 249 255 / 0.6)',
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.48rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
})
