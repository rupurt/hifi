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
  LiquidCanvas,
  spring,
  Transform,
  ZStack,
} from '@liquid-dom/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { StyleguideSection } from './StyleguideSection'
import { liquidInteractionStyles as styles } from './stylex/liquid-interactions.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

const MORPH_SPRING = spring({ stiffness: 360, damping: 31 })
const FERROUS_SPRING = spring({ stiffness: 610, damping: 22 })

type ButtonKey = 'launch' | 'tune' | 'favorite' | 'add' | 'layers' | 'hold' | 'record' | 'stepper'
type Layer = 'Surface' | 'Content' | 'Signal'

interface FieldControl {
  readonly activeHeight: number
  readonly activeRadius: number
  readonly activeWidth: number
  readonly compactLabel: string
  readonly dockX: number
  readonly dockY: number
  readonly height: number
  readonly key: ButtonKey
  readonly label: string
  readonly radius: number
  readonly width: number
}

const FIELD_CONTROLS: readonly FieldControl[] = [
  {
    activeHeight: 68,
    activeRadius: 32,
    activeWidth: 244,
    compactLabel: 'Launch',
    dockX: -236,
    dockY: -36,
    height: 52,
    key: 'launch',
    label: 'Launch field',
    radius: 24,
    width: 128,
  },
  {
    activeHeight: 68,
    activeRadius: 32,
    activeWidth: 112,
    compactLabel: 'Tune',
    dockX: -112,
    dockY: -36,
    height: 48,
    key: 'tune',
    label: 'Tune material',
    radius: 22,
    width: 88,
  },
  {
    activeHeight: 68,
    activeRadius: 32,
    activeWidth: 76,
    compactLabel: 'Favorite',
    dockX: -43,
    dockY: -36,
    height: 50,
    key: 'favorite',
    label: 'Favorite',
    radius: 25,
    width: 50,
  },
  {
    activeHeight: 68,
    activeRadius: 32,
    activeWidth: 172,
    compactLabel: 'New',
    dockX: 10,
    dockY: -36,
    height: 54,
    key: 'add',
    label: 'New layer',
    radius: 27,
    width: 54,
  },
  {
    activeHeight: 64,
    activeRadius: 22,
    activeWidth: 366,
    compactLabel: 'Layers',
    dockX: -90,
    dockY: 34,
    height: 50,
    key: 'layers',
    label: 'Composition layer',
    radius: 18,
    width: 264,
  },
  {
    activeHeight: 58,
    activeRadius: 26,
    activeWidth: 230,
    compactLabel: 'Hold',
    dockX: 105,
    dockY: -36,
    height: 48,
    key: 'hold',
    label: 'Hold to dissolve',
    radius: 20,
    width: 118,
  },
  {
    activeHeight: 58,
    activeRadius: 26,
    activeWidth: 76,
    compactLabel: 'Record',
    dockX: 200,
    dockY: -36,
    height: 50,
    key: 'record',
    label: 'Record signal',
    radius: 25,
    width: 50,
  },
  {
    activeHeight: 58,
    activeRadius: 26,
    activeWidth: 250,
    compactLabel: 'Density',
    dockX: 130,
    dockY: 34,
    height: 48,
    key: 'stepper',
    label: 'Layer density',
    radius: 20,
    width: 122,
  },
]

const SCATTER_SLOTS = [
  { x: -285, y: -145 },
  { x: -90, y: -200 },
  { x: 135, y: -190 },
  { x: 285, y: -145 },
  { x: 312, y: 58 },
  { x: 205, y: 184 },
  { x: -205, y: 184 },
] as const

const GROUP_EDGE_SLOTS = [
  { x: -220, y: -150 },
  { x: 0, y: -194 },
  { x: 220, y: -150 },
  { x: 258, y: 0 },
  { x: 220, y: 150 },
  { x: 0, y: 190 },
  { x: -220, y: 150 },
  { x: -258, y: 0 },
] as const

const COMPACT_EDGE_SLOTS = [
  { x: -275, y: -145 },
  { x: -85, y: -202 },
  { x: 135, y: -190 },
  { x: 310, y: -75 },
  { x: 255, y: 155 },
  { x: 50, y: 205 },
  { x: -205, y: 180 },
  { x: -320, y: 35 },
] as const

