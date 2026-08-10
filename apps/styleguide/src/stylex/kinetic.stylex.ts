import * as stylex from '@stylexjs/stylex'

export const kineticStyles = stylex.create({
  page: {
    '--guide-display': '"Arial Narrow", "Roboto Condensed", ui-sans-serif, sans-serif',
    '--guide-display-leading': '0.92',
    '--guide-display-tracking': '-0.025em',
    '--guide-display-weight': '800',
    '--guide-font': 'Inter, ui-sans-serif, sans-serif',
    '--guide-landmark-leading': '0.96',
    '--guide-landmark-tracking': '-0.015em',
    '--guide-landmark-weight': '800',
    '--guide-mono': '"SFMono-Regular", Consolas, monospace',
    '--guide-section-background': 'color-mix(in srgb, var(--kinetic-background) 94%, white)',
    '--guide-section-border': 'color-mix(in srgb, var(--kinetic-foreground) 24%, transparent)',
    '--guide-section-border-width': '1px',
    '--guide-section-index-color': 'var(--kinetic-accent)',
    '--guide-section-padding': 'clamp(22px, 3.5vw, 48px)',
    '--guide-section-shadow':
      '12px 28px 70px color-mix(in srgb, var(--kinetic-foreground) 10%, transparent)',
    '--guide-section-title-leading': '0.94',
    '--guide-section-title-tracking': '-0.025em',
    '--guide-section-title-weight': '850',
    '--kinetic-edge-shadow': 'color-mix(in srgb, var(--kinetic-foreground) 20%, transparent)',
    '--kinetic-hard-shadow': 'color-mix(in srgb, var(--kinetic-foreground) 34%, transparent)',
    '--kinetic-light-highlight': 'color-mix(in srgb, white 56%, transparent)',
    '--kinetic-soft-shadow': 'color-mix(in srgb, var(--kinetic-foreground) 16%, transparent)',
    '--kinetic-shadow-y': 'max(3px, calc(var(--kinetic-travel) * 0.68))',
    '--kinetic-shadow-x': 'max(1px, calc(var(--kinetic-shadow-y) * 0.42))',
    '--kinetic-shadow-soft-y': 'calc(var(--kinetic-shadow-y) + 6px)',
    '--kinetic-shadow-soft-x': 'max(2px, calc(var(--kinetic-shadow-soft-y) * 0.42))',
    '--kinetic-shadow-hover-y': 'calc(var(--kinetic-shadow-y) + 1px)',
    '--kinetic-shadow-hover-x': 'max(1px, calc(var(--kinetic-shadow-hover-y) * 0.42))',
    '--kinetic-shadow-hover-soft-y': 'calc(var(--kinetic-shadow-soft-y) + 2px)',
    '--kinetic-shadow-hover-soft-x': 'max(2px, calc(var(--kinetic-shadow-hover-soft-y) * 0.42))',
    '--kinetic-segment-shadow-y': 'max(3px, calc(var(--kinetic-travel) * 0.46))',
    '--kinetic-segment-shadow-x': 'max(1px, calc(var(--kinetic-segment-shadow-y) * 0.42))',
    '--kinetic-segment-shadow-soft-y': 'calc(var(--kinetic-segment-shadow-y) + 4px)',
    '--kinetic-segment-shadow-soft-x':
      'max(2px, calc(var(--kinetic-segment-shadow-soft-y) * 0.42))',
    '--kinetic-switch-shadow-y': 'max(2px, calc(var(--kinetic-shadow-y) * 0.5))',
    '--kinetic-switch-shadow-x': 'max(1px, calc(var(--kinetic-switch-shadow-y) * 0.42))',
    '--kinetic-control-lift': 'var(--kinetic-shadow-y)',
    '--kinetic-control-press': 'calc(var(--kinetic-travel) * var(--kinetic-actuation))',
    '--kinetic-control-press-x': 'max(0.5px, calc(var(--kinetic-control-press) * 0.42))',
    '--kinetic-encoder-shadow-y': 'max(3px, calc(var(--kinetic-travel) * 0.45))',
    '--kinetic-encoder-shadow-x': 'max(1px, calc(var(--kinetic-encoder-shadow-y) * 0.42))',
    '--kinetic-encoder-shadow-soft-y': 'calc(var(--kinetic-encoder-shadow-y) + 5px)',
    '--kinetic-encoder-shadow-soft-x':
      'max(2px, calc(var(--kinetic-encoder-shadow-soft-y) * 0.42))',
    '--generated-button-background': 'none',
    '--generated-button-font': 'var(--guide-mono)',
    '--generated-button-letter-spacing': '0.065em',
    '--generated-button-min-height': '48px',
    '--generated-button-padding-block': '12px',
    '--generated-button-text-transform': 'uppercase',
    '--generated-field-label-font': 'var(--guide-mono)',
    '--generated-button-shadow':
      'inset 1px 1px 0 var(--kinetic-light-highlight), inset -1px -1px 0 var(--kinetic-edge-shadow), var(--kinetic-shadow-x) var(--kinetic-shadow-y) 0 var(--kinetic-hard-shadow), var(--kinetic-shadow-soft-x) var(--kinetic-shadow-soft-y) calc(8px + var(--kinetic-mass) * 6px) var(--kinetic-soft-shadow)',
    '--generated-button-hover-shadow':
      'inset 1px 1px 0 color-mix(in srgb, white 66%, transparent), inset -1px -1px 0 var(--kinetic-edge-shadow), var(--kinetic-shadow-hover-x) var(--kinetic-shadow-hover-y) 0 color-mix(in srgb, var(--kinetic-foreground) 38%, transparent), var(--kinetic-shadow-hover-soft-x) var(--kinetic-shadow-hover-soft-y) calc(10px + var(--kinetic-mass) * 7px) color-mix(in srgb, var(--kinetic-foreground) 18%, transparent)',
    '--generated-button-active-shadow':
      'inset 2px 2px calc(3px + var(--kinetic-friction) * 4px) color-mix(in srgb, var(--kinetic-foreground) 24%, transparent), inset -1px -1px 0 color-mix(in srgb, white 24%, transparent), 1px 1px 0 color-mix(in srgb, var(--kinetic-foreground) 28%, transparent)',
    '--generated-button-hover-transform': 'translate(-0.42px, -1px)',
    '--generated-button-active-transform':
      'translate(var(--kinetic-control-press-x), var(--kinetic-control-press))',
    '--generated-button-transition':
      'box-shadow var(--kinetic-duration) ease, transform var(--kinetic-duration) cubic-bezier(0.2, calc(0.8 + var(--kinetic-restitution)), 0.25, 1)',
    '--generated-icon-radius': '50%',
    '--generated-input-background': 'none',
    '--generated-input-shadow':
      'inset 2px 2px calc(3px + var(--kinetic-friction) * 3px) color-mix(in srgb, var(--kinetic-foreground) 20%, transparent), inset -1px -1px 0 color-mix(in srgb, white 34%, transparent)',
    '--generated-input-focus-shadow':
      'inset 2px 2px calc(3px + var(--kinetic-friction) * 3px) color-mix(in srgb, var(--kinetic-foreground) 20%, transparent), inset -1px -1px 0 color-mix(in srgb, white 34%, transparent)',
    '--generated-primary-button-shadow':
      'inset 1px 1px 0 color-mix(in srgb, white 52%, transparent), inset -1px -1px 0 color-mix(in srgb, var(--kinetic-foreground) 24%, transparent), var(--kinetic-shadow-x) var(--kinetic-shadow-y) 0 color-mix(in srgb, var(--kinetic-accent) 52%, var(--kinetic-foreground)), var(--kinetic-shadow-soft-x) var(--kinetic-shadow-soft-y) calc(9px + var(--kinetic-mass) * 6px) color-mix(in srgb, var(--kinetic-accent) 20%, transparent)',
    '--generated-primary-button-hover-shadow':
      'inset 1px 1px 0 color-mix(in srgb, white 64%, transparent), inset -1px -1px 0 color-mix(in srgb, var(--kinetic-foreground) 24%, transparent), var(--kinetic-shadow-hover-x) var(--kinetic-shadow-hover-y) 0 color-mix(in srgb, var(--kinetic-accent) 58%, var(--kinetic-foreground)), var(--kinetic-shadow-hover-soft-x) var(--kinetic-shadow-hover-soft-y) calc(11px + var(--kinetic-mass) * 7px) color-mix(in srgb, var(--kinetic-accent) 24%, transparent)',
    '--generated-primary-button-active-shadow':
      'inset 2px 2px calc(4px + var(--kinetic-friction) * 4px) color-mix(in srgb, var(--kinetic-foreground) 30%, transparent), inset -1px -1px 0 color-mix(in srgb, white 20%, transparent), 1px 1px 0 color-mix(in srgb, var(--kinetic-accent) 48%, var(--kinetic-foreground))',
    '--generated-primary-button-background': 'none',
    '--generated-danger-button-background': 'none',
    '--generated-segment-background': 'none',
    '--generated-segment-background-color':
      'color-mix(in srgb, var(--kinetic-background) 94%, white)',
    '--generated-segment-border-width': '1px',
    '--generated-segment-color': 'color-mix(in srgb, var(--kinetic-foreground) 70%, transparent)',
    '--generated-segment-gap': '5px',
    '--generated-segment-min-height': '48px',
    '--generated-segment-padding': '7px',
    '--generated-segment-radius': 'max(2px, calc(var(--kinetic-radius) * 0.45))',
    '--generated-segment-weight': '750',
    '--generated-segment-shadow':
      'inset 1px 1px 0 color-mix(in srgb, white 52%, transparent), inset -1px -1px 0 color-mix(in srgb, var(--kinetic-foreground) 18%, transparent), var(--kinetic-segment-shadow-x) var(--kinetic-segment-shadow-y) 0 color-mix(in srgb, var(--kinetic-foreground) 32%, transparent), var(--kinetic-segment-shadow-soft-x) var(--kinetic-segment-shadow-soft-y) calc(7px + var(--kinetic-mass) * 3px) color-mix(in srgb, var(--kinetic-foreground) 14%, transparent)',
    '--generated-segment-active-background':
      'color-mix(in srgb, var(--kinetic-background) 84%, black)',
    '--generated-segment-active-shadow':
      'inset 2px 2px calc(4px + var(--kinetic-mass) * 2px) color-mix(in srgb, var(--kinetic-foreground) 28%, transparent), inset -1px -1px 0 color-mix(in srgb, white 24%, transparent), 1px 1px 0 color-mix(in srgb, var(--kinetic-foreground) 22%, transparent)',
    '--generated-segment-active-border':
      'color-mix(in srgb, var(--kinetic-foreground) 28%, transparent)',
    '--generated-segment-active-color': 'var(--kinetic-foreground)',
    '--generated-segment-active-weight': '950',
    '--generated-segment-active-transform':
      'translate(var(--kinetic-segment-shadow-x), var(--kinetic-segment-shadow-y))',
    '--generated-segment-press-transform':
      'translate(var(--kinetic-control-press-x), var(--kinetic-control-press))',
    '--generated-segment-housing-shadow':
      'inset 2px 2px calc(5px + var(--kinetic-friction) * 4px) color-mix(in srgb, var(--kinetic-foreground) 22%, transparent), inset -1px -1px 0 color-mix(in srgb, white 32%, transparent)',
    '--generated-switch-thumb-shadow':
      'inset 1px 1px 0 var(--kinetic-light-highlight), var(--kinetic-switch-shadow-x) var(--kinetic-switch-shadow-y) calc(5px + var(--kinetic-mass) * 2px) color-mix(in srgb, var(--kinetic-foreground) 24%, transparent)',
    '--generated-switch-housing-shadow':
      'inset 2px 2px calc(4px + var(--kinetic-friction) * 3px) color-mix(in srgb, var(--kinetic-foreground) 24%, transparent), inset -1px -1px 0 color-mix(in srgb, white 24%, transparent)',
    backgroundImage:
      'linear-gradient(90deg, var(--kinetic-grid-line) 1px, transparent 1px), linear-gradient(var(--kinetic-grid-line) 1px, transparent 1px), linear-gradient(145deg, color-mix(in srgb, var(--kinetic-background) 84%, white), var(--kinetic-background))',
    backgroundSize: '96px 96px, 96px 96px, auto',
  },
  generatedPage: (values: {
    readonly accent: string
    readonly actuation: number
    readonly background: string
    readonly controlShadow: string
    readonly damping: number
    readonly detents: number
    readonly duration: string
    readonly foreground: string
    readonly friction: number
    readonly generatedShadow: string
    readonly mass: number
    readonly radius: string
    readonly restitution: number
    readonly stiffness: number
    readonly surface: string
    readonly travel: string
  }) => ({
    '--control-accent': values.accent,
    '--control-accent-contrast': values.background,
    '--control-border': `color-mix(in srgb, ${values.foreground} 38%, transparent)`,
    '--control-radius': values.radius,
    '--control-shadow': values.controlShadow,
    '--control-surface': values.surface,
    '--control-surface-strong': values.background,
    '--generated-control-accent': values.accent,
    '--generated-control-accent-contrast': values.background,
    '--generated-control-border': `color-mix(in srgb, ${values.foreground} 38%, transparent)`,
    '--generated-control-muted': `color-mix(in srgb, ${values.foreground} 61%, transparent)`,
    '--generated-control-shadow': values.generatedShadow,
    '--generated-control-surface': values.surface,
    '--generated-control-surface-strong': values.background,
    '--generated-control-text': values.foreground,
    '--guide-ink': values.foreground,
    '--guide-line': `color-mix(in srgb, ${values.foreground} 34%, transparent)`,
    '--guide-muted': `color-mix(in srgb, ${values.foreground} 63%, transparent)`,
    '--kinetic-accent': values.accent,
    '--kinetic-actuation': values.actuation,
    '--kinetic-background': values.background,
    '--kinetic-damping': values.damping,
    '--kinetic-detents': values.detents,
    '--kinetic-duration': values.duration,
    '--kinetic-foreground': values.foreground,
    '--kinetic-friction': values.friction,
    '--kinetic-grid-line': `color-mix(in srgb, ${values.foreground} 15%, transparent)`,
    '--kinetic-mass': values.mass,
    '--kinetic-radius': values.radius,
    '--kinetic-restitution': values.restitution,
    '--kinetic-stiffness': values.stiffness,
    '--kinetic-travel': values.travel,
  }),
  hero: {
    display: 'grid',
    gap: 'clamp(36px, 6vw, 90px)',
    gridTemplateColumns: 'minmax(0, 0.86fr) minmax(470px, 1.14fr)',
    minHeight: 'min(900px, calc(100vh - 72px))',
    paddingBlock: 'clamp(70px, 9vw, 125px)',
    position: 'relative',
    '@media (max-width: 980px)': { gridTemplateColumns: '1fr' },
  },
  index: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.55rem',
    gap: 12,
    left: -42,
    letterSpacing: '0.13em',
    position: 'absolute',
    top: '50%',
    transform: 'rotate(-90deg) translateX(-50%)',
    transformOrigin: 'left top',
  },
  indexLine: { backgroundColor: 'var(--kinetic-accent)', display: 'block', height: 2, width: 70 },
  heroCopy: { alignSelf: 'center' },
  heroTitle: {
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(4.5rem, 9vw, 9.5rem)',
    fontStretch: 'condensed',
    fontWeight: 900,
    letterSpacing: '-0.045em',
    lineHeight: 0.78,
    margin: 0,
    '@media (max-width: 600px)': { fontSize: 'clamp(3.7rem, 19vw, 5.4rem)' },
  },
  heroTitleAccent: {
    color: 'var(--kinetic-accent)',
    display: 'block',
    fontSize: '0.52em',
    letterSpacing: '-0.02em',
    marginTop: '0.32em',
  },
  machine: {
    alignContent: 'center',
    minHeight: 660,
    overflow: 'hidden',
    padding: 'clamp(30px, 5vw, 66px)',
    position: 'relative',
    '@media (max-width: 980px)': { minHeight: 600 },
    '::before': {
      borderColor: 'color-mix(in srgb, var(--kinetic-foreground) 28%, transparent)',
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 1,
      content: '""',
      height: 12,
      left: 18,
      position: 'absolute',
      top: 18,
      width: 12,
    },
    '::after': {
      borderColor: 'color-mix(in srgb, var(--kinetic-foreground) 28%, transparent)',
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 1,
      content: '""',
      height: 12,
      position: 'absolute',
      right: 18,
      top: 18,
      width: 12,
    },
  },
  rail: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    left: '13%',
    position: 'absolute',
    right: '13%',
    top: 78,
    '::before': {
      backgroundColor: 'var(--kinetic-foreground)',
      content: '""',
      height: 1,
      left: 0,
      opacity: 0.25,
      position: 'absolute',
      right: 0,
    },
  },
  railTick: {
    backgroundColor: 'var(--kinetic-background)',
    borderColor: 'var(--kinetic-foreground)',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 8,
    position: 'relative',
    width: 2,
  },
  readout: { display: 'grid', left: '12%', position: 'absolute', textAlign: 'left', top: 122 },
  meta: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.57rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  readoutValue: {
    fontFamily: 'var(--guide-mono)',
    fontSize: 'clamp(3rem, 7vw, 6.5rem)',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 800,
    letterSpacing: '-0.1em',
    lineHeight: 1,
  },
  heroButton: {
    alignItems: 'center',
    aspectRatio: '1.5',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 100,
    minWidth: 'min(76%, 370px)',
    padding: 30,
  },
  heroButtonLabel: {
    fontFamily: 'var(--guide-display)',
    fontSize: 'clamp(2.4rem, 5vw, 4.7rem)',
    fontStretch: 'condensed',
    fontWeight: 900,
    letterSpacing: '-0.015em',
  },
  plate: {
    borderTopColor: 'color-mix(in srgb, var(--kinetic-foreground) 28%, transparent)',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    bottom: 28,
    display: 'flex',
    justifyContent: 'space-between',
    left: 28,
    paddingTop: 17,
    position: 'absolute',
    right: 28,
    '@media (max-width: 600px)': { flexWrap: 'wrap', gap: 8 },
  },
})
