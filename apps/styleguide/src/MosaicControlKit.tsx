import {
  chamferedRectPath,
  computeBevelFilter,
  type MosaicMaterial,
  MosaicSurface,
  MosaicTile,
} from '@hifi/mosaic'
import type { ChoiceKitProps, GrammarControlKit, RangeKitProps, TableKitProps } from './ControlKits'
import { catalogMosaicStyles } from './stylex/catalog-mosaic.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

const CHOICE_SIZE = 18
const CHECKBOX_CHAMFER = 4
const RADIO_CHAMFER = 8

export function createMosaicControlKit(material: MosaicMaterial): GrammarControlKit {
  const filter = computeBevelFilter(material)

  return {
    renderChoice({ inputProps, type }: ChoiceKitProps) {
      const chamfer = type === 'checkbox' ? CHECKBOX_CHAMFER : RADIO_CHAMFER

      return (
        <input
          {...inputProps}
          {...stylexProps(
            catalogMosaicStyles.choiceInput,
            catalogMosaicStyles.choiceMaterial({
              border: material.jointColor,
              checkedBackground: material.accentColor,
              clipPath: chamferedRectPath(CHOICE_SIZE, CHOICE_SIZE, chamfer),
              filter,
              uncheckedBackground: material.jointColor,
            }),
          )}
          type={type}
        />
      )
    },
    renderRange({ value, onChange }: RangeKitProps) {
      return (
        <div className={className(catalogMosaicStyles.rangeWrap)}>
          <MosaicSurface
            className={className(catalogMosaicStyles.rangeSurface)}
            material={material}
          >
            <MosaicTile
              className={className(catalogMosaicStyles.rangeTile)}
              id="fill"
              material={material}
              tone="accent"
              weight={value}
            />
            <MosaicTile
              className={className(catalogMosaicStyles.rangeTile)}
              id="track"
              material={material}
              tone="tile"
              weight={100 - value}
            />
          </MosaicSurface>
          <input
            aria-label="Range"
            className={className(catalogMosaicStyles.rangeInput)}
            max="100"
            min="0"
            onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            type="range"
            value={value}
          />
        </div>
      )
    },
    renderTable({ rows }: TableKitProps) {
      const headStyle = catalogMosaicStyles.tableHead({
        background: material.tileColor,
        foreground: material.tileTextColor,
      })
      const cellStyle = catalogMosaicStyles.tableCell({
        background: material.backgroundColor,
        foreground: material.foregroundColor,
      })

      return (
        <table
          {...stylexProps(
            catalogMosaicStyles.tableShell({
              grout: material.jointColor,
              spacing: `${material.jointWidth}px`,
            }),
          )}
        >
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
