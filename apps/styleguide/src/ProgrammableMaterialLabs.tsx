import {
  KineticButton,
  type KineticMaterial,
  type KineticResponse,
  KineticSurface,
  serializeKineticMaterial,
} from '@hifi/kinetic'
import {
  type MosaicMaterial,
  type MosaicPattern,
  MosaicSurface,
  MosaicTile,
  serializeMosaicMaterial,
} from '@hifi/mosaic'
import {
  type PrintComposition,
  type PrintMaterial,
  PrintSurface,
  type PrintTypeface,
  serializePrintMaterial,
} from '@hifi/print'
import {
  serializeTextureMaterial,
  type TextureMaterial,
  type TexturePattern,
  TextureSurface,
} from '@hifi/texture'
import { useEffect, useRef, useState } from 'react'
import { className, stylexProps } from './stylex/shared.stylex'
import { workbenchClass, workbenchStyles } from './stylex/workbench.stylex'

export function MosaicMaterialLab({
  material,
  onChange,
  onReset,
}: {
  readonly material: MosaicMaterial
  readonly onChange: (material: MosaicMaterial) => void
  readonly onReset: () => void
}) {
  const json = serializeMosaicMaterial(material)

  function update(patch: Partial<MosaicMaterial>) {
    onChange({ ...material, ...patch })
  }

  return (
    <div className={workbenchClass('material-workbench')} data-workbench="mosaic">
      <MosaicSurface
        className={className(workbenchStyles.preview, workbenchStyles.mosaicPreview)}
        material={material}
      >
        <MosaicTile
          className={className(workbenchStyles.mosaicFeature)}
          material={material}
          weight={4}
        >
          <span className={className(workbenchStyles.specimenMeta)}>Primary tile / 01</span>
          <strong className={className(workbenchStyles.mosaicTitle)}>SOLID COLOR CLEAR TYPE</strong>
          <small className={className(workbenchStyles.mosaicFooter)}>{material.name}</small>
        </MosaicTile>
        <MosaicTile material={material} tone="accent" weight={1}>
          <span className={className(workbenchStyles.specimenMeta)}>Cells</span>
          <strong className={className(workbenchStyles.mosaicMetric)}>{material.cellSize}</strong>
        </MosaicTile>
        <MosaicTile material={material} tone="neutral" weight={1} />
        <MosaicTile material={material} tone="neutral" weight={2}>
          <span className={className(workbenchStyles.specimenMeta)}>
            Pattern / {material.pattern}
          </span>
          <p className={className(workbenchStyles.mosaicCopy)}>
            Decorative fields carry rhythm. Messages stay on explicit contrast pairs.
          </p>
        </MosaicTile>
      </MosaicSurface>

      <WorkbenchControls
        fileName={`${toFileName(material.name)}.json`}
        json={json}
        label="Mosaic theme generator"
        onReset={onReset}
      >
        <WorkbenchText
          label="Theme name"
          onChange={(name) => update({ name })}
          value={material.name}
        />
        <WorkbenchSelect
          label="Pattern"
          onChange={(value) => update({ pattern: value as MosaicPattern })}
          options={['grid', 'tessellation', 'leadwork', 'pixel']}
          value={material.pattern}
        />
        <WorkbenchColor
          label="Background"
          onChange={(backgroundColor) => update({ backgroundColor })}
          value={material.backgroundColor}
        />
        <WorkbenchColor
          label="Foreground"
          onChange={(foregroundColor) => update({ foregroundColor })}
          value={material.foregroundColor}
        />
        <WorkbenchColor
          label="Tile"
          onChange={(tileColor) => update({ tileColor })}
          value={material.tileColor}
        />
        <WorkbenchColor
          label="Tile text"
          onChange={(tileTextColor) => update({ tileTextColor })}
          value={material.tileTextColor}
        />
        <WorkbenchColor
          label="Accent"
          onChange={(accentColor) => update({ accentColor })}
          value={material.accentColor}
        />
        <WorkbenchColor
          label="Accent text"
          onChange={(accentTextColor) => update({ accentTextColor })}
          value={material.accentTextColor}
        />
        <WorkbenchColor
          label="Secondary"
          onChange={(secondaryColor) => update({ secondaryColor })}
          value={material.secondaryColor}
        />
        <WorkbenchColor
          label="Joint"
          onChange={(jointColor) => update({ jointColor })}
          value={material.jointColor}
        />
        <WorkbenchRange
          label="Cell size"
          max={96}
          min={16}
          onChange={(cellSize) => update({ cellSize })}
          value={material.cellSize}
        />
        <WorkbenchRange
          label="Joint width"
          max={12}
          min={1}
          onChange={(jointWidth) => update({ jointWidth })}
          value={material.jointWidth}
        />
        <WorkbenchRange
          label="Corner chamfer"
          max={24}
          min={0}
          onChange={(radius) => update({ radius })}
          value={material.radius}
        />
        <WorkbenchRange
          label="Relief"
          max={10}
          min={0}
          onChange={(relief) => update({ relief })}
          value={material.relief}
        />
        <WorkbenchRange
          label="Light angle"
          max={360}
          min={0}
          onChange={(lightAngle) => update({ lightAngle })}
          value={material.lightAngle}
        />
        <WorkbenchRange
          label="Perturbation"
          max={1}
          min={0}
          onChange={(perturbation) => update({ perturbation })}
          step={0.01}
          value={material.perturbation}
        />
        <WorkbenchRange
          label="Edge segments"
          max={4}
          min={1}
          onChange={(edgeSegments) => update({ edgeSegments })}
          value={material.edgeSegments}
        />
        <WorkbenchRange
          label="Settle tempo"
          max={160}
          min={0}
          onChange={(tempo) => update({ tempo })}
          value={material.tempo}
        />
        <div className={className(workbenchStyles.row)}>
          <WorkbenchRange
            label="Seed"
            max={9999}
            min={0}
            onChange={(seed) => update({ seed })}
            value={material.seed}
          />
          <button
            className={className(workbenchStyles.footerButton)}
            onClick={() => update({ seed: Math.floor(Math.random() * 10000) })}
            type="button"
          >
            Reseed
          </button>
        </div>
      </WorkbenchControls>
    </div>
  )
}

