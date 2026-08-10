import * as stylex from '@stylexjs/stylex'

export const liquidPickerStyles = stylex.create({
  picker: {
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  label: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.13em',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gap: 18,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    '@media (max-width: 780px)': { gridTemplateColumns: '1fr' },
  },
  material: (values: {
    readonly blur: string
    readonly chroma: string
    readonly chromaNegative: string
    readonly edge: string
    readonly fill: string
    readonly radius: string
    readonly shadowBlur: string
    readonly shadowY: string
    readonly specular: number
    readonly tint: string
  }) => ({
    '--picker-blur': values.blur,
    '--picker-chroma': values.chroma,
    '--picker-chroma-negative': values.chromaNegative,
    '--picker-edge': values.edge,
    '--picker-fill': values.fill,
    '--picker-radius': values.radius,
    '--picker-shadow-blur': values.shadowBlur,
    '--picker-shadow-y': values.shadowY,
    '--picker-specular': values.specular,
    '--picker-tint': values.tint,
  }),
  field: {
    borderRadius: 'calc(var(--picker-radius) + 12px)',
    height: 372,
    isolation: 'isolate',
    overflow: 'hidden',
    position: 'relative',
  },
  fieldClear: {
    backgroundColor: '#07172d',
    backgroundImage:
      'linear-gradient(90deg, transparent 0 15%, rgb(56 201 255 / 0.85) 15% 16%, transparent 16% 47%, rgb(255 85 177 / 0.78) 47% 48%, transparent 48%), linear-gradient(rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.12) 1px, transparent 1px), radial-gradient(circle at 82% 28%, #604bff, transparent 26%)',
    backgroundSize: 'auto, 36px 36px, 36px 36px, auto',
  },
  fieldTinted: {
    backgroundColor: '#432468',
    backgroundImage:
      'linear-gradient(180deg, rgb(255 255 255 / 0.2), transparent 44%), linear-gradient(105deg, #ff4778 0%, #ffbe4b 22%, #53e6a9 43%, #31bfff 64%, #755cff 82%, #f35ad2 100%)',
  },
  fieldFrosted: {
    backgroundColor: '#c9e7f3',
    backgroundImage:
      'linear-gradient(125deg, transparent 0 52%, rgb(255 255 255 / 0.64) 52% 54%, transparent 54%), linear-gradient(90deg, #f16b8b 0 24%, transparent 24% 72%, #2c8fff 72% 100%)',
  },
  fieldBlurred: {
    backgroundColor: '#06162c',
    backgroundImage:
      'radial-gradient(circle at 18% 38%, #ff4eb8 0 12%, transparent 28%), radial-gradient(circle at 78% 64%, #20d7df 0 15%, transparent 34%), linear-gradient(115deg, #16265c, #071025 62%)',
  },
  fieldPrismatic: {
    backgroundColor: '#0c1c38',
    backgroundImage:
      'linear-gradient(145deg, rgb(221 248 255 / 0.9), transparent 24% 68%, rgb(191 232 255 / 0.72)), conic-gradient(from 218deg at 52% 118%, #74eaff, #8b7dff 18%, #ff73c8 32%, #ffc76c 45%, #8affca 60%, #64cfff 76%, #74eaff)',
  },
  fieldSmoked: {
    backgroundColor: '#d8f3ff',
    backgroundImage:
      'linear-gradient(90deg, #f7fdff 0 17%, #37c5ef 17% 20%, #f7fdff 20% 48%, #ff769f 48% 51%, #f7fdff 51% 100%), repeating-linear-gradient(0deg, transparent 0 23px, rgb(7 29 48 / 0.14) 23px 24px)',
  },
  fieldObject: {
    display: 'block',
    position: 'absolute',
  },
  fieldObjectA: {
    backgroundColor: 'rgb(255 255 255 / 0.9)',
    borderRadius: '50%',
    height: 46,
    left: '10%',
    top: 42,
    width: 46,
  },
  fieldObjectB: {
    borderColor: 'rgb(255 255 255 / 0.76)',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 2,
    bottom: 28,
    height: 82,
    right: '8%',
    width: 82,
  },
  fieldRule: {
    backgroundColor: 'rgb(255 255 255 / 0.82)',
    height: 2,
    left: '4%',
    position: 'absolute',
    right: '4%',
    top: '48%',
    transform: 'rotate(-7deg)',
  },
  canvas: {
    height: '100%',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: 'var(--picker-radius)',
    borderStyle: 'solid',
    borderWidth: 'var(--picker-edge)',
    color: '#fff',
    cursor: 'pointer',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    inset: 14,
    isolation: 'isolate',
    overflow: 'hidden',
    padding: 28,
    position: 'absolute',
    textAlign: 'left',
    textShadow: '0 2px 16px rgb(0 0 20 / 0.48)',
    transition: 'outline-color 180ms ease',
    zIndex: 2,
    outline: { ':focus-visible': '3px solid var(--liquid-accent)' },
    outlineOffset: { ':focus-visible': 4 },
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0.01ms' },
  },
  cardFrozen: {
    '::before': {
      backgroundImage:
        'linear-gradient(180deg, rgb(3 10 30 / 0.3), rgb(3 10 30 / 0.18) 42%, rgb(3 10 30 / 0.62))',
      content: '""',
      inset: 0,
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: 0,
    },
  },
  fallbackGlass: {
    backdropFilter: 'blur(var(--picker-blur)) saturate(148%)',
    backgroundColor: 'var(--picker-fill)',
    backgroundImage:
      'linear-gradient(145deg, rgb(255 255 255 / var(--picker-specular)), transparent 42%), linear-gradient(0deg, rgb(3 8 28 / 0.16), transparent 38%)',
    borderColor: 'rgb(255 255 255 / 0.42)',
    boxShadow:
      'inset 1px 2px 1px rgb(255 255 255 / 0.58), inset -1px -2px 2px rgb(3 8 28 / 0.24), var(--picker-chroma-negative) 0 var(--picker-chroma) rgb(74 221 255 / 0.2), var(--picker-chroma) 0 var(--picker-chroma) rgb(255 74 173 / 0.16), 0 var(--picker-shadow-y) var(--picker-shadow-blur) rgb(0 0 24 / 0.34)',
  },
  fallbackConcave: {
    boxShadow:
      'inset 0 8px 20px rgb(11 33 56 / 0.28), inset 0 -1px 0 rgb(255 255 255 / 0.56), 0 var(--picker-shadow-y) var(--picker-shadow-blur) rgb(0 0 24 / 0.28)',
  },
  fallbackLip: {
    borderColor: 'rgb(255 255 255 / 0.34)',
    boxShadow:
      'inset 0 0 0 6px rgb(255 255 255 / 0.1), inset 0 1px 0 rgb(255 255 255 / 0.5), 0 var(--picker-shadow-y) var(--picker-shadow-blur) rgb(0 0 24 / 0.38)',
  },
  cardSelected: {
    outlineColor: 'color-mix(in srgb, var(--picker-tint) 68%, white)',
    outlineOffset: -3,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  cardTopline: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  cardIndex: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.56rem',
    fontWeight: 800,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
  },
  profile: {
    borderColor: 'rgb(255 255 255 / 0.3)',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.52rem',
    letterSpacing: '0.08em',
    padding: '6px 9px',
    textTransform: 'uppercase',
  },
  cardCopy: {
    alignSelf: 'center',
    display: 'grid',
    gap: 12,
    maxWidth: 390,
    position: 'relative',
    zIndex: 1,
  },
  cardName: {
    fontSize: 'clamp(2.2rem, 4vw, 4rem)',
    fontWeight: 700,
    letterSpacing: '-0.055em',
    lineHeight: 0.9,
  },
  description: {
    color: 'rgb(245 249 255 / 0.76)',
    fontSize: '0.78rem',
    lineHeight: 1.5,
  },
  cardFooter: {
    alignItems: 'end',
    borderTopColor: 'rgb(255 255 255 / 0.24)',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    gap: 18,
    justifyContent: 'space-between',
    paddingTop: 14,
    position: 'relative',
    zIndex: 1,
  },
  metrics: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 18,
  },
  metric: {
    display: 'grid',
    gap: 3,
  },
  metricLabel: {
    color: 'rgb(245 249 255 / 0.6)',
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.46rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.67rem',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 700,
  },
  selectedMark: {
    alignItems: 'center',
    backdropFilter: 'blur(14px)',
    backgroundColor: 'rgb(3 8 28 / 0.42)',
    borderColor: 'rgb(255 255 255 / 0.28)',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flex: '0 0 auto',
    fontFamily: 'var(--guide-mono)',
    fontSize: '0.5rem',
    fontWeight: 800,
    gap: 7,
    letterSpacing: '0.08em',
    opacity: 0,
    padding: '7px 10px',
    textTransform: 'uppercase',
    transform: 'translateY(-3px)',
    transition: 'opacity 160ms ease, transform 160ms ease',
  },
  selectedMarkVisible: { opacity: 1, transform: 'translateY(0)' },
  selectedDot: {
    backgroundColor: '#78fbd3',
    borderRadius: '50%',
    boxShadow: '0 0 10px #62f5ce',
    height: 6,
    width: 6,
  },
})
