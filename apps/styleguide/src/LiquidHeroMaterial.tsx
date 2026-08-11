import { type LiquidMaterial, type LiquidThemeName, supportsLiquidDomRendering } from '@hifi/liquid'
import { Frame, Glass, GlassContainer, LiquidCanvas } from '@liquid-dom/react'
import { useEffect, useRef, useState } from 'react'
import { liquidFabrics } from './liquidFabrics'
import { liquidStyles as styles } from './stylex/liquid.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

interface LiquidHeroMaterialProps {
  readonly description: string
  readonly index: number
  readonly label: string
  readonly material: LiquidMaterial
  readonly onReliefChange: (value: number) => void
  readonly onTransmissionChange: (value: number) => void
  readonly relief: number
  readonly theme: LiquidThemeName
  readonly transmission: number
}

export function LiquidHeroMaterial({
  description,
  index,
  label,
  material,
  onReliefChange,
  onTransmissionChange,
  relief,
  theme,
  transmission,
}: LiquidHeroMaterialProps) {
  const fieldRef = useRef<HTMLElement>(null)
  const [rendererFailed, setRendererFailed] = useState(false)
  const [size, setSize] = useState({ height: 0, width: 0 })
  const canRender =
    supportsLiquidDomRendering() && !rendererFailed && size.height > 0 && size.width > 0
  const fabric = liquidFabrics[theme]
  const tint = `${Math.round(material.tint.r * 255)} ${Math.round(
    material.tint.g * 255,
  )} ${Math.round(material.tint.b * 255)}`

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    const measure = () => {
      const bounds = field.getBoundingClientRect()
      setSize({
        height: Math.max(1, bounds.height - 40),
        width: Math.max(1, bounds.width - 40),
      })
    }
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(field)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      {...stylexProps(
        styles.heroMaterial,
        styles.heroFabric(fabric),
        styles.heroMaterialVariables({
          blur: `${material.blur}px`,
          edge: `${Math.max(1, material.bezelWidth / 18)}px`,
          fill: `rgb(${tint} / ${Math.min(0.44, material.tint.a + material.opacity * 0.1)})`,
          radius: `${material.cornerRadius}px`,
          shadowBlur: `${24 + material.thickness * 0.65}px`,
          shadowY: `${material.thickness * 0.3}px`,
          specular: 0.16 + material.specularOpacity * 0.5,
        }),
      )}
      aria-label={`${label} liquid theme specimen`}
      data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
      ref={fieldRef}
    >
      <span
        className={className(styles.heroMaterialObject, styles.heroMaterialObjectA)}
        aria-hidden="true"
      />
      <span
        className={className(styles.heroMaterialObject, styles.heroMaterialObjectB)}
        aria-hidden="true"
      />
      <span className={className(styles.heroMaterialRule)} aria-hidden="true" />

      {canRender ? (
        <LiquidCanvas
          className={className(styles.heroMaterialCanvas)}
          canvasClassName={className(styles.heroMaterialCanvas)}
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
              shadowBlur={24 + material.thickness * 0.65}
              shadowColor={{ r: 0.01, g: 0.02, b: 0.1, a: 0.38 }}
              shadowOffsetY={material.thickness * 0.3}
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

      <div
        className={className(
          styles.heroMaterialGlass,
          !canRender && styles.heroMaterialFallback,
          theme === 'prismatic' && styles.heroMaterialFrozen,
        )}
        aria-hidden="true"
      />

      <div className={className(styles.heroMaterialContent)}>
        <header className={className(styles.heroMaterialTopline)}>
          <span className={className(styles.heroMaterialMeta)}>
            Material {(index + 1).toString().padStart(2, '0')} / live theme
          </span>
          <span className={className(styles.heroMaterialMeta, styles.heroMaterialProfile)}>
            {material.surfaceProfile}
          </span>
        </header>

        <div className={className(styles.heroMaterialCopy)}>
          <strong className={className(styles.heroMaterialName)}>{label}</strong>
          <p className={className(styles.heroMaterialDescription)}>{description}</p>
        </div>

        <fieldset className={className(styles.heroMaterialFooter)}>
          <legend className={className(sharedStyles.visuallyHidden)}>
            Constrained theme controls
          </legend>
          <ConstraintControl
            caption={`${material.blur.toFixed(1)}px blur · ${Math.round(material.opacity * 100)}% opacity`}
            label="Transmission"
            onChange={onTransmissionChange}
            value={transmission}
          />
          <ConstraintControl
            caption={`${material.thickness.toFixed(0)}px depth · ${material.displacementFactor.toFixed(2)} displacement`}
            label="Relief"
            onChange={onReliefChange}
            value={relief}
          />
        </fieldset>
      </div>
    </section>
  )
}

function ConstraintControl({
  caption,
  label,
  onChange,
  value,
}: {
  readonly caption: string
  readonly label: string
  readonly onChange: (value: number) => void
  readonly value: number
}) {
  return (
    <label className={className(styles.heroConstraint)}>
      <span className={className(styles.heroConstraintHeader)}>
        <span className={className(styles.heroMaterialMeta)}>{label}</span>
        <output className={className(styles.heroConstraintValue)}>{value}%</output>
      </span>
      <input
        aria-label={`${label} constraint`}
        className={className(styles.heroConstraintInput)}
        max={100}
        min={0}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        type="range"
        value={value}
      />
      <small className={className(styles.heroConstraintCaption)}>{caption}</small>
    </label>
  )
}
