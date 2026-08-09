import {
  type LiquidMaterial,
  type LiquidSurfaceProfile,
  type LiquidThemeName,
  liquidThemeMaterials,
  serializeLiquidMaterial,
  supportsLiquidDomRendering,
} from '@hifi/liquid'
import {
  Frame,
  Glass,
  GlassContainer,
  HStack,
  LiquidCanvas,
  spring,
  Transform,
  VStack,
  ZStack,
} from '@liquid-dom/react'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { StyleguideSection } from './StyleguideSection'
import './styles/liquid-interactions.css'

const CONTROL_SPRING = spring({ stiffness: 620, damping: 36 })
const MORPH_SPRING = spring({ stiffness: 360, damping: 31 })

type ButtonKey =
  | 'launch'
  | 'tune'
  | 'favorite'
  | 'add'
  | 'surface'
  | 'content'
  | 'signal'
  | 'hold'
  | 'record'
  | 'stepper'
type Layer = 'Surface' | 'Content' | 'Signal'

const layerDescriptions: Record<Layer, string> = {
  Surface: 'Material',
  Content: 'Reading',
  Signal: 'Urgency',
}

interface GlassShapeProps {
  readonly active?: boolean
  readonly buttonKey: ButtonKey
  readonly height: number
  readonly hovered: ButtonKey | null
  readonly pressed: ButtonKey | null
  readonly radius: number
  readonly smoothing?: number
  readonly width: number
  readonly widthTransition?: boolean
}

