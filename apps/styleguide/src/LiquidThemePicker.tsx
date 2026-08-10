import {
  Frame,
  Glass,
  GlassContainer,
  LiquidCanvas,
} from '@liquid-dom/react'
import {
  liquidGrammar,
  type LiquidMaterial,
  liquidThemeMaterials,
  type LiquidThemeName,
  supportsLiquidDomRendering,
} from '@hifi/liquid'
import { useEffect, useRef, useState } from 'react'
import { liquidPickerStyles as styles } from './stylex/liquid-picker.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

interface LiquidThemePickerProps {
  readonly label?: string
  readonly onChange: (name: LiquidThemeName) => void
  readonly value: LiquidThemeName
}

export function LiquidThemePicker({
  label = 'Material theme',
  onChange,
  value,
}: LiquidThemePickerProps) {
  return (
    <fieldset className={className(styles.picker)}>
      <legend className={className(styles.label)}>{label}</legend>
      <div className={className(styles.grid)}>
        {liquidGrammar.themes.map((theme, index) => {
          const name = theme.name as LiquidThemeName

          return (
            <LiquidMaterialCard
              description={theme.description}
              index={index}
              key={name}
              label={theme.label}
              material={liquidThemeMaterials[name]}
              name={name}
              onSelect={() => onChange(name)}
              selected={name === value}
            />
          )
        })}
      </div>
    </fieldset>
  )
}

function LiquidMaterialCard({
  description,
  index,
  label,
  material,
  name,
  onSelect,
  selected,
}: {
  readonly description: string
  readonly index: number
  readonly label: string
  readonly material: LiquidMaterial
  readonly name: LiquidThemeName
  readonly onSelect: () => void
  readonly selected: boolean
}) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const [rendererFailed, setRendererFailed] = useState(false)
  const [size, setSize] = useState({ height: 0, width: 0 })
  const rendererSupported = supportsLiquidDomRendering() && !rendererFailed
  const canRender = rendererSupported && size.height > 0 && size.width > 0
  const tint = `${Math.round(material.tint.r * 255)} ${Math.round(
    material.tint.g * 255,
  )} ${Math.round(material.tint.b * 255)}`

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    const measure = () => {
      const bounds = field.getBoundingClientRect()
      setSize({
        height: Math.max(1, bounds.height - 28),
        width: Math.max(1, bounds.width - 28),
      })
    }
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(field)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      {...stylexProps(
        styles.field,
        styles.material({
          blur: `${material.blur}px`,
          chroma: `${material.dispersion * 240}px`,
          chromaNegative: `${material.dispersion * -240}px`,
          edge: `${Math.max(1, material.bezelWidth / 18)}px`,
          fill: `rgb(${tint} / ${Math.min(
            0.42,
            material.tint.a + material.opacity * 0.09,
          )})`,
          radius: `${material.cornerRadius}px`,
          shadowBlur: `${18 + material.thickness * 0.55}px`,
          shadowY: `${material.thickness * 0.24}px`,
          specular: 0.16 + material.specularOpacity * 0.5,
          tint: `rgb(${tint})`,
        }),
        name === 'clear' && styles.fieldClear,
        name === 'tinted' && styles.fieldTinted,
        name === 'frosted' && styles.fieldFrosted,
        name === 'blurred' && styles.fieldBlurred,
        name === 'prismatic' && styles.fieldPrismatic,
        name === 'smoked' && styles.fieldSmoked,
      )}
      data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
      ref={fieldRef}
    >
      <span className={className(styles.fieldObject, styles.fieldObjectA)} aria-hidden="true" />
      <span className={className(styles.fieldObject, styles.fieldObjectB)} aria-hidden="true" />
      <span className={className(styles.fieldRule)} aria-hidden="true" />

      {canRender ? (
        <LiquidCanvas
          className={className(styles.canvas)}
          canvasClassName={className(styles.canvas)}
          maxDpr={1.5}
          onError={() => setRendererFailed(true)}
        >
          <Frame maxHeight={Infinity} maxWidth={Infinity}>
            <GlassContainer
              bezelWidth={material.bezelWidth}
              blur={material.blur}
              contentDepth={material.contentDepth}
              contentIor={material.contentIor}
              dispersion={material.dispersion}
              displacementBlur={material.displacementBlur}
              displacementFactor={material.displacementFactor}
              ior={material.ior}
              opacity={material.opacity}
              shadowBlur={18 + material.thickness * 0.55}
              shadowColor={{ r: 0.01, g: 0.02, b: 0.1, a: 0.34 }}
              shadowOffsetY={material.thickness * 0.24}
              specularOpacity={material.specularOpacity}
              specularSharpness={material.specularSharpness}
              specularStrength={material.specularStrength}
              surfaceProfile={material.surfaceProfile}
              thickness={material.thickness}
              tint={material.tint}
            >
              <Frame height={size.height} width={size.width}>
                <Glass
                  cornerRadius={material.cornerRadius}
                  cornerSmoothing={material.cornerSmoothing}
                />
              </Frame>
            </GlassContainer>
          </Frame>
        </LiquidCanvas>
      ) : null}

      <button
        aria-pressed={selected}
        className={className(
          styles.card,
          !canRender && styles.fallbackGlass,
          material.surfaceProfile === 'concave' && !canRender && styles.fallbackConcave,
          material.surfaceProfile === 'lip' && !canRender && styles.fallbackLip,
          name === 'prismatic' && styles.cardFrozen,
          selected && styles.cardSelected,
        )}
        onClick={onSelect}
        type="button"
      >
        <span className={className(styles.cardTopline)}>
          <span className={className(styles.cardIndex)}>
            Material {(index + 1).toString().padStart(2, '0')}
          </span>
          <span className={className(styles.profile)}>{material.surfaceProfile}</span>
        </span>

        <span className={className(styles.cardCopy)}>
          <strong className={className(styles.cardName)}>{label}</strong>
          <span className={className(styles.description)}>{description}</span>
        </span>

        <span className={className(styles.cardFooter)}>
          <span className={className(styles.metrics)}>
            <Metric label="IOR" value={material.ior.toFixed(2)} />
            <Metric label="Blur" value={`${material.blur}px`} />
            <Metric label="Depth" value={`${material.thickness}px`} />
            <Metric label="Tint" value={`${Math.round(material.tint.a * 100)}%`} />
          </span>
          <span className={className(styles.selectedMark, selected && styles.selectedMarkVisible)}>
            <i className={className(styles.selectedDot)} />
            In use
          </span>
        </span>
      </button>
    </div>
  )
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <span className={className(styles.metric)}>
      <small className={className(styles.metricLabel)}>{label}</small>
      <strong className={className(styles.metricValue)}>{value}</strong>
    </span>
  )
}
