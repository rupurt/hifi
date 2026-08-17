import type { PrintMaterial } from '@hifi/print'
import type {
  ButtonKitProps,
  ChoiceKitProps,
  GrammarControlKit,
  IconButtonKitProps,
  RangeKitProps,
  TableKitProps,
} from './ControlKits'
import { catalogPrintStyles } from './stylex/catalog-print.stylex'
import { stylexProps } from './stylex/shared.stylex'

export function createPrintControlKit(material: PrintMaterial): GrammarControlKit {
  const shadowOffset = (scale: number) => Math.max(1, material.shadowOffset * scale)
  const hardShadow = (scale: number) => {
    const offset = shadowOffset(scale)
    return `${offset}px ${offset}px 0 color-mix(in srgb, ${material.inkColor} 30%, transparent)`
  }

  return {
    renderButton({ children, disabled, variant }: ButtonKitProps) {
      const { background, borderColor, color } =
        variant === 'primary'
          ? {
              background: material.accentColor,
              borderColor: material.accentColor,
              color: 'var(--control-accent-contrast)',
            }
          : variant === 'danger'
            ? { background: 'var(--control-danger)', borderColor: 'var(--control-danger)', color: '#fff' }
            : { background: material.paperColor, borderColor: material.inkColor, color: material.inkColor }
      const offset = shadowOffset(0.5)

      return (
        <button
          disabled={disabled}
          {...stylexProps(
            catalogPrintStyles.button({
              background,
              borderColor,
              color,
              pressTranslate: `translate(${offset}px, ${offset}px)`,
              shadow: hardShadow(0.5),
            }),
          )}
          type="button"
        >
          {children}
        </button>
      )
    },
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
    renderIconButton({ ariaLabel, icon }: IconButtonKitProps) {
      const offset = shadowOffset(0.5)

      return (
        <button
          aria-label={ariaLabel}
          {...stylexProps(
            catalogPrintStyles.iconButton({
              background: material.paperColor,
              borderColor: material.inkColor,
              color: material.inkColor,
              pressTranslate: `translate(${offset}px, ${offset}px)`,
              shadow: hardShadow(0.5),
            }),
          )}
          type="button"
        >
          {icon}
        </button>
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
