import type { LiquidMaterial } from '@hifi/liquid'
import type { GrammarControlKit, TableKitProps } from './ControlKits'
import { catalogLiquidStyles } from './stylex/catalog-liquid.stylex'
import { stylexProps } from './stylex/shared.stylex'

function toRgb(material: LiquidMaterial, alpha: number): string {
  const { tint } = material
  const r = Math.round(tint.r * 255)
  const g = Math.round(tint.g * 255)
  const b = Math.round(tint.b * 255)
  return `rgb(${r} ${g} ${b} / ${alpha})`
}

export function createLiquidControlKit(material: LiquidMaterial): GrammarControlKit {
  return {
    renderTable({ rows }: TableKitProps) {
      const tableStyle = catalogLiquidStyles.table({
        backdropFilter: `blur(${material.blur}px) saturate(150%)`,
        fill: toRgb(material, Math.min(0.36, material.tint.a + 0.04)),
        shadow: 'inset 0 1px 0 rgb(255 255 255 / 0.42), 0 18px 44px rgb(8 8 35 / 0.24)',
      })
      const headStyle = catalogLiquidStyles.tableHead({
        fill: toRgb(material, Math.min(0.5, material.tint.a + 0.14)),
      })

      return (
        <table {...stylexProps(tableStyle)}>
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
                <th {...stylexProps(catalogLiquidStyles.tableCell)} scope="row">
                  {row.subject}
                </th>
                <td {...stylexProps(catalogLiquidStyles.tableCell)}>{row.operation}</td>
                <td {...stylexProps(catalogLiquidStyles.tableCell)}>{row.rationale}</td>
                <td {...stylexProps(catalogLiquidStyles.tableCell)}>{row.bound}</td>
                <td {...stylexProps(catalogLiquidStyles.tableCell)}>{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
  }
}