export function KineticMaterialLab({
  material,
  onChange,
  onReset,
}: {
  readonly material: KineticMaterial
  readonly onChange: (material: KineticMaterial) => void
  readonly onReset: () => void
}) {
  const json = serializeKineticMaterial(material)
  const [encoder, setEncoder] = useState(3)
  const [fader, setFader] = useState(62)
  const [feedbackEnabled, setFeedbackEnabled] = useState(false)
  const triggerFeedback = useKineticFeedback(material, feedbackEnabled)
  const detentAngle = 360 / Math.max(1, material.detents)

  function update(patch: Partial<KineticMaterial>) {
    onChange({ ...material, ...patch })
  }

  return (
    <div className={workbenchClass('material-workbench')} data-workbench="kinetic">
      <KineticSurface
        className={className(workbenchStyles.preview, workbenchStyles.kineticPreview)}
        material={material}
      >
        <div className={workbenchClass('kinetic-workbench-specimen')}>
          <header className={className(workbenchStyles.specimenRow, workbenchStyles.specimenMeta)}>
            <span>Mechanism bench / {material.response}</span>
            <button
              aria-pressed={feedbackEnabled}
              className={className(
                workbenchStyles.feedbackButton,
                feedbackEnabled && workbenchStyles.feedbackActive,
              )}
              onClick={() => setFeedbackEnabled((current) => !current)}
              type="button"
            >
              Feedback {feedbackEnabled ? 'on' : 'off'}
            </button>
          </header>
          <div className={workbenchClass('kinetic-mechanisms')}>
            <section className={workbenchClass('kinetic-actuator-plane')}>
              <span {...stylexProps(workbenchStyles.specimenMeta)}>01 / linear actuator</span>
              <KineticButton
                className={className(workbenchStyles.actuatorButton)}
                material={material}
                onClick={() => void triggerFeedback()}
                type="button"
              >
                <small {...stylexProps(workbenchStyles.specimenMeta)}>
                  Travel {material.travel.toFixed(1)} mm
                </small>
                <strong {...stylexProps(workbenchStyles.actuatorTitle)}>ACTUATE</strong>
              </KineticButton>
              <output {...stylexProps(workbenchStyles.specimenMeta)}>
                {Math.round(material.actuation * 100)}% threshold
              </output>
            </section>
            <section className={workbenchClass('kinetic-encoder-plane')}>
              <span {...stylexProps(workbenchStyles.specimenMeta)}>02 / rotary encoder</span>
              <div className={workbenchClass('kinetic-encoder-control')}>
                <button
                  aria-label="Rotate encoder counterclockwise"
                  className={className(workbenchStyles.encoderStep)}
                  onClick={() => setEncoder((current) => current - 1)}
                  type="button"
                >
                  −
                </button>
                <div {...stylexProps(workbenchStyles.encoder)} aria-hidden="true">
                  <i
                    {...stylexProps(
                      workbenchStyles.encoderRotor,
                      workbenchStyles.encoderRotation(encoder * detentAngle),
                    )}
                  >
                    <i {...stylexProps(workbenchStyles.encoderMark)} />
                  </i>
                </div>
                <button
                  aria-label="Rotate encoder clockwise"
                  className={className(workbenchStyles.encoderStep)}
                  onClick={() => setEncoder((current) => current + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
              <output {...stylexProps(workbenchStyles.specimenMeta)}>
                {material.detents.toFixed(0)} detents / revolution
              </output>
            </section>
          </div>
          <label className={workbenchClass('kinetic-fader')}>
            <span className={className(workbenchStyles.specimenRow, workbenchStyles.specimenMeta)}>
              Force transfer <output>{fader}%</output>
            </span>
            <input
              {...stylexProps(workbenchStyles.range)}
              max="100"
              min="0"
              onChange={(event) => setFader(event.currentTarget.valueAsNumber)}
              type="range"
              value={fader}
            />
          </label>
          <footer className={className(workbenchStyles.specimenRow, workbenchStyles.specimenMeta)}>
            <span>Mass {material.mass.toFixed(2)} kg</span>
            <span>k {material.stiffness.toFixed(0)} N/m</span>
            <span>ζ {material.damping.toFixed(0)}</span>
            <span>μ {material.friction.toFixed(2)}</span>
          </footer>
        </div>
      </KineticSurface>

      <WorkbenchControls
        fileName={`${toFileName(material.name)}.json`}
        json={json}
        label="Kinetic theme generator"
        onReset={onReset}
      >
        <WorkbenchText
          label="Theme name"
          onChange={(name) => update({ name })}
          value={material.name}
        />
        <WorkbenchSelect
          label="Response"
          onChange={(value) => update({ response: value as KineticResponse })}
          options={['precision', 'spring', 'magnetic', 'viscous']}
          value={material.response}
        />
        <WorkbenchColor
          label="Chassis"
          onChange={(backgroundColor) => update({ backgroundColor })}
          value={material.backgroundColor}
        />
        <WorkbenchColor
          label="Markings"
          onChange={(foregroundColor) => update({ foregroundColor })}
          value={material.foregroundColor}
        />
        <WorkbenchColor
          label="Action"
          onChange={(accentColor) => update({ accentColor })}
          value={material.accentColor}
        />
        <WorkbenchRange
          label="Mass"
          max={4}
          min={0.1}
          onChange={(mass) => update({ mass })}
          step={0.01}
          value={material.mass}
        />
        <WorkbenchRange
          label="Stiffness"
          max={1200}
          min={80}
          onChange={(stiffness) => update({ stiffness })}
          value={material.stiffness}
        />
        <WorkbenchRange
          label="Damping"
          max={90}
          min={4}
          onChange={(damping) => update({ damping })}
          value={material.damping}
        />
        <WorkbenchRange
          label="Friction"
          max={1}
          min={0}
          onChange={(friction) => update({ friction })}
          step={0.01}
          value={material.friction}
        />
        <WorkbenchRange
          label="Travel"
          max={18}
          min={1}
          onChange={(travel) => update({ travel })}
          step={0.5}
          value={material.travel}
        />
        <WorkbenchRange
          label="Actuation"
          max={0.95}
          min={0.1}
          onChange={(actuation) => update({ actuation })}
          step={0.01}
          value={material.actuation}
        />
        <WorkbenchRange
          label="Detents"
          max={36}
          min={1}
          onChange={(detents) => update({ detents })}
          value={material.detents}
        />
        <WorkbenchRange
          label="Restitution"
          max={1}
          min={0}
          onChange={(restitution) => update({ restitution })}
          step={0.01}
          value={material.restitution}
        />
        <WorkbenchRange
          label="Corner radius"
          max={32}
          min={0}
          onChange={(radius) => update({ radius })}
          value={material.radius}
        />
        <WorkbenchRange
          label="Feedback gain"
          max={0.3}
          min={0}
          onChange={(feedbackGain) => update({ feedbackGain })}
          step={0.01}
          value={material.feedbackGain}
        />
      </WorkbenchControls>
    </div>
  )
}

export function TextureMaterialLab({
  material,
  onChange,
  onReset,
}: {
  readonly material: TextureMaterial
  readonly onChange: (material: TextureMaterial) => void
  readonly onReset: () => void
}) {
  const json = serializeTextureMaterial(material)

  function update(patch: Partial<TextureMaterial>) {
    onChange({ ...material, ...patch })
  }

  return (
    <div className={workbenchClass('material-workbench')} data-workbench="texture">
      <TextureSurface className={workbenchClass('material-workbench-preview')} material={material}>
        <div className={workbenchClass('texture-workbench-specimen')}>
          <span {...stylexProps(workbenchStyles.specimenMeta)}>
            Live substrate / {material.pattern}
          </span>
          <strong {...stylexProps(workbenchStyles.specimenTitle)}>Texture is information.</strong>
          <p {...stylexProps(workbenchStyles.specimenCopy)}>
            Scale {material.scale}px · intensity {Math.round(material.intensity * 100)}%
          </p>
          <div {...stylexProps(workbenchStyles.textureShapes)} aria-hidden="true">
            <i {...stylexProps(workbenchStyles.textureShape)} />
            <i {...stylexProps(workbenchStyles.textureShape, workbenchStyles.textureCircle)} />
            <i {...stylexProps(workbenchStyles.textureShape, workbenchStyles.textureDiamond)} />
          </div>
        </div>
      </TextureSurface>

      <WorkbenchControls
        fileName={`${toFileName(material.name)}.json`}
        json={json}
        label="Texture theme generator"
        onReset={onReset}
      >
        <WorkbenchText
          label="Theme name"
          onChange={(name) => update({ name })}
          value={material.name}
        />
        <WorkbenchSelect
          label="Pattern"
          onChange={(value) => update({ pattern: value as TexturePattern })}
          options={['fiber', 'weave', 'grain', 'crosshatch']}
          value={material.pattern}
        />
        <WorkbenchColor
          label="Substrate"
          onChange={(backgroundColor) => update({ backgroundColor })}
          value={material.backgroundColor}
        />
        <WorkbenchColor
          label="Ink"
          onChange={(foregroundColor) => update({ foregroundColor })}
          value={material.foregroundColor}
        />
        <WorkbenchColor
          label="Fiber"
          onChange={(textureColor) => update({ textureColor })}
          value={material.textureColor}
        />
        <WorkbenchColor
          label="Accent"
          onChange={(accentColor) => update({ accentColor })}
          value={material.accentColor}
        />
        <WorkbenchRange
          label="Intensity"
          max={0.4}
          min={0.02}
          onChange={(intensity) => update({ intensity })}
          step={0.01}
          value={material.intensity}
        />
        <WorkbenchRange
          label="Scale"
          max={32}
          min={3}
          onChange={(scale) => update({ scale })}
          value={material.scale}
        />
        <WorkbenchRange
          label="Corner radius"
          max={40}
          min={0}
          onChange={(borderRadius) => update({ borderRadius })}
          value={material.borderRadius}
        />
        <WorkbenchRange
          label="Relief"
          max={40}
          min={0}
          onChange={(shadowDepth) => update({ shadowDepth })}
          value={material.shadowDepth}
        />
      </WorkbenchControls>
    </div>
  )
}

export function PrintMaterialLab({
  material,
  onChange,
  onReset,
}: {
  readonly material: PrintMaterial
  readonly onChange: (material: PrintMaterial) => void
  readonly onReset: () => void
}) {
  const json = serializePrintMaterial(material)

  function update(patch: Partial<PrintMaterial>) {
    onChange({ ...material, ...patch })
  }

  return (
    <div className={workbenchClass('material-workbench')} data-workbench="print">
      <PrintSurface className={workbenchClass('material-workbench-preview')} material={material}>
        <div className={workbenchClass('print-workbench-specimen')}>
          <span {...stylexProps(workbenchStyles.specimenMeta)}>Hifi material proof / 08.08.26</span>
          <strong {...stylexProps(workbenchStyles.specimenTitle)}>
            The medium sets the rhythm.
          </strong>
          <p {...stylexProps(workbenchStyles.specimenCopy)}>
            Live paper, ink, grid, type, rules, and composition.
          </p>
          <hr {...stylexProps(workbenchStyles.printRule)} />
          <small {...stylexProps(workbenchStyles.specimenMeta)}>
            {material.composition} / {material.typeface}
          </small>
        </div>
      </PrintSurface>

      <WorkbenchControls
        fileName={`${toFileName(material.name)}.json`}
        json={json}
        label="Print theme generator"
        onReset={onReset}
      >
        <WorkbenchText
          label="Theme name"
          onChange={(name) => update({ name })}
          value={material.name}
        />
        <WorkbenchSelect
          label="Composition"
          onChange={(value) => update({ composition: value as PrintComposition })}
          options={['columns', 'split', 'grid', 'field']}
          value={material.composition}
        />
        <WorkbenchSelect
          label="Typeface"
          onChange={(value) => update({ typeface: value as PrintTypeface })}
          options={['serif', 'sans', 'mono', 'display']}
          value={material.typeface}
        />
        <WorkbenchColor
          label="Paper"
          onChange={(paperColor) => update({ paperColor })}
          value={material.paperColor}
        />
        <WorkbenchColor
          label="Ink"
          onChange={(inkColor) => update({ inkColor })}
          value={material.inkColor}
        />
        <WorkbenchColor
          label="Accent"
          onChange={(accentColor) => update({ accentColor })}
          value={material.accentColor}
        />
        <WorkbenchRange
          label="Grid"
          max={64}
          min={8}
          onChange={(gridSize) => update({ gridSize })}
          value={material.gridSize}
        />
        <WorkbenchRange
          label="Rule weight"
          max={8}
          min={0}
          onChange={(ruleWeight) => update({ ruleWeight })}
          value={material.ruleWeight}
        />
        <WorkbenchRange
          label="Shadow offset"
          max={24}
          min={0}
          onChange={(shadowOffset) => update({ shadowOffset })}
          value={material.shadowOffset}
        />
        <button
          aria-pressed={material.uppercase}
          className={workbenchClass('material-workbench-toggle')}
          onClick={() => update({ uppercase: !material.uppercase })}
          type="button"
        >
          Uppercase <span>{material.uppercase ? 'On' : 'Off'}</span>
        </button>
      </WorkbenchControls>
    </div>
  )
}

function WorkbenchControls({
  children,
  fileName,
  json,
  label,
  onReset,
}: {
  readonly children: React.ReactNode
  readonly fileName: string
  readonly json: string
  readonly label: string
  readonly onReset: () => void
}) {
  const [status, setStatus] = useState('Applied to grammar')

  async function copy() {
    try {
      await navigator.clipboard.writeText(json)
      setStatus('JSON copied')
    } catch {
      setStatus('Clipboard unavailable')
    }
  }

  return (
    <form
      className={workbenchClass('material-workbench-controls')}
      onSubmit={(event) => {
        event.preventDefault()
        downloadJson(fileName, json)
        setStatus('JSON exported')
      }}
    >
      <header className={className(workbenchStyles.row, workbenchStyles.controlsHeader)}>
        <span className={className(workbenchStyles.meta, workbenchStyles.metaStrong)}>{label}</span>
        <small className={className(workbenchStyles.meta, workbenchStyles.muted)}>{status}</small>
      </header>
      <div className={workbenchClass('material-workbench-fields')}>{children}</div>
      <details {...stylexProps(workbenchStyles.details)}>
        <summary className={className(workbenchStyles.summary, workbenchStyles.meta)}>
          Theme JSON
        </summary>
        <pre {...stylexProps(workbenchStyles.pre)}>{json}</pre>
      </details>
      <footer className={className(workbenchStyles.row, workbenchStyles.controlsFooter)}>
        <button className={className(workbenchStyles.footerButton)} onClick={onReset} type="button">
          Reset preset
        </button>
        <button
          className={className(workbenchStyles.footerButton)}
          onClick={() => void copy()}
          type="button"
        >
          Copy JSON
        </button>
        <button
          className={className(workbenchStyles.footerButton, workbenchStyles.footerPrimary)}
          type="submit"
        >
          Download
        </button>
      </footer>
    </form>
  )
}

function WorkbenchRange({
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: {
  readonly label: string
  readonly max: number
  readonly min: number
  readonly onChange: (value: number) => void
  readonly step?: number
  readonly value: number
}) {
  return (
    <label className={workbenchClass('material-workbench-range')}>
      <span className={className(workbenchStyles.fieldLabel, workbenchStyles.meta)}>
        {label}
        <output>{value.toFixed(step < 1 ? 2 : 0)}</output>
      </span>
      <input
        {...stylexProps(workbenchStyles.range)}
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

function WorkbenchColor({
  label,
  onChange,
  value,
}: {
  readonly label: string
  readonly onChange: (value: string) => void
  readonly value: string
}) {
  return (
    <label className={workbenchClass('material-workbench-color')}>
      <span className={className(workbenchStyles.fieldLabel, workbenchStyles.meta)}>
        {label}
        <output>{value}</output>
      </span>
      <input
        {...stylexProps(workbenchStyles.colorControl)}
        onChange={(event) => onChange(event.currentTarget.value)}
        type="color"
        value={value}
      />
    </label>
  )
}

function WorkbenchText({
  label,
  onChange,
  value,
}: {
  readonly label: string
  readonly onChange: (value: string) => void
  readonly value: string
}) {
  return (
    <label className={workbenchClass('material-workbench-text')}>
      <span className={className(workbenchStyles.fieldLabel, workbenchStyles.meta)}>{label}</span>
      <input
        {...stylexProps(workbenchStyles.fieldControl)}
        onChange={(event) => onChange(event.currentTarget.value)}
        type="text"
        value={value}
      />
    </label>
  )
}

function WorkbenchSelect({
  label,
  onChange,
  options,
  value,
}: {
  readonly label: string
  readonly onChange: (value: string) => void
  readonly options: readonly string[]
  readonly value: string
}) {
  return (
    <label className={workbenchClass('material-workbench-select')}>
      <span className={className(workbenchStyles.fieldLabel, workbenchStyles.meta)}>{label}</span>
      <select
        {...stylexProps(workbenchStyles.fieldControl, workbenchStyles.capitalize)}
        onChange={(event) => onChange(event.currentTarget.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function useKineticFeedback(material: KineticMaterial, enabled: boolean) {
  const context = useRef<AudioContext | null>(null)

  useEffect(
    () => () => {
      void context.current?.close()
    },
    [],
  )

  return async () => {
    if (!enabled) return

    navigator.vibrate?.(Math.round(5 + material.mass * 5))

    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextConstructor) return

    const audioContext = context.current ?? new AudioContextConstructor()
    context.current = audioContext
    await audioContext.resume()

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const now = audioContext.currentTime
    const duration = 0.035 + Math.min(0.08, material.mass * 0.016)

    oscillator.type = material.response === 'viscous' ? 'sine' : 'triangle'
    oscillator.frequency.setValueAtTime(120 + material.stiffness * 0.32, now)
    oscillator.frequency.exponentialRampToValueAtTime(58 + material.friction * 70, now + duration)
    gain.gain.setValueAtTime(Math.min(0.08, material.feedbackGain), now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + duration)
  }
}

function downloadJson(fileName: string, json: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const anchor = document.createElement('a')
  anchor.download = fileName
  anchor.href = url
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function toFileName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'hifi-theme'
  )
}
