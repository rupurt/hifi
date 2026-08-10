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
import { useEffect, useMemo, useRef, useState } from 'react'
import { StyleguideSection } from './StyleguideSection'
import { liquidInteractionStyles as styles } from './stylex/liquid-interactions.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

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
  const profileDirection = material.surfaceProfile === 'concave' ? -1 : 1
  const profileScale = material.surfaceProfile === 'concave' ? 0.94 : 1.04
  const materialStyle = styles.materialVariables({
    bezel: `${material.bezelWidth}px`,
    bezelInset: `${Math.max(5, material.bezelWidth * 0.42)}px`,
    bezelStroke: `${Math.max(1, Math.min(3.5, material.bezelWidth * 0.075))}px`,
    blur: `${material.blur}px`,
    blurFeedback: `${material.blur * 0.32}px`,
    causticAlpha: 0.1 + material.specularOpacity * 0.62,
    chroma: `${material.dispersion * 360}px`,
    chromaNegative: `${material.dispersion * -360}px`,
    controlBlur: `${Math.max(2, material.blur * 0.72)}px`,
    controlFill: 0.035 + material.opacity * 0.07 + material.tint.a * 0.24,
    controlRadius: `${Math.min(18, Math.max(5, material.cornerRadius * 0.32))}px`,
    copySkew: `${(material.ior - 1) * -9}deg`,
    copyX: `${
      ((material.ior - 1) * 46 + (material.displacementFactor - 1) * 28) * profileDirection
    }px`,
    copyY: `${(material.ior - 1) * -20 * profileDirection}px`,
    depth: `${material.thickness}px`,
    edgeAlpha: 0.12 + material.specularOpacity * 0.38,
    highlightAlpha: 0.08 + material.specularOpacity * 0.28,
    iorShift: `${(material.ior - 1) * 16}px`,
    iorShiftDiagonal: `${(material.ior - 1) * 12}px`,
    lensScale: 0.88 + material.displacementFactor * 0.14,
    mapBlur: `${material.displacementBlur * 0.12}px`,
    opacity: materialEnabled ? material.opacity : 0.08,
    panelRadius: `${Math.min(34, Math.max(14, material.cornerRadius * 0.72))}px`,
    profileScale: material.surfaceProfile === 'lip' ? 1.02 : profileScale,
    railHeight: `${Math.min(8, Math.max(4, material.bezelWidth * 0.16))}px`,
    shadowBlur: `${28 + material.thickness * 0.7}px`,
    shadowY: `${material.thickness * 0.38}px`,
    shapeRadius: `${material.cornerRadius}px`,
    specular: material.specularOpacity,
    specularAlpha: 0.18 + material.specularOpacity * 0.4,
    thumbHeight: `${Math.min(22, Math.max(14, 11 + material.thickness * 0.2))}px`,
    thumbWidth: `${Math.min(17, Math.max(9, 7 + material.bezelWidth * 0.2))}px`,
    tint: toCssTint(material.tint),
    tintB: Math.round(material.tint.b * 255),
    tintG: Math.round(material.tint.g * 255),
    tintR: Math.round(material.tint.r * 255),
  })

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
    <div {...stylexProps(styles.root)}>
      <StyleguideSection
        description="A family of refractive controls shares one optical field. Hover, press, and open states drive liquid-dom transforms while native buttons preserve keyboard and assistive-technology behavior."
        id="buttons-heading"
        index="07"
        title="Buttons in a light field"
      >
        <article
          className={className(styles.stage)}
          data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
        >
          <LiquidBackdrop label="Interactive control field" />
          <StageHeader
            canRender={canRender}
            eyebrow="Control study / 07"
            title="One field. Many intentions."
          />

          <div {...stylexProps(styles.buttonRenderLayer)}>
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

            <div {...stylexProps(styles.buttonOverlay)}>
              <div {...stylexProps(styles.buttonRow)}>
                <button
                  className={className(
                    styles.command,
                    !canRender && styles.fallbackGlass,
                    styles.commandPrimary,
                  )}
                  type="button"
                  {...interactionProps('launch')}
                >
                  <span {...stylexProps(styles.commandLight)} aria-hidden="true" />
                  <span {...stylexProps(styles.commandCopy)}>
                    <small {...stylexProps(styles.commandMeta)}>Primary command</small>
                    Launch field
                  </span>
                  <ArrowIcon />
                </button>
                <button
                  aria-label="Tune material"
                  className={className(
                    styles.command,
                    !canRender && styles.fallbackGlass,
                    styles.commandCompact,
                  )}
                  type="button"
                  {...interactionProps('tune')}
                >
                  <TuneIcon />
                  <span>Tune</span>
                </button>
                <button
                  aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={favorite}
                  className={className(
                    styles.command,
                    !canRender && styles.fallbackGlass,
                    styles.commandIcon,
                    favorite && styles.commandFavorite,
                  )}
                  onClick={() => setFavorite((current) => !current)}
                  type="button"
                  {...interactionProps('favorite')}
                >
                  <HeartIcon filled={favorite} />
                </button>
                <button
                  aria-expanded={addExpanded}
                  className={className(
                    styles.command,
                    !canRender && styles.fallbackGlass,
                    styles.commandAdd,
                    addExpanded && styles.commandAddOpen,
                  )}
                  onClick={() => setAddExpanded((current) => !current)}
                  type="button"
                  {...interactionProps('add')}
                >
                  <PlusIcon />
                  <span
                    className={className(
                      styles.commandAddLabel,
                      addExpanded && styles.commandAddLabelOpen,
                    )}
                  >
                    New layer
                  </span>
                </button>
              </div>

              <fieldset
                className={className(styles.layerControl, !canRender && styles.fallbackGlass)}
                data-layer={layer.toLowerCase()}
              >
                <legend className={className(sharedStyles.visuallyHidden)}>
                  Composition layer
                </legend>
                {(['Surface', 'Content', 'Signal'] as const).map((candidate) => {
                  const buttonKey = candidate.toLowerCase() as ButtonKey

                  return (
                    <button
                      aria-pressed={layer === candidate}
                      className={className(styles.layerButton)}
                      key={candidate}
                      onClick={() => setLayer(candidate)}
                      type="button"
                      {...interactionProps(buttonKey)}
                    >
                      <span {...stylexProps(styles.layerLabel)}>{candidate}</span>
                      <small {...stylexProps(styles.layerMeta)}>
                        {candidate === layer ? 'Lens active' : layerDescriptions[candidate]}
                      </small>
                      {candidate === layer ? (
                        <i {...stylexProps(styles.activeDot)} aria-hidden="true" />
                      ) : null}
                    </button>
                  )
                })}
              </fieldset>

              <div {...stylexProps(styles.specialRow)}>
                <button
                  aria-label={confirmed ? 'Deletion confirmed' : 'Hold to confirm deletion'}
                  className={className(
                    styles.specialControl,
                    styles.holdButton,
                    !canRender && styles.fallbackGlass,
                  )}
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
                  <span
                    className={className(
                      styles.holdProgress,
                      holding && styles.holdProgressActive,
                      confirmed && styles.holdProgressConfirmed,
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={className(styles.holdForeground, styles.holdIcon)}
                    aria-hidden="true"
                  >
                    {confirmed ? '✓' : '×'}
                  </span>
                  <span {...stylexProps(styles.holdForeground)}>
                    <strong {...stylexProps(styles.holdTitle)}>
                      {confirmed ? 'Confirmed' : 'Hold to dissolve'}
                    </strong>
                    <small {...stylexProps(styles.holdMeta)}>
                      {confirmed ? 'Action ready' : 'Intentional action'}
                    </small>
                  </span>
                </button>

                <button
                  aria-label={recording ? 'Stop recording' : 'Start recording'}
                  aria-pressed={recording}
                  className={className(
                    styles.specialControl,
                    styles.recordButton,
                    !canRender && styles.fallbackGlass,
                  )}
                  onClick={() => setRecording((current) => !current)}
                  type="button"
                  {...interactionProps('record')}
                >
                  <span
                    className={className(styles.recordIndicator, recording && styles.recordActive)}
                    aria-hidden="true"
                  />
                </button>

                <fieldset
                  className={className(
                    styles.specialControl,
                    styles.stepper,
                    !canRender && styles.fallbackGlass,
                  )}
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
                  <legend className={className(sharedStyles.visuallyHidden)}>Layer density</legend>
                  <button
                    aria-label="Decrease layer density"
                    className={className(styles.stepperButton, styles.stepperLeft)}
                    disabled={density === 1}
                    onClick={() => setDensity((current) => Math.max(1, current - 1))}
                    type="button"
                  >
                    −
                  </button>
                  <span {...stylexProps(styles.stepperValue)}>
                    <small {...stylexProps(styles.stepperMeta)}>Density</small>
                    <output {...stylexProps(styles.stepperOutput)}>
                      {density.toString().padStart(2, '0')}
                    </output>
                  </span>
                  <button
                    aria-label="Increase layer density"
                    className={className(styles.stepperButton, styles.stepperRight)}
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
          {...stylexProps(styles.stage, styles.formStage, materialStyle)}
          data-material-enabled={materialEnabled}
          data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
          data-surface-profile={material.surfaceProfile}
        >
          <LiquidBackdrop label="Optical calibration field" />
          <StageHeader
            canRender={canRender}
            eyebrow="Theme generator / live system"
            title="Tune the grammar."
          />

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
      {...stylexProps(
        styles.rangeControl,
        styles.rangePosition(`${((value - min) / (max - min)) * 100}%`),
      )}
    >
      <span {...stylexProps(styles.rangeHeader)}>
        {label}
        <output {...stylexProps(styles.rangeOutput)}>
          {value.toFixed(precision ?? (step < 0.01 ? 3 : step < 1 ? 2 : 0))}
          {suffix}
        </output>
      </span>
      <input
        {...stylexProps(styles.rangeInput)}
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
  const form = label === 'Optical calibration field'

  return (
    <div
      className={className(styles.backdrop, form && styles.formBackdrop)}
      aria-label={label}
      role="img"
    >
      <span className={className(styles.ribbon, styles.ribbonA, form && styles.formRibbonA)} />
      <span className={className(styles.ribbon, styles.ribbonB, form && styles.hidden)} />
      <span className={className(styles.hidden)} />
      <span className={className(styles.orb, styles.orbA, form && styles.formOrb)} />
      <span className={className(styles.orb, styles.orbB, form && styles.formOrb)} />
      <span {...stylexProps(styles.backdropGrid)} />
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
    <header {...stylexProps(styles.stageHeader)}>
      <div>
        <span {...stylexProps(styles.stageEyebrow)}>{eyebrow}</span>
        <strong {...stylexProps(styles.stageTitle)}>{title}</strong>
      </div>
      <span {...stylexProps(styles.rendererChip)}>
        <i
          className={className(styles.statusLight, !canRender && styles.statusFallback)}
          aria-hidden="true"
        />
        {canRender ? 'WebGPU live' : 'CSS fallback'}
      </span>
    </header>
  )
}

function StageFooter({ detail, renderer }: { readonly detail: string; readonly renderer: string }) {
  return (
    <footer {...stylexProps(styles.stageFooter)}>
      <span>{detail}</span>
      <span {...stylexProps(styles.footerSecondary)}>{renderer}</span>
      <a
        {...stylexProps(styles.footerLink)}
        href="https://liquid-dom-showcase.vercel.app/"
        rel="noreferrer"
        target="_blank"
      >
        Upstream showcase <span aria-hidden="true">↗</span>
      </a>
    </footer>
  )
}

function ArrowIcon() {
  return (
    <svg
      {...stylexProps(styles.commandIconSvg, styles.commandArrow)}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function TuneIcon() {
  return (
    <svg {...stylexProps(styles.commandIconSvg)} aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  )
}

function HeartIcon({ filled }: { readonly filled: boolean }) {
  return (
    <svg
      {...stylexProps(styles.commandIconSvg)}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
    >
      <path d="m12 20-1.3-1.18C6.1 14.65 3 11.82 3 8.35 3 5.52 5.24 3.3 8.08 3.3c1.6 0 3.14.74 3.92 1.9.78-1.16 2.32-1.9 3.92-1.9C18.76 3.3 21 5.52 21 8.35c0 3.47-3.1 6.3-7.7 10.48Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg {...stylexProps(styles.commandIconSvg)} aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
