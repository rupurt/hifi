import * as stylex from '@stylexjs/stylex'

export const catalogLiquidStyles = stylex.create({
  table: (values: {
    readonly backdropFilter: string
    readonly fill: string
    readonly shadow: string
  }) => ({
    backdropFilter: values.backdropFilter,
    backgroundColor: values.fill,
    borderCollapse: 'collapse',
    borderColor: 'rgb(255 255 255 / 0.35)',
    borderRadius: 'var(--control-radius)',
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: values.shadow,
    overflow: 'hidden',
    width: '100%',
  }),
  tableHead: (values: { readonly fill: string }) => ({
    backgroundColor: values.fill,
    color: '#f7fbff',
    fontSize: '0.66rem',
    letterSpacing: '0.09em',
    padding: '14px 18px',
    textAlign: 'left',
    textTransform: 'uppercase',
  }),
  tableCell: {
    borderTopColor: 'rgb(255 255 255 / 0.22)',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: '#f7fbff',
    padding: '14px 18px',
    textAlign: 'left',
  },
})
