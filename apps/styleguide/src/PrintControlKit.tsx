import type { PrintMaterial } from '@hifi/print'
import type { ChoiceKitProps, GrammarControlKit, RangeKitProps, TableKitProps } from './ControlKits'
import { catalogPrintStyles } from './stylex/catalog-print.stylex'
import { stylexProps } from './stylex/shared.stylex'

export function createPrintControlKit(material: PrintMaterial): GrammarControlKit {
  const hardShadow = (scale: number) => {
    const offset = Math.max(1, material.shadowOffset * scale)
    return `${offset}px ${offset}px 0 color-mix(in srgb, ${material.inkColor} 30%, transparent)`
  }

  return {
    renderChoice({ inputProps, type }: ChoiceKitProps) {
      return (
        <input
          {...inputProps}
          {...stylexProps(
            catalogPrintStyles.choiceInput({
              borderColor: material.inkColor,
              checkedBackground: material.inkColor,
              radius: type === 'checkbox' ? 0 : 999,
              shadow: hardShadow(0.3),
            }),
          )}
          type={type}
        />
      )
    },
    renderRange({ value, onChange }: RangeKitProps) {
      const tickImage = `repeating-linear-gradient(90deg, ${material.inkColor} 0 1px, transparent 1px 100%)`

      return (
        <div
          {...stylexProps(
            catalogPrintStyles.rangeControl({
              ruleColor: material.inkColor,
              ruleWeight: material.ruleWeight,
              tickImage,
            }),
            catalogPrintStyles.rangeValue(`${value}%`),
          )}
        >
          <input
            aria-label="Range"
            {...stylexProps(catalogPrintStyles.rangeInput)}
            max="100"
            min="0"
            onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            type="range"
            value={value}
          />
          <output
            aria-hidden="true"
            {...stylexProps(
              catalogPrintStyles.rangeReadout({
                color: material.inkColor,
                fontFamily: 'var(--guide-display)',
              }),
            )}
          >
            {value}
          </output>
          <i
            aria-hidden="true"
            {...stylexProps(
              catalogPrintStyles.rangeKnob({
                backgroundColor: material.inkColor,
                shadow: hardShadow(0.3),
              }),
            )}
          />
        </div>
      )
    },
    renderTable({ rows }: TableKitProps) {
      const headStyle = catalogPrintStyles.tableHead({
        borderColor: material.inkColor,
        color: material.inkColor,
        fontFamily: 'var(--guide-mono)',
        heavyRule: Math.max(2, material.ruleWeight * 3),
      })
      const cellStyle = catalogPrintStyles.tableCell({
        borderColor: `color-mix(in srgb, ${material.inkColor} 30%, transparent)`,
        color: material.inkColor,
        ruleWeight: material.ruleWeight,
      })

      return (
        <table {...stylexProps(catalogPrintStyles.table({ shadow: hardShadow(1) }))}>
          <thead>
            <tr>
              {['Subject', 'Recommendation', 'Why now', 'Bounds', 'Readiness'].map((heading) => (
                <th {...stylexProps(headStyle)} key={heading} scope="col">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th {...stylexProps(cellStyle)} scope="row">
                  {row.subject}
                </th>
                <td {...stylexProps(cellStyle)}>{row.operation}</td>
                <td {...stylexProps(cellStyle)}>{row.rationale}</td>
                <td {...stylexProps(cellStyle)}>{row.bound}</td>
                <td {...stylexProps(cellStyle)}>{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
  }
}
