import { getTextureMaterialStyle, type TextureMaterial } from '@hifi/texture'
import type { ChoiceKitProps, GrammarControlKit, RangeKitProps, TableKitProps } from './ControlKits'
import { catalogTextureStyles } from './stylex/catalog-texture.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

export function createTextureControlKit(material: TextureMaterial): GrammarControlKit {
  const uncheckedSwatch = getTextureMaterialStyle({ ...material, scale: 4 })
  const checkedSwatch = getTextureMaterialStyle({
    ...material,
    accentColor: material.accentColor,
    backgroundColor: material.accentColor,
    scale: 4,
    textureColor: material.highlightColor,
  })
  const railSwatch = getTextureMaterialStyle({
    ...material,
    intensity: material.intensity * 0.6,
    scale: 3,
  })
  const knobSwatch = getTextureMaterialStyle({
    ...material,
    backgroundColor: material.accentColor,
    scale: 3,
  })
  const knobShadow = `0 ${Math.max(1, material.shadowDepth * 0.2)}px ${Math.max(3, material.shadowDepth * 0.5)}px rgb(42 29 16 / 0.35)`
  const headSwatch = getTextureMaterialStyle({
    ...material,
    backgroundColor: material.textureColor,
    scale: 3,
  })
  const rowSwatch = getTextureMaterialStyle({
    ...material,
    intensity: material.intensity * 0.35,
    scale: 6,
  })

  return {
    renderChoice({ inputProps, type }: ChoiceKitProps) {
      return (
        <input
          {...inputProps}
          {...stylexProps(
            catalogTextureStyles.choiceInput,
            catalogTextureStyles.choiceMaterial({
              backgroundSize: uncheckedSwatch.backgroundSize as string,
              borderColor: material.textureColor,
              borderRadius: type === 'checkbox' ? material.borderRadius * 0.3 : 999,
              checkedBackground: material.accentColor,
              checkedBorderColor: material.accentColor,
              checkedImage: checkedSwatch.backgroundImage as string,
              uncheckedBackground: uncheckedSwatch.backgroundColor as string,
              uncheckedImage: uncheckedSwatch.backgroundImage as string,
            }),
          )}
          type={type}
        />
      )
    },
    renderRange({ value, onChange }: RangeKitProps) {
      return (
        <div
          {...stylexProps(
            catalogTextureStyles.rangeControl,
            catalogTextureStyles.rangeValue(`${value}%`),
          )}
        >
          <input
            aria-label="Range"
            className={className(catalogTextureStyles.rangeInput)}
            max="100"
            min="0"
            onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            type="range"
            value={value}
          />
          <span
            aria-hidden="true"
            {...stylexProps(
              catalogTextureStyles.rangeRail({
                backgroundColor: railSwatch.backgroundColor as string,
                backgroundImage: railSwatch.backgroundImage as string,
              }),
            )}
          >
            <i
              {...stylexProps(
                catalogTextureStyles.rangeFill({ backgroundColor: material.accentColor }),
              )}
            />
            <i
              aria-hidden="true"
              {...stylexProps(
                catalogTextureStyles.rangeKnob({
                  backgroundColor: knobSwatch.backgroundColor as string,
                  backgroundImage: knobSwatch.backgroundImage as string,
                  boxShadow: knobShadow,
                }),
              )}
            />
          </span>
        </div>
      )
    },
    renderTable({ rows }: TableKitProps) {
      const headStyle = catalogTextureStyles.tableHead({
        backgroundColor: headSwatch.backgroundColor as string,
        backgroundImage: headSwatch.backgroundImage as string,
        color: material.backgroundColor,
      })
      const cellStyle = catalogTextureStyles.tableCell({
        backgroundColor: rowSwatch.backgroundColor as string,
        backgroundImage: rowSwatch.backgroundImage as string,
        color: material.foregroundColor,
      })

      return (
        <table {...stylexProps(catalogTextureStyles.table)}>
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
