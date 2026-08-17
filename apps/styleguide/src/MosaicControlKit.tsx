import {
  chamferedRectPath,
  chamferedRectPathResponsive,
  computeBevelFilter,
  type MosaicMaterial,
  MosaicSurface,
  MosaicTile,
} from '@hifi/mosaic'
import type {
  ButtonKitProps,
  ChoiceKitProps,
  GrammarControlKit,
  IconButtonKitProps,
  RangeKitProps,
  SegmentKitProps,
  SwitchKitProps,
  TableKitProps,
} from './ControlKits'
import { catalogMosaicStyles } from './stylex/catalog-mosaic.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

const CHOICE_SIZE = 18
const CHECKBOX_CHAMFER = 4
const RADIO_CHAMFER = 8

export function createMosaicControlKit(material: MosaicMaterial): GrammarControlKit {
  const restFilter = computeBevelFilter(material)
  // Pressed state inverts the light source and softens the lift, so the same bevel math that
  // makes a tile look raised at rest makes it read as pushed in on press — the light now
  // catches the recessed edge instead of the raised one.
  const pressedFilter = computeBevelFilter({
    ...material,
    lightAngle: material.lightAngle + 180,
    relief: material.relief * 0.4,
  })
  const buttonChamfer = chamferedRectPathResponsive(Math.min(material.radius, 14))

  return {
    renderButton({ children, disabled, variant }: ButtonKitProps) {
      const { background, color } =
        variant === 'primary'
          ? { background: material.accentColor, color: material.accentTextColor }
          : variant === 'danger'
            ? { background: 'var(--control-danger)', color: '#fff' }
            : { background: material.tileColor, color: material.tileTextColor }

      return (
        <button
          disabled={disabled}
          {...stylexProps(
            catalogMosaicStyles.button({
              background,
              clipPath: buttonChamfer,
              color,
              pressedFilter,
              restFilter,
            }),
          )}
          type="button"
        >
          {children}
        </button>
      )
    },
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
              filter: restFilter,
              uncheckedBackground: material.jointColor,
            }),
          )}
          type={type}
        />
      )
    },
    renderIconButton({ ariaLabel, icon }: IconButtonKitProps) {
      return (
        <button
          aria-label={ariaLabel}
          {...stylexProps(
            catalogMosaicStyles.iconButton({
              background: material.tileColor,
              clipPath: buttonChamfer,
              color: material.tileTextColor,
              pressedFilter,
              restFilter,
            }),
          )}
          type="button"
        >
          {icon}
        </button>
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
    renderSegment({ children, onClick, selected }: SegmentKitProps) {
      const { background, color } = selected
        ? { background: material.accentColor, color: material.accentTextColor }
        : { background: material.tileColor, color: material.tileTextColor }

      return (
        <button
          aria-pressed={selected}
          onClick={onClick}
          {...stylexProps(
            catalogMosaicStyles.button({
              background,
              clipPath: buttonChamfer,
              color,
              pressedFilter,
              restFilter,
            }),
          )}
          type="button"
        >
          {children}
        </button>
      )
    },
    renderSwitch({ ariaLabel, checked, onClick }: SwitchKitProps) {
      const thumbSize = 24
      const trackWidth = 58
      const trackPadding = 3
      const translateX = trackWidth - trackPadding * 2 - thumbSize

      return (
        <button
          aria-checked={checked}
          aria-label={ariaLabel}
          onClick={onClick}
          role="switch"
          {...stylexProps(
            catalogMosaicStyles.switchTrack({
              background: material.jointColor,
              clipPath: chamferedRectPath(trackWidth, 32, Math.min(material.radius, 10)),
            }),
          )}
          type="button"
        >
          <span
            {...stylexProps(
              catalogMosaicStyles.switchThumb({
                background: checked ? material.accentColor : material.tileColor,
                clipPath: chamferedRectPath(thumbSize, thumbSize, Math.min(material.radius, 6)),
                filter: restFilter,
                translateX: checked ? `${translateX}px` : '0px',
              }),
            )}
          />
        </button>
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