export function LiquidInteractionCatalog({
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
  const [hovered, setHovered] = useState<ButtonKey | null>(null)
  const [pressed, setPressed] = useState<ButtonKey | null>(null)
  const [activeControl, setActiveControl] = useState<ButtonKey | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [addExpanded, setAddExpanded] = useState(false)
  const [layer, setLayer] = useState<Layer>('Content')
  const [holding, setHolding] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [recording, setRecording] = useState(false)
  const [density, setDensity] = useState(3)
  const [materialEnabled, setMaterialEnabled] = useState(true)
  const [exportStatus, setExportStatus] = useState('Applied to grammar')
  const holdTimerRef = useRef<number | null>(null)
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
  const fieldPositions = useMemo(() => {
    if (activeControl === null) {
      return FIELD_CONTROLS.map((control) => ({ x: control.dockX, y: control.dockY }))
    }

    const activeIndex = FIELD_CONTROLS.findIndex((control) => control.key === activeControl)

    if (activeControl !== 'layers') {
      const releasedControls = FIELD_CONTROLS.filter(
        (control) => control.key !== activeControl && control.key !== 'layers',
      )
      const groupPosition = GROUP_EDGE_SLOTS[(activeIndex * 3) % GROUP_EDGE_SLOTS.length] ?? {
        x: 0,
        y: 190,
      }
      const occupiedSlots = new Set(
        COMPACT_EDGE_SLOTS.map((position, positionIndex) => ({
          distance: Math.hypot(position.x - groupPosition.x, position.y - groupPosition.y),
          positionIndex,
        }))
          .sort((left, right) => left.distance - right.distance)
          .slice(0, 2)
          .map(({ positionIndex }) => positionIndex),
      )
      const availableSlots = COMPACT_EDGE_SLOTS.filter(
        (_, positionIndex) => !occupiedSlots.has(positionIndex),
      )

      return FIELD_CONTROLS.map((control) => {
        if (control.key === activeControl) return { x: 0, y: 0 }
        if (control.key === 'layers') return groupPosition

        const releasedIndex = releasedControls.findIndex(
          (candidate) => candidate.key === control.key,
        )
        return (
          availableSlots[(releasedIndex + activeIndex) % availableSlots.length] ?? {
            x: 0,
            y: 0,
          }
        )
      })
    }

    return FIELD_CONTROLS.map((control, controlIndex) => {
      if (control.key === activeControl) return { x: 0, y: 0 }

      const releasedIndex = controlIndex < activeIndex ? controlIndex : controlIndex - 1
      return SCATTER_SLOTS[(releasedIndex + activeIndex) % SCATTER_SLOTS.length] ?? { x: 0, y: 0 }
    })
  }, [activeControl])
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

  function activateControl(buttonKey: ButtonKey) {
    setActiveControl(buttonKey)

    if (buttonKey === 'favorite') {
      setFavorite((current) => !current)
    } else if (buttonKey === 'add') {
      setAddExpanded((current) => !current)
    } else if (buttonKey === 'record') {
      setRecording((current) => !current)
    } else if (buttonKey === 'stepper') {
      setDensity((current) => (current === 9 ? 1 : current + 1))
    }
  }

  function controlStatus(buttonKey: ButtonKey) {
    if (buttonKey === 'favorite') return favorite ? 'Held in memory' : 'Ready to hold'
    if (buttonKey === 'add') return addExpanded ? 'Body expanded' : 'Body compact'
    if (buttonKey === 'record') return recording ? 'Signal live' : 'Signal idle'
    if (buttonKey === 'stepper') return `Density ${density.toString().padStart(2, '0')}`
    if (buttonKey === 'hold') return confirmed ? 'Intent confirmed' : 'Pressure waiting'
    if (buttonKey === 'layers') return `${layer} lens selected`
    if (buttonKey === 'tune') return 'Optics ready'

    return 'Field armed'
  }

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
    <div {...stylexProps(styles.root)}>
      <StyleguideSection
        description="A composed set of controls rests as one liquid assembly. Choose an intention and its control holds the center while every other body releases toward the boundary."
        id="buttons-heading"
        index="07"
        title="Buttons in a light field"
      >
        <article
          {...stylexProps(styles.stage, styles.buttonStage, materialStyle)}
          data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
        >
          <LiquidBackdrop label="Interactive control field" />
          <StageHeader
            canRender={canRender}
            eyebrow="Control study / 07"
            title="Choose an intention."
          />

          <div {...stylexProps(styles.buttonRenderLayer)}>
            <div {...stylexProps(styles.buttonFieldScene)}>
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
                      shadowBlur={30}
                      shadowColor={{ r: 0.02, g: 0.03, b: 0.12, a: 0.38 }}
                      shadowOffsetY={10}
                      spacing={activeControl === null ? 42 : 54}
                      specularOpacity={material.specularOpacity}
                      specularSharpness={material.specularSharpness}
                      specularStrength={material.specularStrength}
                      surfaceProfile={material.surfaceProfile}
                      thickness={material.thickness}
                      tint={material.tint}
                      transition={{ spacing: FERROUS_SPRING }}
                    >
                      <ZStack alignment="center">
                        {FIELD_CONTROLS.map((control, controlIndex) => {
                          const active = activeControl === control.key
                          const position = fieldPositions[controlIndex] ?? { x: 0, y: 0 }
                          const activeWidth =
                            control.key === 'add' && !addExpanded ? 76 : control.activeWidth
                          const controlWidth = active ? activeWidth : control.width
                          const controlHeight = active ? control.activeHeight : control.height
                          const scale =
                            pressed === control.key
                              ? 0.965
                              : hovered === control.key
                                ? active
                                  ? 1.018
                                  : 1.075
                                : 1

                          return (
                            <Transform
                              key={control.key}
                              origin={{ x: 0.5, y: 0.5 }}
                              scaleX={scale}
                              scaleY={scale}
                              transition={{
                                scaleX: FERROUS_SPRING,
                                scaleY: FERROUS_SPRING,
                                x: FERROUS_SPRING,
                                y: FERROUS_SPRING,
                              }}
                              x={position.x}
                              y={position.y}
                            >
                              {control.key === 'layers' ? (
                                <ZStack alignment="center">
                                  <Frame
                                    height={controlHeight}
                                    transition={{ height: FERROUS_SPRING, width: FERROUS_SPRING }}
                                    width={controlWidth}
                                  >
                                    <Glass
                                      cornerRadius={
                                        active
                                          ? Math.min(material.cornerRadius, control.activeRadius)
                                          : Math.min(material.cornerRadius, control.radius)
                                      }
                                      cornerSmoothing={material.cornerSmoothing}
                                      transition={{ cornerRadius: FERROUS_SPRING }}
                                      zIndex={active ? 5 : 1}
                                    />
                                  </Frame>
                                  <Transform
                                    transition={{ x: FERROUS_SPRING }}
                                    x={
                                      layer === 'Surface'
                                        ? -controlWidth / 3
                                        : layer === 'Signal'
                                          ? controlWidth / 3
                                          : 0
                                    }
                                  >
                                    <Frame
                                      height={controlHeight - 10}
                                      transition={{
                                        height: FERROUS_SPRING,
                                        width: FERROUS_SPRING,
                                      }}
                                      width={controlWidth / 3 - 8}
                                    >
                                      <Glass
                                        cornerRadius={Math.min(
                                          material.cornerRadius,
                                          active ? 17 : 13,
                                        )}
                                        cornerSmoothing={material.cornerSmoothing}
                                        transition={{ cornerRadius: FERROUS_SPRING }}
                                        zIndex={active ? 7 : 3}
                                      />
                                    </Frame>
                                  </Transform>
                                </ZStack>
                              ) : (
                                <Frame
                                  height={controlHeight}
                                  transition={{ height: FERROUS_SPRING, width: FERROUS_SPRING }}
                                  width={controlWidth}
                                >
                                  <Glass
                                    cornerRadius={
                                      active
                                        ? Math.min(material.cornerRadius, control.activeRadius)
                                        : Math.min(material.cornerRadius, control.radius)
                                    }
                                    cornerSmoothing={material.cornerSmoothing}
                                    transition={{ cornerRadius: FERROUS_SPRING }}
                                    zIndex={active ? 5 : 1}
                                  />
                                </Frame>
                              )}
                            </Transform>
                          )
                        })}
                      </ZStack>
                    </GlassContainer>
                  </Frame>
                </LiquidCanvas>
              ) : null}

              <div {...stylexProps(styles.buttonOverlay)}>
                {FIELD_CONTROLS.map((control, controlIndex) => {
                  const active = activeControl === control.key
                  const fieldPosition = fieldPositions[controlIndex] ?? { x: 0, y: 0 }
                  const activeWidth =
                    control.key === 'add' && !addExpanded ? 76 : control.activeWidth
                  const controlPosition = styles.fieldControlPosition({
                    height: `${active ? control.activeHeight : control.height}px`,
                    radius: active
                      ? `${Math.min(material.cornerRadius, control.activeRadius)}px`
                      : `${Math.min(material.cornerRadius, control.radius)}px`,
                    width: `${active ? activeWidth : control.width}px`,
                    x: `${fieldPosition.x}px`,
                    y: `${fieldPosition.y}px`,
                  })
                  const props = interactionProps(control.key)

                  if (control.key === 'layers') {
                    return (
                      <fieldset
                        {...stylexProps(
                          styles.ferrousControl,
                          styles.fieldLayerSelector,
                          controlPosition,
                          active && styles.ferrousControlActive,
                          !canRender && styles.fieldFallbackGlass,
                        )}
                        data-control={control.key}
                        key={control.key}
                        onBlur={() =>
                          setHovered((current) => (current === 'layers' ? null : current))
                        }
                        onFocus={() => setHovered('layers')}
                        onPointerDown={props.onPointerDown}
                        onPointerEnter={props.onPointerEnter}
                        onPointerLeave={props.onPointerLeave}
                        onPointerUp={props.onPointerUp}
                      >
                        <legend className={className(sharedStyles.visuallyHidden)}>
                          Composition layer
                        </legend>
                        {(['Surface', 'Content', 'Signal'] as const).map((candidate) => (
                          <button
                            aria-pressed={layer === candidate}
                            className={className(
                              styles.fieldLayerOption,
                              layer === candidate && styles.fieldLayerOptionSelected,
                            )}
                            key={candidate}
                            onClick={() => {
                              setActiveControl('layers')
                              setLayer(candidate)
                            }}
                            type="button"
                          >
                            <span {...stylexProps(styles.fieldLayerOptionLabel)}>{candidate}</span>
                            <small {...stylexProps(styles.fieldLayerOptionMeta)}>
                              {layer === candidate ? 'Selected' : 'Available'}
                            </small>
                            {layer === candidate ? (
                              <i {...stylexProps(styles.fieldLayerOptionDot)} />
                            ) : null}
                          </button>
                        ))}
                      </fieldset>
                    )
                  }

                  return (
                    <button
                      {...stylexProps(
                        styles.ferrousControl,
                        controlPosition,
                        active && styles.ferrousControlActive,
                        !canRender && styles.fieldFallbackGlass,
                        control.key === 'favorite' && favorite && styles.fieldFavorite,
                      )}
                      aria-label={`${control.label}. ${controlStatus(control.key)}`}
                      aria-pressed={active}
                      data-control={control.key}
                      key={control.key}
                      onClick={(event) => {
                        if (control.key === 'hold') {
                          setActiveControl('hold')
                          if (event.detail === 0) setConfirmed(true)
                          return
                        }
                        activateControl(control.key)
                      }}
                      onPointerCancel={control.key === 'hold' ? stopHold : undefined}
                      onPointerDown={() => {
                        if (control.key === 'hold') startHold()
                        else props.onPointerDown()
                      }}
                      onPointerEnter={props.onPointerEnter}
                      onPointerLeave={() => {
                        props.onPointerLeave()
                        if (control.key === 'hold') stopHold()
                      }}
                      onPointerUp={() => {
                        if (control.key === 'hold') stopHold()
                        else props.onPointerUp()
                      }}
                      type="button"
                    >
                      {control.key === 'hold' ? (
                        <span
                          className={className(
                            styles.fieldHoldProgress,
                            holding && styles.fieldHoldProgressActive,
                            confirmed && styles.fieldHoldProgressConfirmed,
                          )}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span
                        className={className(
                          styles.fieldCompactContent,
                          active && styles.fieldContentHidden,
                        )}
                        aria-hidden="true"
                      >
                        <FieldControlGlyph
                          confirmed={confirmed}
                          controlKey={control.key}
                          density={density}
                          favorite={favorite}
                          recording={recording}
                        />
                        {control.width > 70 ? (
                          <span {...stylexProps(styles.fieldCompactLabel)}>
                            {control.compactLabel}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={className(
                          styles.fieldActiveContent,
                          !active && styles.fieldContentHidden,
                        )}
                        aria-hidden="true"
                      >
                        <FieldActiveControlFace
                          addExpanded={addExpanded}
                          confirmed={confirmed}
                          control={control}
                          density={density}
                          favorite={favorite}
                          recording={recording}
                        />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <StageFooter
            detail="Select · release · gather · reform"
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

function FieldControlGlyph({
  confirmed,
  controlKey,
  density,
  favorite,
  recording,
}: {
  readonly confirmed: boolean
  readonly controlKey: ButtonKey
  readonly density: number
  readonly favorite: boolean
  readonly recording: boolean
}) {
  if (controlKey === 'launch') return <ArrowIcon />
  if (controlKey === 'tune') return <TuneIcon />
  if (controlKey === 'favorite') return <HeartIcon filled={favorite} />
  if (controlKey === 'add') return <PlusIcon />
  if (controlKey === 'record') {
    return (
      <span
        className={className(styles.fieldRecordIndicator, recording && styles.fieldRecordActive)}
      />
    )
  }
  if (controlKey === 'stepper') {
    return (
      <span {...stylexProps(styles.fieldValueGlyph)}>{density.toString().padStart(2, '0')}</span>
    )
  }
  if (controlKey === 'hold') {
    return <span {...stylexProps(styles.fieldTextGlyph)}>{confirmed ? '✓' : '×'}</span>
  }

  return <span {...stylexProps(styles.fieldTextGlyph)}>III</span>
}

function FieldActiveControlFace({
  addExpanded,
  confirmed,
  control,
  density,
  favorite,
  recording,
}: {
  readonly addExpanded: boolean
  readonly confirmed: boolean
  readonly control: FieldControl
  readonly density: number
  readonly favorite: boolean
  readonly recording: boolean
}) {
  const glyph = (
    <FieldControlGlyph
      confirmed={confirmed}
      controlKey={control.key}
      density={density}
      favorite={favorite}
      recording={recording}
    />
  )

  if (control.key === 'launch') {
    return (
      <span {...stylexProps(styles.fieldPrimaryFace)}>
        <i {...stylexProps(styles.fieldCommandLight)} />
        <span {...stylexProps(styles.fieldFaceCopy)}>
          <small {...stylexProps(styles.fieldFaceMeta)}>Primary command</small>
          <strong {...stylexProps(styles.fieldFaceTitle)}>Launch field</strong>
        </span>
        {glyph}
      </span>
    )
  }

  if (control.key === 'tune') {
    return (
      <span {...stylexProps(styles.fieldStackFace)}>
        {glyph}
        <strong {...stylexProps(styles.fieldStackLabel)}>Tune</strong>
      </span>
    )
  }

  if (control.key === 'favorite' || control.key === 'record') {
    return <span {...stylexProps(styles.fieldIconFace)}>{glyph}</span>
  }

  if (control.key === 'add') {
    return (
      <span {...stylexProps(styles.fieldInlineFace)}>
        {glyph}
        {addExpanded ? <strong {...stylexProps(styles.fieldInlineLabel)}>New layer</strong> : null}
      </span>
    )
  }

  if (control.key === 'hold') {
    return (
      <span {...stylexProps(styles.fieldHoldFace)}>
        <span {...stylexProps(styles.fieldHoldIcon)}>{confirmed ? '✓' : '×'}</span>
        <span {...stylexProps(styles.fieldFaceCopy)}>
          <strong {...stylexProps(styles.fieldFaceTitle)}>
            {confirmed ? 'Confirmed' : 'Hold to dissolve'}
          </strong>
          <small {...stylexProps(styles.fieldFaceMeta)}>
            {confirmed ? 'Action ready' : 'Intentional action'}
          </small>
        </span>
      </span>
    )
  }

  if (control.key === 'layers') return null

  return (
    <span {...stylexProps(styles.fieldStepperFace)}>
      <span {...stylexProps(styles.fieldStepperEdge)}>−</span>
      <span {...stylexProps(styles.fieldStepperValue)}>
        <small {...stylexProps(styles.fieldFaceMeta)}>Density</small>
        <strong {...stylexProps(styles.fieldValueGlyph)}>
          {density.toString().padStart(2, '0')}
        </strong>
      </span>
      <span {...stylexProps(styles.fieldStepperEdge)}>+</span>
    </span>
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
    <svg {...stylexProps(styles.commandIconSvg)} aria-hidden="true" fill="none" viewBox="0 0 24 24">
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
