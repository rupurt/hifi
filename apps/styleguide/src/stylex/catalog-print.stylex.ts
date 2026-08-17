import * as stylex from '@stylexjs/stylex'

export const catalogPrintStyles = stylex.create({
  choiceInput: (values: {
    readonly borderColor: string
    readonly checkedBackground: string
    readonly radius: number
    readonly shadow: string
  }) => ({
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':checked': values.checkedBackground },
    borderColor: values.borderColor,
    borderRadius: values.radius,
    borderStyle: 'solid',
    boxShadow: values.shadow,
    cursor: 'pointer',
    height: 18,
    margin: 0,
    outline: { ':focus-visible': `2px solid ${values.borderColor}` },
    outlineOffset: { ':focus-visible': 3 },
    width: 18,
  }),
  rangeControl: (values: {
    readonly ruleColor: string
    readonly ruleWeight: number
    readonly tickImage: string
  }) => ({
    borderBottomColor: values.ruleColor,
    borderBottomStyle: 'solid',
    borderBottomWidth: values.ruleWeight,
    backgroundImage: values.tickImage,
    backgroundPosition: 'bottom',
    backgroundRepeat: 'repeat-x',
    backgroundSize: '10% 6px',
    height: 46,
    outline: { ':focus-within': `2px solid ${values.ruleColor}` },
    outlineOffset: { ':focus-within': 3 },
    position: 'relative',
  }),
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
  rangeReadout: (values: { readonly color: string; readonly fontFamily: string }) => ({
    color: values.color,
    fontFamily: values.fontFamily,
    fontSize: '1.1rem',
    fontWeight: 900,
    left: 'var(--catalog-range-value)',
    position: 'absolute',
    top: 0,
    transform: 'translateX(-50%)',
  }),
  rangeKnob: (values: { readonly backgroundColor: string; readonly shadow: string }) => ({
    backgroundColor: values.backgroundColor,
    boxShadow: values.shadow,
    bottom: 0,
    display: 'block',
    height: 18,
    left: 'var(--catalog-range-value)',
    position: 'absolute',
    transform: 'translateX(-50%)',
    width: 3,
  }),
  table: (values: { readonly shadow: string }) => ({
    borderCollapse: 'collapse',
    boxShadow: values.shadow,
    width: '100%',
  }),
  tableHead: (values: {
    readonly borderColor: string
    readonly color: string
    readonly fontFamily: string
    readonly heavyRule: number
  }) => ({
    borderBottomColor: values.borderColor,
    borderBottomStyle: 'solid',
    borderBottomWidth: values.heavyRule,
    color: values.color,
    fontFamily: values.fontFamily,
    fontSize: '0.66rem',
    letterSpacing: '0.09em',
    padding: '14px 18px',
    textAlign: 'left',
    textTransform: 'uppercase',
  }),
  tableCell: (values: {
    readonly borderColor: string
    readonly color: string
    readonly ruleWeight: number
  }) => ({
    borderTopColor: values.borderColor,
    borderTopStyle: 'solid',
    borderTopWidth: values.ruleWeight,
    color: values.color,
    padding: '14px 18px',
    textAlign: 'left',
  }),
})