export function LiquidInteractionCatalog({
  onMaterialChange,
  theme,
}: {
  readonly onMaterialChange: (material: LiquidMaterial) => void
  readonly theme: LiquidThemeName
}) {
  const themeMaterial = liquidThemeMaterials[theme]
  const [rendererFailed, setRendererFailed] = useState(false)
  const [hovered, setHovered] = useState<ButtonKey | null>(null)
  const [pressed, setPressed] = useState<ButtonKey | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [addExpanded, setAddExpanded] = useState(false)
  const [layer, setLayer] = useState<Layer>('Content')
  const [holding, setHolding] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [recording, setRecording] = useState(false)
  const [density, setDensity] = useState(3)
  const [studyName, setStudyName] = useState(themeMaterial.name)
  const [surfaceProfile, setSurfaceProfile] = useState<LiquidSurfaceProfile>(
    themeMaterial.surfaceProfile,
  )
  const [blur, setBlur] = useState<number>(themeMaterial.blur)
  const [bezelWidth, setBezelWidth] = useState(themeMaterial.bezelWidth)
  const [cornerRadius, setCornerRadius] = useState(themeMaterial.cornerRadius)
  const [dispersion, setDispersion] = useState(themeMaterial.dispersion)
  const [displacement, setDisplacement] = useState(themeMaterial.displacementFactor)
  const [refraction, setRefraction] = useState(themeMaterial.ior)
  const [specular, setSpecular] = useState(themeMaterial.specularOpacity)
  const [thickness, setThickness] = useState(themeMaterial.thickness)
  const [tintColor, setTintColor] = useState(toHexColor(themeMaterial.tint))
  const [tint, setTint] = useState(Math.round(themeMaterial.tint.a * 100))
  const [materialEnabled, setMaterialEnabled] = useState(true)
  const [exportStatus, setExportStatus] = useState('Applied to grammar')
  const holdTimerRef = useRef<number | null>(null)
  const canRender = supportsLiquidDomRendering() && !rendererFailed

  const material = useMemo<LiquidMaterial>(
    () => ({
      ...themeMaterial,
      bezelWidth,
      blur,
      cornerRadius,
      contentDepth: thickness,
      contentIor: refraction,
      dispersion,
      displacementFactor: displacement,
      ior: refraction,
      name: studyName.trim() || 'Untitled liquid material',
      specularOpacity: specular,
      surfaceProfile,
      thickness,
      tint: { ...fromHexColor(tintColor), a: tint / 100 },
    }),
    [
      bezelWidth,
      blur,
      cornerRadius,
      dispersion,
      displacement,
      refraction,
      specular,
      studyName,
      surfaceProfile,
      themeMaterial,
      thickness,
      tint,
      tintColor,
    ],
  )
  const materialJson = useMemo(() => serializeLiquidMaterial(material), [material])
  const materialStyle = {
    '--lab-bezel': `${material.bezelWidth}px`,
    '--lab-blur': `${material.blur}px`,
    '--lab-chroma': `${material.dispersion * 360}px`,
    '--lab-chroma-negative': `${material.dispersion * -360}px`,
    '--lab-control-blur': `${Math.max(2, material.blur * 0.72)}px`,
    '--lab-control-fill': 0.035 + material.opacity * 0.07 + material.tint.a * 0.24,
    '--lab-control-radius': `${Math.min(18, Math.max(5, material.cornerRadius * 0.32))}px`,
    '--lab-depth': `${material.thickness}px`,
    '--lab-displacement': material.displacementFactor,
    '--lab-edge-alpha': 0.12 + material.specularOpacity * 0.38,
    '--lab-highlight-alpha': 0.08 + material.specularOpacity * 0.28,
    '--lab-ior': material.ior,
    '--lab-ior-shift': `${(material.ior - 1) * 16}px`,
    '--lab-ior-shift-diagonal': `${(material.ior - 1) * 12}px`,
    '--lab-ior-scale': 0.88 + material.ior * 0.08,
    '--lab-lens-scale': 0.92 + material.displacementFactor * 0.08,
    '--lab-map-blur': `${material.displacementBlur * 0.12}px`,
    '--lab-opacity': materialEnabled ? material.opacity : 0.08,
    '--lab-panel-radius': `${Math.min(34, Math.max(14, material.cornerRadius * 0.72))}px`,
    '--lab-probe-size': `${30 + material.thickness * 0.75}px`,
    '--lab-rail-height': `${Math.min(8, Math.max(4, material.bezelWidth * 0.16))}px`,
    '--lab-shadow-blur': `${28 + material.thickness * 0.7}px`,
    '--lab-shadow-y': `${material.thickness * 0.38}px`,
    '--lab-shape-radius': `${material.cornerRadius}px`,
    '--lab-specular': material.specularOpacity,
    '--lab-specular-alpha': 0.18 + material.specularOpacity * 0.4,
    '--lab-thumb-height': `${Math.min(22, Math.max(14, 11 + material.thickness * 0.2))}px`,
    '--lab-thumb-width': `${Math.min(17, Math.max(9, 7 + material.bezelWidth * 0.2))}px`,
    '--lab-tint': toCssTint(material.tint),
    '--lab-tint-b': Math.round(material.tint.b * 255),
    '--lab-tint-g': Math.round(material.tint.g * 255),
    '--lab-tint-r': Math.round(material.tint.r * 255),
  } as CSSProperties

  useEffect(() => {
    setBezelWidth(themeMaterial.bezelWidth)
    setBlur(themeMaterial.blur)
    setCornerRadius(themeMaterial.cornerRadius)
    setDispersion(themeMaterial.dispersion)
    setDisplacement(themeMaterial.displacementFactor)
    setRefraction(themeMaterial.ior)
    setSurfaceProfile(themeMaterial.surfaceProfile)
    setSpecular(themeMaterial.specularOpacity)
    setStudyName(themeMaterial.name)
    setThickness(themeMaterial.thickness)
    setTint(Math.round(themeMaterial.tint.a * 100))
    setTintColor(toHexColor(themeMaterial.tint))
  }, [themeMaterial])

  useEffect(() => onMaterialChange(material), [material, onMaterialChange])

  useEffect(
    () => () => {
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current)
      }
    },
    [],
  )

  function startHold() {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current)
    }

    setConfirmed(false)
    setHolding(true)
    setPressed('hold')
    holdTimerRef.current = window.setTimeout(() => {
      setConfirmed(true)
      setHolding(false)
      setPressed(null)
      holdTimerRef.current = null
    }, 900)
  }

  function stopHold() {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }

    setHolding(false)
    setPressed((current) => (current === 'hold' ? null : current))
  }

  function interactionProps(buttonKey: ButtonKey) {
    return {
      onPointerDown: () => setPressed(buttonKey),
      onPointerEnter: () => setHovered(buttonKey),
      onPointerLeave: () => {
        setHovered((current) => (current === buttonKey ? null : current))
        setPressed((current) => (current === buttonKey ? null : current))
      },
      onPointerUp: () => setPressed((current) => (current === buttonKey ? null : current)),
    }
  }

  function resetToPreset() {
    setBezelWidth(themeMaterial.bezelWidth)
    setBlur(themeMaterial.blur)
    setCornerRadius(themeMaterial.cornerRadius)
    setDispersion(themeMaterial.dispersion)
    setDisplacement(themeMaterial.displacementFactor)
    setRefraction(themeMaterial.ior)
    setSurfaceProfile(themeMaterial.surfaceProfile)
    setSpecular(themeMaterial.specularOpacity)
    setStudyName(themeMaterial.name)
    setThickness(themeMaterial.thickness)
    setTint(Math.round(themeMaterial.tint.a * 100))
    setTintColor(toHexColor(themeMaterial.tint))
    setExportStatus('Preset restored')
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
    <div className="liquid-interaction-catalog">
      <StyleguideSection
        description="A family of refractive controls shares one optical field. Hover, press, and open states drive liquid-dom transforms while native buttons preserve keyboard and assistive-technology behavior."
        id="buttons-heading"
        index="07"
        title="Buttons in a light field"
      >
        <article
          className="liquid-demo-stage liquid-button-stage"
          data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
        >
          <LiquidBackdrop label="Interactive control field" />
          <StageHeader
            canRender={canRender}
            eyebrow="Control study / 07"
            title="One field. Many intentions."
          />

          <div className="liquid-button-render-layer">
            {canRender ? (
              <LiquidCanvas
                className="liquid-demo-canvas"
                canvasClassName="liquid-demo-canvas-element"
                maxDpr={1.5}
                onError={() => setRendererFailed(true)}
              >
                <Frame maxHeight={Infinity} maxWidth={Infinity}>
                  <GlassContainer
                    bezelWidth={material.bezelWidth}
                    blur={material.blur}
                    dispersion={material.dispersion}
                    displacementBlur={material.displacementBlur}
                    displacementFactor={material.displacementFactor}
                    ior={material.ior}
                    opacity={material.opacity}
                    shadowBlur={22}
                    shadowColor={{ r: 0.02, g: 0.03, b: 0.12, a: 0.32 }}
                    shadowOffsetY={9}
                    spacing={14}
                    specularOpacity={material.specularOpacity}
                    specularSharpness={material.specularSharpness}
                    specularStrength={material.specularStrength}
                    surfaceProfile={material.surfaceProfile}
                    thickness={material.thickness}
                    tint={material.tint}
                  >
                    <VStack spacing={14}>
                      <HStack spacing={14}>
                        <GlassShape
                          buttonKey="launch"
                          height={68}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 32)}
                          smoothing={material.cornerSmoothing}
                          width={244}
                        />
                        <GlassShape
                          buttonKey="tune"
                          height={68}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 32)}
                          smoothing={material.cornerSmoothing}
                          width={112}
                        />
                        <GlassShape
                          active={favorite}
                          buttonKey="favorite"
                          height={68}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 32)}
                          smoothing={material.cornerSmoothing}
                          width={76}
                        />
                        <GlassShape
                          active={addExpanded}
                          buttonKey="add"
                          height={68}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 32)}
                          smoothing={material.cornerSmoothing}
                          width={addExpanded ? 172 : 76}
                          widthTransition
                        />
                      </HStack>
                      <LiquidSelectorShape hovered={hovered} layer={layer} pressed={pressed} />
                      <HStack spacing={14}>
                        <GlassShape
                          active={confirmed}
                          buttonKey="hold"
                          height={58}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 26)}
                          smoothing={material.cornerSmoothing}
                          width={230}
                        />
                        <GlassShape
                          active={recording}
                          buttonKey="record"
                          height={58}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 26)}
                          smoothing={material.cornerSmoothing}
                          width={76}
                        />
                        <GlassShape
                          buttonKey="stepper"
                          height={58}
                          hovered={hovered}
                          pressed={pressed}
                          radius={Math.min(material.cornerRadius, 26)}
                          smoothing={material.cornerSmoothing}
                          width={250}
                        />
                      </HStack>
                    </VStack>
                  </GlassContainer>
                </Frame>
              </LiquidCanvas>
            ) : null}

            <div className="liquid-button-overlay">
              <div className="liquid-button-row">
                <button
                  className="liquid-command liquid-command-primary"
                  type="button"
                  {...interactionProps('launch')}
                >
                  <span className="liquid-command-light" aria-hidden="true" />
                  <span>
                    <small>Primary command</small>
                    Launch field
                  </span>
                  <ArrowIcon />
                </button>
                <button
                  aria-label="Tune material"
                  className="liquid-command liquid-command-compact"
                  type="button"
                  {...interactionProps('tune')}
                >
                  <TuneIcon />
                  <span>Tune</span>
                </button>
                <button
                  aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={favorite}
                  className="liquid-command liquid-command-icon"
                  onClick={() => setFavorite((current) => !current)}
                  type="button"
                  {...interactionProps('favorite')}
                >
                  <HeartIcon filled={favorite} />
                </button>
                <button
                  aria-expanded={addExpanded}
                  className="liquid-command liquid-command-add"
                  onClick={() => setAddExpanded((current) => !current)}
                  type="button"
                  {...interactionProps('add')}
                >
                  <PlusIcon />
                  <span>New layer</span>
                </button>
              </div>

              <fieldset className="liquid-layer-control" data-layer={layer.toLowerCase()}>
                <legend className="visually-hidden">Composition layer</legend>
                {(['Surface', 'Content', 'Signal'] as const).map((candidate) => {
                  const buttonKey = candidate.toLowerCase() as ButtonKey

                  return (
                    <button
                      aria-pressed={layer === candidate}
                      key={candidate}
                      onClick={() => setLayer(candidate)}
                      type="button"
                      {...interactionProps(buttonKey)}
                    >
                      <span>{candidate}</span>
                      <small>
                        {candidate === layer ? 'Lens active' : layerDescriptions[candidate]}
                      </small>
                    </button>
                  )
                })}
              </fieldset>

              <div className="liquid-special-button-row">
                <button
                  aria-label={confirmed ? 'Deletion confirmed' : 'Hold to confirm deletion'}
                  className="liquid-hold-button"
                  data-confirmed={confirmed}
                  data-holding={holding}
                  onClick={(event) => {
                    if (event.detail === 0) {
                      setConfirmed(true)
                    }
                  }}
                  onPointerDown={startHold}
                  onPointerCancel={stopHold}
                  onPointerEnter={() => setHovered('hold')}
                  onPointerLeave={() => {
                    setHovered((current) => (current === 'hold' ? null : current))
                    stopHold()
                  }}
                  onPointerUp={stopHold}
                  type="button"
                >
                  <span className="liquid-hold-progress" aria-hidden="true" />
                  <span className="liquid-hold-icon" aria-hidden="true">
                    {confirmed ? '✓' : '×'}
                  </span>
                  <span>
                    <strong>{confirmed ? 'Confirmed' : 'Hold to dissolve'}</strong>
                    <small>{confirmed ? 'Action ready' : 'Intentional action'}</small>
                  </span>
                </button>

                <button
                  aria-label={recording ? 'Stop recording' : 'Start recording'}
                  aria-pressed={recording}
                  className="liquid-record-button"
                  onClick={() => setRecording((current) => !current)}
                  type="button"
                  {...interactionProps('record')}
                >
                  <span aria-hidden="true" />
                </button>

                <fieldset
                  className="liquid-stepper"
                  onBlur={() => setHovered((current) => (current === 'stepper' ? null : current))}
                  onFocus={() => setHovered('stepper')}
                  onPointerEnter={() => setHovered('stepper')}
                  onPointerDown={() => setPressed('stepper')}
                  onPointerLeave={() => {
                    setHovered((current) => (current === 'stepper' ? null : current))
                    setPressed((current) => (current === 'stepper' ? null : current))
                  }}
                  onPointerUp={() =>
                    setPressed((current) => (current === 'stepper' ? null : current))
                  }
                >
                  <legend className="visually-hidden">Layer density</legend>
                  <button
                    aria-label="Decrease layer density"
                    disabled={density === 1}
                    onClick={() => setDensity((current) => Math.max(1, current - 1))}
                    type="button"
                  >
                    −
                  </button>
                  <span>
                    <small>Density</small>
                    <output>{density.toString().padStart(2, '0')}</output>
                  </span>
                  <button
                    aria-label="Increase layer density"
                    disabled={density === 9}
                    onClick={() => setDensity((current) => Math.min(9, current + 1))}
                    type="button"
                  >
                    +
                  </button>
                </fieldset>
              </div>
            </div>
          </div>

          <StageFooter
            detail="Morph · select · hold · record · step"
            renderer={canRender ? 'Live liquid-dom' : 'Accessible CSS fallback'}
          />
        </article>
      </StyleguideSection>

      <StyleguideSection
        description="A refracted result and its displacement map update from the same theme object. Every change is applied to the full Liquid grammar above and below this generator before that theme is exported."
        id="forms-heading"
        index="08"
        title="Generate a liquid theme"
      >
        <article
          className="liquid-demo-stage liquid-form-stage"
          data-material-enabled={materialEnabled}
          data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
          style={materialStyle}
        >
          <LiquidBackdrop label="Optical calibration field" />
          <StageHeader
            canRender={canRender}
            eyebrow="Theme generator / live system"
            title="Tune the grammar."
          />

          <div className="liquid-form-render-layer">
            <section aria-label="Optical instrument planes" className="liquid-material-playground">
              <section className="liquid-specimen liquid-result-specimen">
                <header>
                  <span>01 / Refracted result</span>
                  <small>{canRender ? 'Live pixels' : 'CSS approximation'}</small>
                </header>
                <div className="liquid-specimen-source" aria-hidden="true">
                  <span>Optical field 024</span>
                  <strong>
                    LIGHT
                    <br />
                    BENDS
                    <br />
                    HERE
                  </strong>
                  <i />
                  <i />
                </div>
                <MaterialSpecimenCanvas
                  canRender={canRender}
                  enabled={materialEnabled}
                  material={material}
                  onError={() => setRendererFailed(true)}
                />
                <footer>
                  <span>IOR {material.ior.toFixed(2)}</span>
                  <span>{material.surfaceProfile}</span>
                </footer>
              </section>

              <section className="liquid-specimen liquid-map-specimen">
                <header>
                  <span>02 / Displacement map</span>
                  <small>Renderer diagnostic</small>
                </header>
                <div className="liquid-map-source" aria-hidden="true" />
                <MaterialSpecimenCanvas
                  canRender={canRender}
                  debug
                  enabled={materialEnabled}
                  material={material}
                  onError={() => setRendererFailed(true)}
                />
                <footer>
                  <span>R / horizontal</span>
                  <span>G / vertical</span>
                </footer>
              </section>
            </section>

            <form
              className="liquid-optics-form"
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
              <header>
                <div>
                  <span>Theme profile</span>
                  <strong>{theme} glass</strong>
                </div>
                <button
                  aria-checked={materialEnabled}
                  aria-label="Enable live liquid material"
                  className="liquid-material-switch"
                  onClick={() => setMaterialEnabled((current) => !current)}
                  role="switch"
                  type="button"
                >
                  <span />
                </button>
              </header>

              <div className="liquid-form-fields">
                <label>
                  <span>Study name</span>
                  <input
                    onChange={(event) => setStudyName(event.currentTarget.value)}
                    type="text"
                    value={studyName}
                  />
                </label>
                <label>
                  <span>Profile</span>
                  <select
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
                <label className="liquid-form-color">
                  <span>Glass tint</span>
                  <input
                    onChange={(event) => setTintColor(event.currentTarget.value)}
                    type="color"
                    value={tintColor}
                  />
                </label>
              </div>

              <div className="liquid-range-stack">
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

              <section className="liquid-material-export" aria-label="Exported theme JSON">
                <header>
                  <span>liquid-theme.json</span>
                  <small>application/json · live</small>
                </header>
                <pre>{materialJson}</pre>
              </section>

              <footer>
                <span>
                  <i aria-hidden="true" />
                  {exportStatus}
                </span>
                <div>
                  <button onClick={resetToPreset} type="button">
                    Reset
                  </button>
                  <button onClick={() => void copyMaterial()} type="button">
                    Copy JSON
                  </button>
                  <button type="submit">Download</button>
                </div>
              </footer>
            </form>
          </div>

          <StageFooter
            detail="01 refract · 02 vector · 03 material"
            renderer={canRender ? 'Parameters render live' : 'Dynamic CSS approximation'}
          />
        </article>
      </StyleguideSection>
    </div>
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
    return (
      <div
        aria-hidden="true"
        className={`liquid-specimen-fallback${debug ? ' liquid-specimen-fallback-map' : ''}`}
      />
    )
  }

  return (
    <LiquidCanvas
      className="liquid-specimen-canvas"
      canvasClassName="liquid-demo-canvas-element"
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
      className="liquid-control-material-canvas"
      canvasClassName="liquid-demo-canvas-element"
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

function GlassShape({
  active = false,
  buttonKey,
  height,
  hovered,
  pressed,
  radius,
  smoothing = 0.38,
  width,
  widthTransition = false,
}: GlassShapeProps) {
  const scale = pressed === buttonKey ? 0.975 : hovered === buttonKey ? 1.015 : 1

  return (
    <Transform
      origin={{ x: 0.5, y: 0.5 }}
      scaleX={scale}
      scaleY={scale}
      transition={{ scaleX: CONTROL_SPRING, scaleY: CONTROL_SPRING }}
    >
      <Frame
        height={height}
        transition={widthTransition ? { width: MORPH_SPRING } : undefined}
        width={width}
      >
        <Glass cornerRadius={radius} cornerSmoothing={smoothing} zIndex={active ? 2 : 1} />
      </Frame>
    </Transform>
  )
}

function LiquidSelectorShape({
  hovered,
  layer,
  pressed,
}: {
  readonly hovered: ButtonKey | null
  readonly layer: Layer
  readonly pressed: ButtonKey | null
}) {
  const activeKey = layer.toLowerCase() as ButtonKey
  const position = layer === 'Surface' ? -216 : layer === 'Signal' ? 216 : 0
  const scale = pressed === activeKey ? 0.98 : hovered === activeKey ? 1.012 : 1

  return (
    <ZStack alignment="center">
      <Frame height={68} width={650}>
        <Glass cornerRadius={20} cornerSmoothing={0.42} />
      </Frame>
      <Transform
        origin={{ x: 0.5, y: 0.5 }}
        scaleX={scale}
        scaleY={scale}
        transition={{ scaleX: CONTROL_SPRING, scaleY: CONTROL_SPRING, x: MORPH_SPRING }}
        x={position}
      >
        <Frame height={56} width={206}>
          <Glass cornerRadius={14} cornerSmoothing={0.42} zIndex={3} />
        </Frame>
      </Transform>
    </ZStack>
  )
}

function RangeControl({
  label,
  max,
  min,
  onChange,
  precision,
  step = 1,
  suffix = '',
  value,
}: {
  readonly label: string
  readonly max: number
  readonly min: number
  readonly onChange: (value: number) => void
  readonly precision?: number
  readonly step?: number
  readonly suffix?: string
  readonly value: number
}) {
  return (
    <label
      className="liquid-range-control"
      style={
        {
          '--range-position': `${((value - min) / (max - min)) * 100}%`,
        } as CSSProperties
      }
    >
      <span>
        {label}
        <output>
          {value.toFixed(precision ?? (step < 0.01 ? 3 : step < 1 ? 2 : 0))}
          {suffix}
        </output>
      </span>
      <input
        aria-label={label}
        max={max}
        min={min}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        step={step}
        type="range"
        value={value}
      />
    </label>
  )
}

function toCssTint({ a, b, g, r }: LiquidMaterial['tint']) {
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${a})`
}

function toHexColor({ b, g, r }: LiquidMaterial['tint']) {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

function fromHexColor(value: string) {
  const channels = value.match(/[a-f\d]{2}/gi) ?? ['ff', 'ff', 'ff']

  return {
    b: Number.parseInt(channels[2] ?? 'ff', 16) / 255,
    g: Number.parseInt(channels[1] ?? 'ff', 16) / 255,
    r: Number.parseInt(channels[0] ?? 'ff', 16) / 255,
  }
}

function toFileName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'liquid-material'
  )
}

function LiquidBackdrop({ label }: { readonly label: string }) {
  return (
    <div aria-label={label} className="liquid-demo-backdrop" role="img">
      <span className="liquid-backdrop-ribbon liquid-backdrop-ribbon-a" />
      <span className="liquid-backdrop-ribbon liquid-backdrop-ribbon-b" />
      <span className="liquid-backdrop-ribbon liquid-backdrop-ribbon-c" />
      <span className="liquid-backdrop-orb liquid-backdrop-orb-a" />
      <span className="liquid-backdrop-orb liquid-backdrop-orb-b" />
      <span className="liquid-backdrop-grid" />
    </div>
  )
}

function StageHeader({
  canRender,
  eyebrow,
  title,
}: {
  readonly canRender: boolean
  readonly eyebrow: string
  readonly title: string
}) {
  return (
    <header className="liquid-stage-header">
      <div>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </div>
      <span className="liquid-renderer-chip">
        <i aria-hidden="true" />
        {canRender ? 'WebGPU live' : 'CSS fallback'}
      </span>
    </header>
  )
}

function StageFooter({ detail, renderer }: { readonly detail: string; readonly renderer: string }) {
  return (
    <footer className="liquid-stage-footer">
      <span>{detail}</span>
      <span>{renderer}</span>
      <a href="https://liquid-dom-showcase.vercel.app/" rel="noreferrer" target="_blank">
        Upstream showcase <span aria-hidden="true">↗</span>
      </a>
    </footer>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function TuneIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  )
}

function HeartIcon({ filled }: { readonly filled: boolean }) {
  return (
    <svg aria-hidden="true" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24">
      <path d="m12 20-1.3-1.18C6.1 14.65 3 11.82 3 8.35 3 5.52 5.24 3.3 8.08 3.3c1.6 0 3.14.74 3.92 1.9.78-1.16 2.32-1.9 3.92-1.9C18.76 3.3 21 5.52 21 8.35c0 3.47-3.1 6.3-7.7 10.48Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
