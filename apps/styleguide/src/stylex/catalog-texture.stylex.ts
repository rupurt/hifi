import * as stylex from '@stylexjs/stylex'

export const catalogTextureStyles = stylex.create({
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
    readonly backgroundSize: string
    readonly borderColor: string
    readonly borderRadius: number
    readonly checkedBackground: string
    readonly checkedBorderColor: string
    readonly checkedImage: string
    readonly uncheckedBackground: string
    readonly uncheckedImage: string
  }) => ({
    backgroundColor: { default: values.uncheckedBackground, ':checked': values.checkedBackground },
    backgroundImage: { default: values.uncheckedImage, ':checked': values.checkedImage },
    backgroundSize: values.backgroundSize,
    borderColor: { default: values.borderColor, ':checked': values.checkedBorderColor },
    borderRadius: values.borderRadius,
    borderStyle: 'solid',
    borderWidth: { default: 1, ':checked': 2 },
  }),
  button: (values: {
    readonly backgroundColor: string
    readonly borderRadius: number
    readonly color: string
    readonly pressedImage: string
    readonly pressedShadow: string
    readonly restImage: string
    readonly restShadow: string
  }) => ({
    backgroundColor: values.backgroundColor,
    backgroundImage: { default: values.restImage, ':active': values.pressedImage },
    border: 0,
    borderRadius: values.borderRadius,
    boxShadow: { default: values.restShadow, ':active': values.pressedShadow },
    color: values.color,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    fontWeight: 700,
    minHeight: 42,
    opacity: { ':disabled': 0.5 },
    outline: { ':focus-visible': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
    paddingInline: 18,
    transform: { default: 'translateY(0)', ':active': 'translateY(1px)' },
    transition: 'box-shadow 120ms ease, transform 120ms ease',
  }),
  iconButton: (values: {
    readonly backgroundColor: string
    readonly borderRadius: number
    readonly color: string
    readonly pressedImage: string
    readonly pressedShadow: string
    readonly restImage: string
    readonly restShadow: string
  }) => ({
    alignItems: 'center',
    backgroundColor: values.backgroundColor,
    backgroundImage: { default: values.restImage, ':active': values.pressedImage },
    border: 0,
    borderRadius: values.borderRadius,
    boxShadow: { default: values.restShadow, ':active': values.pressedShadow },
    color: values.color,
    cursor: 'pointer',
    display: 'inline-flex',
    height: 42,
    justifyContent: 'center',
    outline: { ':focus-visible': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-visible': 3 },
    transform: { default: 'translateY(0)', ':active': 'translateY(1px)' },
    transition: 'box-shadow 120ms ease, transform 120ms ease',
    width: 42,
  }),
  rangeControl: {
    height: 42,
    outline: { ':focus-within': '2px solid var(--control-accent)' },
    outlineOffset: { ':focus-within': 3 },
    position: 'relative',
  },
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
  rangeValue: (value: string) => ({ '--catalog-range-value': value }),
  rangeRail: (values: { readonly backgroundColor: string; readonly backgroundImage: string }) => ({
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    borderRadius: 6,
    height: 10,
    left: 9,
    overflow: 'visible',
    position: 'absolute',
    right: 9,
    top: 16,
  }),
  rangeFill: (values: { readonly backgroundColor: string }) => ({
    backgroundColor: values.backgroundColor,
    borderRadius: 6,
    display: 'block',
    height: '100%',
    width: 'var(--catalog-range-value)',
  }),
  rangeKnob: (values: {
    readonly backgroundColor: string
    readonly backgroundImage: string
    readonly boxShadow: string
  }) => ({
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    borderRadius: 3,
    boxShadow: values.boxShadow,
    display: 'block',
    height: 26,
    left: 'var(--catalog-range-value)',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'left 90ms linear',
    width: 14,
  }),
  tableCell: (values: {
    readonly backgroundColor: string
    readonly backgroundImage: string
    readonly color: string
  }) => ({
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    color: values.color,
    padding: '14px 18px',
    textAlign: 'left',
  }),
  tableHead: (values: {
    readonly backgroundColor: string
    readonly backgroundImage: string
    readonly color: string
  }) => ({
    backgroundColor: values.backgroundColor,
    backgroundImage: values.backgroundImage,
    color: values.color,
    fontSize: '0.66rem',
    letterSpacing: '0.09em',
    padding: '14px 18px',
    textAlign: 'left',
    textTransform: 'uppercase',
  }),
  table: { borderCollapse: 'collapse', width: '100%' },
})
