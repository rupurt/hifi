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
