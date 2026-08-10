import type { CSSProperties, Key, ReactNode } from 'react'
import type { KineticThemeName } from './grammar.js'
import { type KineticMaterial, kineticThemeMaterials } from './material.js'
import { getKineticMaterialStyle } from './KineticSurface.js'

export type KineticDenseTableAlignment = 'left' | 'center' | 'right'

export interface KineticDenseTableColumn<Row> {
  readonly align?: KineticDenseTableAlignment
  readonly header: ReactNode
  readonly id: string
  readonly render: (row: Row, index: number) => ReactNode
  readonly rowHeader?: boolean
  readonly width?: CSSProperties['width']
}

export interface KineticDenseTableProps<Row> {
  readonly ariaLabel: string
  readonly className?: string
  readonly columns: readonly KineticDenseTableColumn<Row>[]
  readonly emptyState?: ReactNode
  readonly getRowClassName?: (row: Row, index: number) => string | undefined
  readonly getRowKey: (row: Row, index: number) => Key
  readonly getRowStyle?: (row: Row, index: number) => CSSProperties | undefined
  readonly material?: KineticMaterial
  readonly minWidth?: CSSProperties['minWidth']
  readonly rows: readonly Row[]
  readonly style?: CSSProperties
  readonly theme?: KineticThemeName
}

/**
 * A semantic, horizontally bounded table for interfaces that need to keep many
 * dimensions aligned without collapsing them into ambiguous cards.
 */
export function KineticDenseTable<Row>({
  ariaLabel,
  className,
  columns,
  emptyState = 'No records in this bounded view.',
  getRowClassName,
  getRowKey,
  getRowStyle,
  material,
  minWidth = 760,
  rows,
  style,
  theme = 'precision',
}: KineticDenseTableProps<Row>) {
  if (columns.length === 0) {
    throw new TypeError('KineticDenseTable requires at least one column')
  }

  const selected = material ?? kineticThemeMaterials[theme]
  const rule = `color-mix(in srgb, ${selected.foregroundColor} 24%, transparent)`
  const cellStyle: CSSProperties = {
    borderBottom: `1px solid ${rule}`,
    borderRight: `1px solid ${rule}`,
    lineHeight: 1.4,
    overflowWrap: 'anywhere',
    padding: 'var(--kinetic-dense-table-cell-padding, 13px 18px)',
    textAlign: 'left',
    verticalAlign: 'top',
  }

  return (
    <div
      className={className}
      data-kinetic-dense-table=""
      data-kinetic-response={selected.response}
      style={{
        ...getKineticMaterialStyle(selected),
        border: `1px solid ${rule}`,
        borderRadius: selected.radius,
        overflowX: 'auto',
        ...style,
      }}
    >
      <table
        aria-label={ariaLabel}
        style={{
          borderCollapse: 'collapse',
          fontVariantNumeric: 'tabular-nums',
          minWidth,
          tableLayout: 'fixed',
          width: '100%',
        }}
      >
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead
          style={{
            background: selected.foregroundColor,
            color: selected.backgroundColor,
          }}
        >
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                key={column.id}
                scope="col"
                style={{
                  ...cellStyle,
                  borderBottomColor: selected.foregroundColor,
                  borderRightColor: `color-mix(in srgb, ${selected.backgroundColor} 30%, transparent)`,
                  borderRightWidth: columnIndex === columns.length - 1 ? 0 : 1,
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.09em',
                  paddingBlock: '11px',
                  textAlign: column.align ?? 'left',
                  textTransform: 'uppercase',
                  verticalAlign: 'middle',
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  ...cellStyle,
                  borderBottomWidth: 0,
                  borderRightWidth: 0,
                  color: `color-mix(in srgb, ${selected.foregroundColor} 62%, transparent)`,
                  paddingBlock: '32px',
                  textAlign: 'center',
                }}
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                className={getRowClassName?.(row, rowIndex)}
                data-kinetic-dense-table-row=""
                key={getRowKey(row, rowIndex)}
                style={getRowStyle?.(row, rowIndex)}
              >
                {columns.map((column, columnIndex) => {
                  const content = column.render(row, rowIndex)
                  const style = {
                    ...cellStyle,
                    borderBottomWidth: rowIndex === rows.length - 1 ? 0 : 1,
                    borderRightWidth: columnIndex === columns.length - 1 ? 0 : 1,
                    textAlign: column.align ?? 'left',
                  } satisfies CSSProperties

                  return column.rowHeader ? (
                    <th key={column.id} scope="row" style={style}>
                      {content}
                    </th>
                  ) : (
                    <td key={column.id} style={style}>
                      {content}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
