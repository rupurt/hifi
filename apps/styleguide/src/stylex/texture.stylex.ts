import * as stylex from '@stylexjs/stylex'

export const textureStyles = stylex.create({
  page: {
    '--guide-display': '"Iowan Old Style", Baskerville, Georgia, serif',
    '--guide-font': '"Avenir Next", Avenir, ui-sans-serif, sans-serif',
    '--guide-mono': '"SFMono-Regular", Consolas, monospace',
    backgroundColor: '#d8c7a4',
    backgroundImage:
      'radial-gradient(circle at 12% 22%, rgb(88 56 28 / 0.1) 0 1px, transparent 1.4px), radial-gradient(circle at 82% 42%, rgb(255 252 231 / 0.38) 0 1px, transparent 1.6px), linear-gradient(90deg, rgb(103 76 43 / 0.05) 1px, transparent 1px)',
    backgroundSize: '19px 17px, 23px 21px, 88px 100%',
  },
  generatedPage: (values: {
    readonly accent: string
    readonly accentContrast: string
    readonly backgroundColor: string
    readonly backgroundImage: string | undefined
    readonly backgroundSize: string | undefined
    readonly border: string
    readonly controlRadius: string
    readonly controlShadow: string
    readonly controlSurface: string
    readonly foreground: string
  }) => ({
    '--control-accent': values.accent,
    '--control-accent-contrast': values.accentContrast,
    '--control-border': values.border,
    '--control-radius': values.controlRadius,
    '--control-shadow': values.controlShadow,
    '--control-surface': values.controlSurface,
    '--control-surface-strong': values.backgroundColor,
    '--generated-control-accent': values.accent,
    '--generated-control-accent-contrast': values.accentContrast,
    '--generated-control-border': values.border,
    '--generated-control-muted': `color-mix(in srgb, ${values.foreground} 64%, transparent)`,
    '--generated-control-shadow': values.controlShadow,
    '--generated-control-surface': values.controlSurface,
    '--generated-control-surface-strong': values.backgroundColor,
    '--generated-control-text': values.foreground,
    '--generated-texture-image': values.backgroundImage,
    '--generated-texture-size': values.backgroundSize,
    '--guide-ink': values.foreground,
    '--guide-line': `color-mix(in srgb, ${values.foreground} 42%, transparent)`,
    '--guide-muted': `color-mix(in srgb, ${values.foreground} 67%, transparent)`,
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    backgroundSize: values.backgroundSize,
    color: values.foreground,
  }),
  hero: { position: 'relative' },
  swatchMark: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.62rem',
    left: '-2vw',
    letterSpacing: '0.13em',
    position: 'absolute',
    top: 44,
    transform: 'rotate(-90deg) translateX(-100%)',
    transformOrigin: 'left top',
  },
  heroEmphasis: { color: 'var(--control-accent)', fontStyle: 'italic' },
  heroSample: {
    alignSelf: 'center',
    minHeight: 570,
    overflow: 'visible',
    position: 'relative',
    transform: 'rotate(1.4deg)',
    '@media (max-width: 980px)': { minHeight: 470 },
  },
  sampleCopy: { maxWidth: 390, textAlign: 'left' },
  sampleMeta: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.67rem',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
  },
  sampleTitle: {
    display: 'block',
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(2.7rem, 5vw, 5.6rem)',
    fontWeight: 400,
    letterSpacing: '-0.045em',
    lineHeight: 0.92,
    marginBlock: '80px 24px',
  },
  sampleCopyText: { lineHeight: 1.6 },
  stitchLine: {
    borderTopColor: 'currentColor',
    borderTopStyle: 'dashed',
    borderTopWidth: 2,
    marginTop: 60,
    opacity: 0.35,
  },
})
