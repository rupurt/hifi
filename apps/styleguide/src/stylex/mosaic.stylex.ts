import * as stylex from '@stylexjs/stylex'

export const mosaicStyles = stylex.create({
  page: {
    '--guide-display': '"Arial Black", Impact, Haettenschweiler, sans-serif',
    '--guide-font': 'Inter, ui-sans-serif, sans-serif',
    '--guide-mono': '"SFMono-Regular", Consolas, monospace',
    backgroundColor: 'var(--mosaic-background)',
    backgroundImage:
      'linear-gradient(color-mix(in srgb, var(--mosaic-background) 94%, transparent), color-mix(in srgb, var(--mosaic-background) 94%, transparent)), var(--mosaic-pattern)',
    backgroundPosition: '0 0, var(--mosaic-pattern-position)',
    backgroundSize: 'auto, var(--mosaic-pattern-size)',
  },
  generatedPage: (values: {
    readonly accent: string
    readonly accentText: string
    readonly background: string
    readonly backgroundImage: string
    readonly backgroundPosition: string
    readonly backgroundSize: string
    readonly cell: string
    readonly foreground: string
    readonly joint: string
    readonly jointWidth: string
    readonly radius: string
    readonly relief: string
    readonly secondary: string
    readonly tile: string
    readonly tileText: string
  }) => ({
    '--control-accent': values.accent,
    '--control-accent-contrast': values.accentText,
    '--control-border': values.joint,
    '--control-radius': values.radius,
    '--control-shadow': `${values.relief} ${values.relief} 0 ${values.joint}`,
    '--control-surface': values.background,
    '--control-surface-strong': values.background,
    '--generated-control-accent': values.accent,
    '--generated-control-accent-contrast': values.accentText,
    '--generated-control-border': values.joint,
    '--generated-control-muted': `color-mix(in srgb, ${values.foreground} 64%, transparent)`,
    '--generated-control-shadow': `${values.relief} ${values.relief} 0 ${values.joint}`,
    '--generated-control-surface': values.background,
    '--generated-control-surface-strong': values.background,
    '--generated-control-text': values.foreground,
    '--guide-ink': values.foreground,
    '--guide-line': `color-mix(in srgb, ${values.joint} 58%, transparent)`,
    '--guide-muted': `color-mix(in srgb, ${values.foreground} 62%, transparent)`,
    '--mosaic-accent': values.accent,
    '--mosaic-accent-text': values.accentText,
    '--mosaic-background': values.background,
    '--mosaic-cell': values.cell,
    '--mosaic-foreground': values.foreground,
    '--mosaic-joint': values.joint,
    '--mosaic-joint-width': values.jointWidth,
    '--mosaic-pattern': values.backgroundImage,
    '--mosaic-pattern-position': values.backgroundPosition,
    '--mosaic-pattern-size': values.backgroundSize,
    '--mosaic-radius': values.radius,
    '--mosaic-relief': values.relief,
    '--mosaic-secondary': values.secondary,
    '--mosaic-tile': values.tile,
    '--mosaic-tile-text': values.tileText,
    backgroundColor: values.background,
    color: values.foreground,
  }),
  hero: {
    alignItems: 'center',
    display: 'grid',
    gap: 'clamp(38px, 6vw, 96px)',
    gridTemplateColumns: 'minmax(0, 0.82fr) minmax(500px, 1.18fr)',
    minHeight: 'min(900px, calc(100vh - 72px))',
    paddingBlock: 'clamp(60px, 8vw, 112px)',
    '@media (max-width: 1040px)': { gridTemplateColumns: '1fr' },
  },
  heroCopy: {
    backgroundColor: 'var(--mosaic-background)',
    borderColor: 'var(--mosaic-joint)',
    borderStyle: 'solid',
    borderWidth: 'var(--mosaic-joint-width)',
    boxShadow: 'var(--mosaic-relief) var(--mosaic-relief) 0 var(--mosaic-joint)',
    padding: 'clamp(24px, 3vw, 44px)',
  },
  heroTitle: {
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(4.6rem, 8vw, 8.5rem)',
    fontWeight: 900,
    letterSpacing: '-0.075em',
    lineHeight: 0.76,
    marginBlock: '32px 38px',
    textTransform: 'uppercase',
  },
  heroTitleInset: {
    backgroundColor: 'var(--mosaic-accent)',
    color: 'var(--mosaic-accent-text)',
    display: 'block',
    fontSize: '0.49em',
    letterSpacing: '-0.015em',
    lineHeight: 1,
    marginTop: '0.22em',
    padding: '0.14em 0.18em',
    width: 'fit-content',
  },
  heroIntro: { maxWidth: 520 },
  heroFacts: {
    borderTopColor: 'var(--mosaic-joint)',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'grid',
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.62rem',
    gap: 12,
    gridTemplateColumns: 'repeat(3, 1fr)',
    letterSpacing: '0.08em',
    marginBlock: '34px 0',
    paddingTop: 14,
    textTransform: 'uppercase',
  },
  heroFact: { display: 'grid', gap: 4 },
  heroFactLabel: { opacity: 0.62 },
  heroFactValue: { fontWeight: 800, margin: 0 },
  composition: {
    minHeight: 660,
    padding: 'clamp(18px, 3vw, 34px)',
    '@media (max-width: 1040px)': { minHeight: 580 },
  },
  compositionGrid: {
    alignContent: 'center',
    backgroundColor: 'var(--mosaic-joint)',
    display: 'grid',
    gap: 'var(--mosaic-joint-width)',
    gridAutoRows: 'minmax(130px, auto)',
    gridTemplateColumns: 'repeat(4, 1fr)',
    minHeight: 560,
    '@media (max-width: 620px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
  },
  featureTile: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  tileEyebrow: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.58rem',
    fontWeight: 700,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
  },
  featureNumber: {
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(7rem, 14vw, 13rem)',
    letterSpacing: '-0.09em',
    lineHeight: 0.72,
  },
  tileFooter: { fontFamily: 'var(--guide-mono)', fontSize: '0.62rem', textTransform: 'uppercase' },
  tileValue: {
    display: 'block',
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(2rem, 4vw, 4rem)',
    lineHeight: 0.9,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  statementTile: {
    alignItems: 'end',
    display: 'flex',
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(1.5rem, 2.5vw, 2.6rem)',
    letterSpacing: '-0.035em',
    lineHeight: 0.95,
  },
  colorTile: {
    backgroundColor: 'var(--mosaic-secondary)',
    borderColor: 'var(--mosaic-joint)',
    borderRadius: 'var(--mosaic-radius)',
    borderStyle: 'solid',
    borderWidth: 'var(--mosaic-joint-width)',
    minHeight: 100,
  },
  secondaryTile: {
    backgroundColor: 'var(--mosaic-tile)',
    borderColor: 'var(--mosaic-joint)',
    borderRadius: 'var(--mosaic-radius)',
    borderStyle: 'solid',
    borderWidth: 'var(--mosaic-joint-width)',
    minHeight: 100,
  },
})
