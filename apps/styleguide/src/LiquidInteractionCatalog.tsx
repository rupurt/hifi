import { type LiquidMaterial, supportsLiquidDomRendering } from '@hifi/liquid'
import {
  Frame,
  Glass,
  GlassContainer,
  LiquidCanvas,
  spring,
  Transform,
  ZStack,
} from '@liquid-dom/react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  computeMaterialStyle,
  LiquidBackdrop,
  RangeControl,
  StageFooter,
  StageHeader,
} from './LiquidStageChrome'
import { StyleguideSection } from './StyleguideSection'
import { liquidInteractionStyles as styles } from './stylex/liquid-interactions.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

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

export function LiquidInteractionCatalog({ material }: { readonly material: LiquidMaterial }) {
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
  const holdTimerRef = useRef<number | null>(null)
  const canRender = supportsLiquidDomRendering() && !rendererFailed

  const fieldPositions = useMemoFieldPositions(activeControl)
  const materialStyle = computeMaterialStyle(material)

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

  return (
    <div {...stylexProps(styles.root)}>
      <StyleguideSection
        description="A shared pane of glass holds every control. Choose one and it takes the center while the rest settle back to the edge."
        id="buttons-heading"
        index="07"
        title="Buttons"
      >
        <article
          {...stylexProps(styles.stage, styles.buttonStage, materialStyle)}
          data-liquid-renderer={canRender ? 'webgpu' : 'css-fallback'}
        >
          <LiquidBackdrop tint={material.tint} />
          <StageHeader
            canRender={canRender}
            eyebrow="Interactive glass"
            title="Choose a control."
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
        description="Native browser controls retain their expected semantics while the material supplies tint, blur, and specular highlight."
        id="forms-heading"
        index="08"
        title="Forms"
      >
        <LiquidFormsStage materialStyle={materialStyle} />
      </StyleguideSection>
    </div>
  )
}

function useMemoFieldPositions(activeControl: ButtonKey | null) {
  return useMemo(() => {
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
}

function LiquidFormsStage({
  materialStyle,
}: {
  readonly materialStyle: ReturnType<typeof computeMaterialStyle>
}) {
  const radioName = useId()
  const [checked, setChecked] = useState({ contrast: false, effects: true })
  const [choice, setChoice] = useState<'clear' | 'tinted' | 'frosted'>('tinted')
  const [intensity, setIntensity] = useState(62)

  return (
    <article {...stylexProps(styles.formsPanel, materialStyle)}>
      <div {...stylexProps(styles.formsFieldGrid)}>
        <label {...stylexProps(styles.formField)}>
          <span {...stylexProps(styles.fieldLabel)}>Text input</span>
          <input {...stylexProps(styles.fieldControl)} defaultValue="High fidelity" type="text" />
          <small {...stylexProps(styles.formsFieldHelp)}>Free-form content</small>
        </label>

        <label {...stylexProps(styles.formField)}>
          <span {...stylexProps(styles.fieldLabel)}>Search</span>
          <input
            {...stylexProps(styles.fieldControl)}
            defaultValue="material grammar"
            type="search"
          />
          <small {...stylexProps(styles.formsFieldHelp)}>Query with native clearing behavior</small>
        </label>

        <label {...stylexProps(styles.formField)}>
          <span {...stylexProps(styles.fieldLabel)}>Number</span>
          <input {...stylexProps(styles.fieldControl)} defaultValue="24" min="0" type="number" />
          <small {...stylexProps(styles.formsFieldHelp)}>Numeric input with steppers</small>
        </label>

        <label {...stylexProps(styles.formField)}>
          <span {...stylexProps(styles.fieldLabel)}>Select</span>
          <select {...stylexProps(styles.fieldControl, styles.selectControl)} defaultValue="tinted">
            <option value="clear">Clear</option>
            <option value="tinted">Tinted</option>
            <option value="frosted">Frosted</option>
          </select>
          <small {...stylexProps(styles.formsFieldHelp)}>Bounded native selection</small>
        </label>

        <label {...stylexProps(styles.formField, styles.formsFieldWide)}>
          <span {...stylexProps(styles.fieldLabel)}>Textarea</span>
          <textarea
            {...stylexProps(styles.fieldControl, styles.formsTextarea)}
            defaultValue="A coherent visual language should hold together from the smallest control to the broadest application surface."
          />
          <small {...stylexProps(styles.formsFieldHelp)}>Longer composition and notes</small>
        </label>

        <div {...stylexProps(styles.formField)}>
          <RangeControl
            label="Intensity"
            max={100}
            min={0}
            onChange={setIntensity}
            suffix="%"
            value={intensity}
          />
        </div>
      </div>

      <div {...stylexProps(styles.choiceGrid)}>
        <fieldset {...stylexProps(styles.choiceGroup)}>
          <legend {...stylexProps(styles.choiceLegend)}>Checkboxes</legend>
          <label {...stylexProps(styles.choiceLabel)}>
            <input
              {...stylexProps(styles.choiceInput, styles.choiceCheckbox)}
              checked={checked.effects}
              onChange={(event) =>
                setChecked((current) => ({ ...current, effects: event.currentTarget.checked }))
              }
              type="checkbox"
            />
            Show glass effects
          </label>
          <label {...stylexProps(styles.choiceLabel)}>
            <input
              {...stylexProps(styles.choiceInput, styles.choiceCheckbox)}
              checked={checked.contrast}
              onChange={(event) =>
                setChecked((current) => ({ ...current, contrast: event.currentTarget.checked }))
              }
              type="checkbox"
            />
            Increase contrast
          </label>
          <label {...stylexProps(styles.choiceLabel)}>
            <input
              {...stylexProps(styles.choiceInput, styles.choiceCheckbox)}
              disabled
              type="checkbox"
            />
            Unavailable option
          </label>
        </fieldset>

        <fieldset {...stylexProps(styles.choiceGroup)}>
          <legend {...stylexProps(styles.choiceLegend)}>Glass finish</legend>
          {(['clear', 'tinted', 'frosted'] as const).map((option) => (
            <label {...stylexProps(styles.choiceLabel)} key={option}>
              <input
                {...stylexProps(styles.choiceInput, styles.choiceRadio)}
                checked={choice === option}
                name={radioName}
                onChange={() => setChoice(option)}
                type="radio"
              />
              {option[0]?.toUpperCase()}
              {option.slice(1)}
            </label>
          ))}
        </fieldset>

        <div {...stylexProps(styles.formsPickerGroup)}>
          <label {...stylexProps(styles.formField)}>
            <span {...stylexProps(styles.fieldLabel)}>Color</span>
            <input
              {...stylexProps(styles.fieldControl, styles.colorControl)}
              defaultValue="#6558f5"
              type="color"
            />
          </label>
          <label {...stylexProps(styles.formField)}>
            <span {...stylexProps(styles.fieldLabel)}>Date</span>
            <input {...stylexProps(styles.fieldControl)} defaultValue="2026-08-08" type="date" />
          </label>
          <label {...stylexProps(styles.formField)}>
            <span {...stylexProps(styles.fieldLabel)}>File</span>
            <input {...stylexProps(styles.formsFileInput)} type="file" />
          </label>
        </div>
      </div>
    </article>
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
