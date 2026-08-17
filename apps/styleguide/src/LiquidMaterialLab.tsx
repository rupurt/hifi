import {
  type LiquidMaterial,
  type LiquidSurfaceProfile,
  type LiquidThemeName,
  liquidThemeMaterials,
  serializeLiquidMaterial,
  supportsLiquidDomRendering,
} from '@hifi/liquid'
import { Frame, Glass, GlassContainer, LiquidCanvas, spring } from '@liquid-dom/react'
import { useMemo, useState } from 'react'
import {
  computeMaterialStyle,
  fromHexColor,
  LiquidBackdrop,
  RangeControl,
  StageFooter,
  StageHeader,
  toFileName,
  toHexColor,
} from './LiquidStageChrome'
import { liquidInteractionStyles as styles } from './stylex/liquid-interactions.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

const MORPH_SPRING = spring({ stiffness: 360, damping: 31 })

/** The grammar's own tune-the-material widget — every other grammar keeps this in the
 * material-heading section right after the hero (theme picker + material lab together); this
 * used to live 700 lines into the page wearing a "Forms" section's clothes. */
export function LiquidMaterialLab({
  material,
  onMaterialChange,
  theme,
}: {
  readonly material: LiquidMaterial
  readonly onMaterialChange: (material: LiquidMaterial) => void
  readonly theme: LiquidThemeName
}) {
  const themeMaterial = liquidThemeMaterials[theme]
  const [rendererFailed, setRendererFailed] = useState(false)
  const [materialEnabled, setMaterialEnabled] = useState(true)
  const [exportStatus, setExportStatus] = useState('Applied to grammar')
  const canRender = supportsLiquidDomRendering() && !rendererFailed

  const materialJson = useMemo(() => serializeLiquidMaterial(material), [material])
  const studyName = material.name
  const surfaceProfile = material.surfaceProfile
  const blur = material.blur
  const bezelWidth = material.bezelWidth
  const cornerRadius = material.cornerRadius
  const dispersion = material.dispersion
  const displacement = material.displacementFactor
  const refraction = material.ior
  const specular = material.specularOpacity
  const thickness = material.thickness
  const tintColor = toHexColor(material.tint)
  const tint = Math.round(material.tint.a * 100)
  const materialStyle = computeMaterialStyle(material, materialEnabled ? material.opacity : 0.08)

  function resetToPreset() {
    onMaterialChange(themeMaterial)
    setExportStatus('Preset restored')
  }

  function setStudyName(name: string) {
    onMaterialChange({ ...material, name: name.trimStart() || 'Untitled liquid material' })
  }

  function setSurfaceProfile(profile: LiquidSurfaceProfile) {
    onMaterialChange({ ...material, surfaceProfile: profile })
  }

  function setBlur(value: number) {
    onMaterialChange({ ...material, blur: value })
  }

  function setBezelWidth(value: number) {
    onMaterialChange({ ...material, bezelWidth: value })
  }

  function setCornerRadius(value: number) {
    onMaterialChange({ ...material, cornerRadius: value })
  }

  function setDispersion(value: number) {
    onMaterialChange({ ...material, dispersion: value })
  }

  function setDisplacement(value: number) {
    onMaterialChange({ ...material, displacementFactor: value })
  }

  function setRefraction(value: number) {
    onMaterialChange({ ...material, contentIor: value, ior: value })
  }

  function setSpecular(value: number) {
    onMaterialChange({ ...material, specularOpacity: value })
  }

  function setThickness(value: number) {
    onMaterialChange({ ...material, contentDepth: value, thickness: value })
  }

  function setTintColor(value: string) {
    onMaterialChange({ ...material, tint: { ...fromHexColor(value), a: material.tint.a } })
  }

  function setTint(value: number) {
    onMaterialChange({ ...material, tint: { ...material.tint, a: value / 100 } })
  }

  async function copyMaterial() {
    try {
      await navigator.clipboard.writeText(materialJson)
      setExportStatus('JSON copied')
    } catch {
      setExportStatus('Clipboard unavailable — download instead')
    }
  }

  function downloadMaterial() {
    const file = new Blob([materialJson], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.download = `${toFileName(material.name)}.json`
    anchor.href = url
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setExportStatus('JSON exported')
  }

  return (
    <article
      {...stylexProps(styles.stage, styles.formStage, materialStyle)}
      data-material-enabled={materialEnabled}
      data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
      data-surface-profile={material.surfaceProfile}
    >
      <LiquidBackdrop tint={material.tint} />
      <StageHeader canRender={canRender} eyebrow="Live material" title="Tune this glass." />

      <div {...stylexProps(styles.formRenderLayer)}>
        <section
          aria-label="Optical instrument planes"
          className={className(styles.materialPlayground)}
        >
          <section {...stylexProps(styles.specimen)}>
            <header {...stylexProps(styles.specimenHeader)}>
              <span className={className(styles.specimenMeta, styles.specimenMetaStrong)}>
                01 / Refracted result
              </span>
              <small className={className(styles.specimenMeta, styles.specimenMuted)}>
                {material.blur.toFixed(0)}px blur · {material.thickness.toFixed(0)}px depth
              </small>
            </header>
            <div {...stylexProps(styles.specimenSource)} aria-hidden="true">
              <span {...stylexProps(styles.sourceMeta)}>Optical field 024</span>
              <strong {...stylexProps(styles.sourceTitle)}>
                LIGHT
                <br />
                BENDS
                <br />
                HERE
              </strong>
              <i {...stylexProps(styles.sourceCircle)} />
              <i {...stylexProps(styles.sourceCircle, styles.sourceCircleSmall)} />
            </div>
            <MaterialSpecimenCanvas
              canRender={canRender}
              enabled={materialEnabled}
              material={material}
              onError={() => setRendererFailed(true)}
            />
            <footer {...stylexProps(styles.specimenFooter)}>
              <span className={className(styles.specimenMeta, styles.specimenMuted)}>
                IOR {material.ior.toFixed(2)}
              </span>
              <span className={className(styles.specimenMeta, styles.specimenMuted)}>
                {material.surfaceProfile}
              </span>
            </footer>
          </section>

          <section {...stylexProps(styles.specimen)}>
            <header {...stylexProps(styles.specimenHeader)}>
              <span className={className(styles.specimenMeta, styles.specimenMetaStrong)}>
                02 / Displacement map
              </span>
              <small className={className(styles.specimenMeta, styles.specimenMuted)}>
                D {material.displacementFactor.toFixed(2)} · B {material.bezelWidth.toFixed(0)}
              </small>
            </header>
            <div {...stylexProps(styles.mapSource)} aria-hidden="true" />
            <MaterialSpecimenCanvas
              canRender={canRender}
              debug
              enabled={materialEnabled}
              material={material}
              onError={() => setRendererFailed(true)}
            />
            <footer {...stylexProps(styles.specimenFooter)}>
              <span className={className(styles.specimenMeta, styles.specimenMuted)}>
                R / horizontal
              </span>
              <span className={className(styles.specimenMeta, styles.specimenMuted)}>
                G / vertical
              </span>
            </footer>
          </section>
        </section>

        <form
          className={className(styles.opticsForm, !materialEnabled && styles.opticsDisabled)}
          onSubmit={(event) => {
            event.preventDefault()
            downloadMaterial()
          }}
        >
          <MaterialControlCanvas
            canRender={canRender}
            enabled={materialEnabled}
            material={material}
            onError={() => setRendererFailed(true)}
          />
          <header {...stylexProps(styles.opticsHeader)}>
            <div>
              <span {...stylexProps(styles.opticsEyebrow)}>Theme profile</span>
              <strong {...stylexProps(styles.opticsTitle)}>{theme} glass</strong>
            </div>
            <button
              aria-checked={materialEnabled}
              aria-label="Enable live liquid material"
              className={className(
                styles.materialSwitch,
                materialEnabled && styles.materialSwitchOn,
              )}
              onClick={() => setMaterialEnabled((current) => !current)}
              role="switch"
              type="button"
            >
              <span
                className={className(
                  styles.materialSwitchThumb,
                  materialEnabled && styles.materialSwitchThumbOn,
                )}
              />
            </button>
          </header>

          <div {...stylexProps(styles.formFields)}>
            <label {...stylexProps(styles.formField)}>
              <span {...stylexProps(styles.fieldLabel)}>Study name</span>
              <input
                {...stylexProps(styles.fieldControl)}
                onChange={(event) => setStudyName(event.currentTarget.value)}
                type="text"
                value={studyName}
              />
            </label>
            <label {...stylexProps(styles.formField)}>
              <span {...stylexProps(styles.fieldLabel)}>Profile</span>
              <select
                {...stylexProps(styles.fieldControl, styles.selectControl)}
                onChange={(event) =>
                  setSurfaceProfile(event.currentTarget.value as LiquidSurfaceProfile)
                }
                value={surfaceProfile}
              >
                <option value="convex">Convex lens</option>
                <option value="concave">Concave lens</option>
                <option value="lip">Rimmed lip</option>
              </select>
            </label>
            <label {...stylexProps(styles.formField)}>
              <span {...stylexProps(styles.fieldLabel)}>Glass tint</span>
              <input
                {...stylexProps(styles.fieldControl, styles.colorControl)}
                onChange={(event) => setTintColor(event.currentTarget.value)}
                type="color"
                value={tintColor}
              />
            </label>
          </div>

          <div {...stylexProps(styles.rangeStack)}>
            <RangeControl
              label="Refraction"
              max={2.1}
              min={1.01}
              onChange={setRefraction}
              step={0.01}
              value={refraction}
            />
            <RangeControl
              label="Depth"
              max={120}
              min={5}
              onChange={setThickness}
              suffix="px"
              value={thickness}
            />
            <RangeControl
              label="Bezel"
              max={64}
              min={2}
              onChange={setBezelWidth}
              suffix="px"
              value={bezelWidth}
            />
            <RangeControl
              label="Displacement"
              max={2}
              min={0}
              onChange={setDisplacement}
              step={0.01}
              value={displacement}
            />
            <RangeControl
              label="Chroma"
              max={0.08}
              min={0}
              onChange={setDispersion}
              step={0.001}
              value={dispersion}
            />
            <RangeControl
              label="Blur"
              max={32}
              min={0}
              onChange={setBlur}
              suffix="px"
              value={blur}
            />
            <RangeControl
              label="Radius"
              max={80}
              min={0}
              onChange={setCornerRadius}
              suffix="px"
              value={cornerRadius}
            />
            <RangeControl
              label="Edge highlight"
              max={1}
              min={0}
              onChange={setSpecular}
              step={0.01}
              value={specular}
            />
            <RangeControl
              label="Tint"
              max={40}
              min={0}
              onChange={setTint}
              suffix="%"
              value={tint}
            />
          </div>

          <section {...stylexProps(styles.materialExport)} aria-label="Exported theme JSON">
            <header {...stylexProps(styles.exportHeader)}>
              <span {...stylexProps(styles.exportMeta)}>liquid-theme.json</span>
              <small className={className(styles.exportMeta, styles.exportMuted)}>
                application/json · live
              </small>
            </header>
            <pre {...stylexProps(styles.exportPre)}>{materialJson}</pre>
          </section>

          <footer {...stylexProps(styles.opticsFooter)}>
            <span {...stylexProps(styles.exportStatus)}>
              <i
                className={className(styles.statusLight, !canRender && styles.statusFallback)}
                aria-hidden="true"
              />
              {exportStatus}
            </span>
            <div {...stylexProps(styles.exportActions)}>
              <button
                className={className(styles.formButton)}
                onClick={resetToPreset}
                type="button"
              >
                Reset
              </button>
              <button
                className={className(styles.formButton)}
                onClick={() => void copyMaterial()}
                type="button"
              >
                Copy JSON
              </button>
              <button
                className={className(styles.formButton, styles.formButtonPrimary)}
                type="submit"
              >
                Download
              </button>
            </div>
          </footer>
        </form>
      </div>

      <StageFooter
        detail="01 refract · 02 vector · 03 material"
        renderer={canRender ? 'Parameters render live' : 'Dynamic CSS approximation'}
      />
    </article>
  )
}

function MaterialSpecimenCanvas({
  canRender,
  debug = false,
  enabled,
  material,
  onError,
}: {
  readonly canRender: boolean
  readonly debug?: boolean
  readonly enabled: boolean
  readonly material: LiquidMaterial
  readonly onError: () => void
}) {
  if (!canRender) {
    const concave = material.surfaceProfile === 'concave'
    const lip = material.surfaceProfile === 'lip'

    return (
      <div
        aria-hidden="true"
        className={className(
          styles.fallbackSpecimen,
          !enabled && styles.materialDisabled,
          concave && styles.fallbackConcave,
          debug && styles.fallbackMap,
          debug && concave && styles.fallbackMapConcave,
          debug && lip && styles.fallbackMapLip,
        )}
        data-surface-profile={material.surfaceProfile}
      >
        {debug ? null : (
          <>
            <span {...stylexProps(styles.fallbackCopy)}>
              LIGHT
              <br />
              BENDS
              <br />
              HERE
            </span>
            <span
              className={className(
                styles.fallbackInset,
                styles.fallbackCaustic,
                concave && styles.fallbackCausticConcave,
              )}
            />
            <span
              className={className(
                styles.fallbackInset,
                styles.fallbackBezel,
                lip && styles.fallbackBezelLip,
              )}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <LiquidCanvas
      className={className(styles.specimenCanvas, !enabled && styles.materialDisabled)}
      canvasClassName={className(styles.canvas)}
      maxDpr={1.5}
      onError={onError}
    >
      <Frame maxHeight={Infinity} maxWidth={Infinity}>
        <GlassContainer
          bezelWidth={material.bezelWidth}
          blur={material.blur}
          contentDepth={material.contentDepth}
          contentIor={material.contentIor}
          debugDisplacement={debug}
          dispersion={material.dispersion}
          displacementBlur={material.displacementBlur}
          displacementFactor={material.displacementFactor}
          ior={material.ior}
          opacity={enabled ? material.opacity : 0.08}
          shadowBlur={debug ? 0 : 34}
          shadowColor={{ r: 0.01, g: 0.02, b: 0.1, a: 0.34 }}
          shadowOffsetY={debug ? 0 : 13}
          specularOpacity={material.specularOpacity}
          specularSharpness={material.specularSharpness}
          specularStrength={material.specularStrength}
          surfaceProfile={material.surfaceProfile}
          thickness={material.thickness}
          tint={material.tint}
          transition={{
            bezelWidth: MORPH_SPRING,
            blur: MORPH_SPRING,
            dispersion: MORPH_SPRING,
            displacementFactor: MORPH_SPRING,
            ior: MORPH_SPRING,
            opacity: MORPH_SPRING,
            specularOpacity: MORPH_SPRING,
            thickness: MORPH_SPRING,
            tint: MORPH_SPRING,
          }}
        >
          <Frame height={debug ? 116 : 210} width={debug ? 270 : 310}>
            <Glass
              cornerRadius={material.cornerRadius}
              cornerSmoothing={material.cornerSmoothing}
              transition={{ cornerRadius: MORPH_SPRING }}
            />
          </Frame>
        </GlassContainer>
      </Frame>
    </LiquidCanvas>
  )
}

function MaterialControlCanvas({
  canRender,
  enabled,
  material,
  onError,
}: {
  readonly canRender: boolean
  readonly enabled: boolean
  readonly material: LiquidMaterial
  readonly onError: () => void
}) {
  if (!canRender) {
    return null
  }

  return (
    <LiquidCanvas
      aria-hidden="true"
      className={className(styles.controlCanvas, !enabled && styles.materialDisabled)}
      canvasClassName={className(styles.canvas)}
      maxDpr={1.5}
      onError={onError}
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
          opacity={enabled ? Math.min(material.opacity, 0.82) : 0.06}
          shadowBlur={28 + material.thickness * 0.35}
          shadowColor={{ r: 0.01, g: 0.02, b: 0.1, a: 0.32 }}
          shadowOffsetY={material.thickness * 0.24}
          specularOpacity={material.specularOpacity}
          specularSharpness={material.specularSharpness}
          specularStrength={material.specularStrength}
          surfaceProfile={material.surfaceProfile}
          thickness={material.thickness}
          tint={material.tint}
          transition={{
            bezelWidth: MORPH_SPRING,
            blur: MORPH_SPRING,
            dispersion: MORPH_SPRING,
            displacementFactor: MORPH_SPRING,
            ior: MORPH_SPRING,
            opacity: MORPH_SPRING,
            specularOpacity: MORPH_SPRING,
            thickness: MORPH_SPRING,
            tint: MORPH_SPRING,
          }}
        >
          <Frame height={720} width={470}>
            <Glass
              cornerRadius={Math.min(34, Math.max(14, material.cornerRadius * 0.72))}
              cornerSmoothing={material.cornerSmoothing}
              transition={{ cornerRadius: MORPH_SPRING }}
            />
          </Frame>
        </GlassContainer>
      </Frame>
    </LiquidCanvas>
  )
}
