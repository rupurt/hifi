import * as stylex from '@stylexjs/stylex'

export const catalogMosaicStyles = stylex.create({
  choiceInput: {
    appearance: 'none',
    cursor: 'pointer',
    height: 18,
    margin: 0,
    outline: { ':focus-visible': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
    width: 18,
  },
  choiceMaterial: (values: {
    readonly border: string
    readonly checkedBackground: string
    readonly clipPath: string
    readonly filter: string
    readonly uncheckedBackground: string
  }) => ({
    backgroundColor: { default: values.uncheckedBackground, ':checked': values.checkedBackground },
    borderColor: values.border,
    borderStyle: 'solid',
    borderWidth: 1,
    clipPath: values.clipPath,
    filter: values.filter,
  }),
  button: (values: {
    readonly background: string
    readonly clipPath: string
    readonly color: string
    readonly pressedFilter: string
    readonly restFilter: string
  }) => ({
    backgroundColor: values.background,
    border: 0,
    clipPath: values.clipPath,
    color: values.color,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    filter: { default: values.restFilter, ':active': values.pressedFilter },
    fontWeight: 700,
    minHeight: 42,
    opacity: { ':disabled': 0.5 },
    outline: { ':focus-visible': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
    paddingInline: 18,
    transform: { default: 'translateY(0)', ':active': 'translateY(1px)' },
    transition: 'filter 120ms ease, transform 120ms ease',
  }),
  iconButton: (values: {
    readonly background: string
    readonly clipPath: string
    readonly color: string
    readonly pressedFilter: string
    readonly restFilter: string
  }) => ({
    alignItems: 'center',
    backgroundColor: values.background,
    border: 0,
    clipPath: values.clipPath,
    color: values.color,
    cursor: 'pointer',
    display: 'inline-flex',
    filter: { default: values.restFilter, ':active': values.pressedFilter },
    height: 42,
    justifyContent: 'center',
    outline: { ':focus-visible': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
    transform: { default: 'translateY(0)', ':active': 'translateY(1px)' },
    transition: 'filter 120ms ease, transform 120ms ease',
    width: 42,
  }),
  switchTrack: (values: { readonly background: string; readonly clipPath: string }) => ({
    backgroundColor: values.background,
    clipPath: values.clipPath,
    cursor: 'pointer',
    height: 32,
    outline: { ':focus-visible': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
    position: 'relative',
    width: 58,
  }),
  switchThumb: (values: {
    readonly background: string
    readonly clipPath: string
    readonly filter: string
    readonly translateX: string
  }) => ({
    backgroundColor: values.background,
    clipPath: values.clipPath,
    display: 'block',
    filter: values.filter,
    height: 24,
    left: 3,
    position: 'absolute',
    top: 3,
    transform: `translateX(${values.translateX})`,
    transition: 'transform 180ms ease, background-color 180ms ease',
    width: 24,
  }),
  rangeWrap: { height: 42, position: 'relative' },
  rangeSurface: {
    '--mosaic-surface-min-height': '42px',
    '--mosaic-surface-padding': '0px',
    height: '100%',
    outline: { ':focus-within': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-within': 3 },
    width: '100%',
  },
  rangeTile: { '--mosaic-tile-padding': '0px' },
  rangeInput: {
    appearance: 'none',
    cursor: 'pointer',
    height: '100%',
    inset: 0,
    margin: 0,
    opacity: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  tableShell: (values: { readonly grout: string; readonly spacing: string }) => ({
    backgroundColor: values.grout,
    borderSpacing: values.spacing,
    borderCollapse: 'separate',
    width: '100%',
  }),
  tableCell: (values: { readonly background: string; readonly foreground: string }) => ({
    backgroundColor: values.background,
    color: values.foreground,
    padding: '14px 18px',
    textAlign: 'left',
  }),
  tableHead: (values: { readonly background: string; readonly foreground: string }) => ({
    backgroundColor: values.background,
    color: values.foreground,
    fontSize: '0.66rem',
    letterSpacing: '0.09em',
    padding: '14px 18px',
    textAlign: 'left',
    textTransform: 'uppercase',
  }),
})
