import { getTextureMaterialStyle, type TextureMaterial } from '@hifi/texture'
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
import { catalogTextureStyles } from './stylex/catalog-texture.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

function buttonImage(material: TextureMaterial, backgroundColor: string, textureColor: string, intensity: number) {
  return getTextureMaterialStyle({ ...material, backgroundColor, intensity, scale: 4, textureColor })
    .backgroundImage as string
}

function buttonShadow(shadowDepth: number, compressed: boolean) {
  const depth = compressed ? shadowDepth * 0.2 : shadowDepth
  return `0 ${Math.max(compressed ? 0 : 1, depth * 0.3)}px ${Math.max(1, depth * 0.6)}px rgb(42 29 16 / ${compressed ? 0.24 : 0.32})`
}

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
    renderButton({ children, disabled, variant }: ButtonKitProps) {
      const { background, color, textureColor } =
        variant === 'primary'
          ? {
              background: material.accentColor,
              color: 'var(--control-accent-contrast)',
              textureColor: material.highlightColor,
            }
          : variant === 'danger'
            ? { background: 'var(--control-danger)', color: '#fff', textureColor: material.highlightColor }
            : {
                background: material.backgroundColor,
                color: material.foregroundColor,
                textureColor: material.textureColor,
              }

      return (
        <button
          disabled={disabled}
          {...stylexProps(
            catalogTextureStyles.button({
              backgroundColor: background,
              borderRadius: material.borderRadius,
              color,
              pressedImage: buttonImage(material, background, textureColor, Math.min(1, material.intensity * 2)),
              pressedShadow: buttonShadow(material.shadowDepth, true),
              restImage: buttonImage(material, background, textureColor, material.intensity),
              restShadow: buttonShadow(material.shadowDepth, false),
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
    renderIconButton({ ariaLabel, icon }: IconButtonKitProps) {
      return (
        <button
          aria-label={ariaLabel}
          {...stylexProps(
            catalogTextureStyles.iconButton({
              backgroundColor: material.backgroundColor,
              borderRadius: material.borderRadius,
              color: material.foregroundColor,
              pressedImage: buttonImage(
                material,
                material.backgroundColor,
                material.textureColor,
                Math.min(1, material.intensity * 2),
              ),
              pressedShadow: buttonShadow(material.shadowDepth, true),
              restImage: buttonImage(
                material,
                material.backgroundColor,
                material.textureColor,
                material.intensity,
              ),
              restShadow: buttonShadow(material.shadowDepth, false),
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
    renderSegment({ children, onClick, selected }: SegmentKitProps) {
      const background = selected ? material.accentColor : material.backgroundColor
      const textureColor = selected ? material.highlightColor : material.textureColor
      const intensity = selected ? Math.min(1, material.intensity * 1.6) : material.intensity

      return (
        <button
          aria-pressed={selected}
          onClick={onClick}
          {...stylexProps(
            catalogTextureStyles.segment({
              backgroundColor: background,
              backgroundImage: buttonImage(material, background, textureColor, intensity),
              borderRadius: material.borderRadius,
              boxShadow: buttonShadow(material.shadowDepth, selected),
              color: selected ? 'var(--control-accent-contrast)' : material.foregroundColor,
            }),
          )}
          type="button"
        >
          {children}
        </button>
      )
    },
    renderSwitch({ ariaLabel, checked, onClick }: SwitchKitProps) {
      const trackBackground = checked ? material.accentColor : material.backgroundColor
      const trackImage = buttonImage(
        material,
        trackBackground,
        checked ? material.highlightColor : material.textureColor,
        checked ? Math.min(1, material.intensity * 1.3) : material.intensity * 0.6,
      )
      const thumbImage = buttonImage(material, material.backgroundColor, material.textureColor, material.intensity)

      return (
        <button
          aria-checked={checked}
          aria-label={ariaLabel}
          onClick={onClick}
          role="switch"
          {...stylexProps(
            catalogTextureStyles.switchTrack({
              backgroundColor: trackBackground,
              backgroundImage: trackImage,
            }),
          )}
          type="button"
        >
          <span
            {...stylexProps(
              catalogTextureStyles.switchThumb({
                backgroundColor: material.backgroundColor,
                backgroundImage: thumbImage,
                boxShadow: knobShadow,
                translateX: checked ? '28px' : '0px',
              }),
            )}
          />
        </button>
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
