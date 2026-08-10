import {
  KineticButton,
  type KineticMaterial,
  type KineticResponse,
  KineticSurface,
  serializeKineticMaterial,
} from '@hifi/kinetic'
import {
  type PrintComposition,
  type PrintMaterial,
  PrintSurface,
  type PrintTypeface,
  serializePrintMaterial,
} from '@hifi/print'
import {
  type SignalMaterial,
  type SignalMode,
  SignalSurface,
  type SignalWaveform,
  serializeSignalMaterial,
} from '@hifi/signal'
import {
  serializeTextureMaterial,
  type TextureMaterial,
  type TexturePattern,
  TextureSurface,
} from '@hifi/texture'
import { useEffect, useRef, useState } from 'react'
import { className, stylexProps } from './stylex/shared.stylex'
import { workbenchClass, workbenchStyles } from './stylex/workbench.stylex'

const SIGNAL_SPECTRUM_BINS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
] as const

export function SignalMaterialLab({
  material,
  onChange,
  onReset,
}: {
  readonly material: SignalMaterial
  readonly onChange: (material: SignalMaterial) => void
  readonly onReset: () => void
}) {
  const json = serializeSignalMaterial(material)
  const { active, available, toggle } = useSignalMonitor(material)

  function update(patch: Partial<SignalMaterial>) {
    onChange({ ...material, ...patch })
  }

  return (
    <div className={workbenchClass('material-workbench')} data-workbench="signal">
      <SignalSurface
        className={className(workbenchStyles.preview, workbenchStyles.signalPreview)}
        material={material}
      >
        <div className={workbenchClass('signal-workbench-specimen')}>
          <header className={className(workbenchStyles.specimenRow, workbenchStyles.specimenMeta)}>
            <span>Channel 05 / {material.mode}</span>
            <span>{material.scanRate.toFixed(0)} Hz</span>
          </header>
          <div className={workbenchClass('signal-instrument-row')}>
            <section
              aria-label="Generated waveform"
              className={workbenchClass('signal-waveform-plane')}
            >
              <svg
                {...stylexProps(workbenchStyles.waveformSvg)}
                aria-hidden="true"
                preserveAspectRatio="none"
                viewBox="0 0 600 160"
              >
                <path
                  {...stylexProps(workbenchStyles.waveform)}
                  d={getWaveformPath(material.waveform)}
                />
                <path
                  className={className(
                    workbenchStyles.waveform,
                    workbenchStyles.waveformAfterimage,
                  )}
                  d={getWaveformPath(material.waveform)}
                />
              </svg>
              <span {...stylexProps(workbenchStyles.planeLabel)}>01 / waveform</span>
            </section>
            <section
              aria-label="Generated spectrum"
              className={workbenchClass('signal-spectrum-plane')}
            >
              <div {...stylexProps(workbenchStyles.spectrum)} aria-hidden="true">
                {SIGNAL_SPECTRUM_BINS.map((bin, index) => {
                  const height = `${
                    18 +
                    Math.abs(Math.sin(index * 0.82 + material.noise * 8)) * material.intensity * 76
                  }%`

                  return <i {...stylexProps(workbenchStyles.spectrumBar(height))} key={bin} />
                })}
              </div>
              <span {...stylexProps(workbenchStyles.planeLabel)}>02 / spectrum</span>
            </section>
          </div>
          <footer className={className(workbenchStyles.specimenRow, workbenchStyles.specimenMeta)}>
            <div>
              <strong {...stylexProps(workbenchStyles.block)}>{material.name}</strong>
              <small {...stylexProps(workbenchStyles.muted)}>
                Decay {material.decay.toFixed(2)}s · focus {Math.round(material.focus * 100)}%
              </small>
            </div>
            <button
              className={className(
                workbenchStyles.monitorButton,
                active && workbenchStyles.monitorActive,
              )}
              aria-pressed={active}
              disabled={!available}
              onClick={() => void toggle()}
              type="button"
            >
              {available ? (active ? 'Mute monitor' : 'Monitor signal') : 'Audio unavailable'}
            </button>
          </footer>
        </div>
      </SignalSurface>

      <WorkbenchControls
        fileName={`${toFileName(material.name)}.json`}
        json={json}
        label="Signal theme generator"
        onReset={onReset}
      >
        <WorkbenchText
          label="Theme name"
          onChange={(name) => update({ name })}
          value={material.name}
        />
        <WorkbenchSelect
          label="Signal mode"
          onChange={(value) => update({ mode: value as SignalMode })}
          options={['trace', 'matrix', 'spectrum', 'lowlight']}
          value={material.mode}
        />
        <WorkbenchSelect
          label="Waveform"
          onChange={(value) => update({ waveform: value as SignalWaveform })}
          options={['sine', 'square', 'sawtooth', 'triangle']}
          value={material.waveform}
        />
        <WorkbenchColor
          label="Emission"
          onChange={(emissionColor) => update({ emissionColor })}
          value={material.emissionColor}
        />
        <WorkbenchColor
          label="Secondary"
          onChange={(secondaryColor) => update({ secondaryColor })}
          value={material.secondaryColor}
        />
        <WorkbenchColor
          label="Black floor"
          onChange={(backgroundColor) => update({ backgroundColor })}
          value={material.backgroundColor}
        />
        <WorkbenchRange
          label="Intensity"
          max={1}
          min={0.1}
          onChange={(intensity) => update({ intensity })}
          step={0.01}
          value={material.intensity}
        />
        <WorkbenchRange
          label="Bloom"
          max={40}
          min={0}
          onChange={(bloom) => update({ bloom })}
          value={material.bloom}
        />
        <WorkbenchRange
          label="Persistence"
          max={3}
          min={0.08}
          onChange={(decay) => update({ decay })}
          step={0.01}
          value={material.decay}
        />
        <WorkbenchRange
          label="Focus"
          max={1}
          min={0.1}
          onChange={(focus) => update({ focus })}
          step={0.01}
          value={material.focus}
        />
        <WorkbenchRange
          label="Noise"
          max={0.4}
          min={0}
          onChange={(noise) => update({ noise })}
          step={0.01}
          value={material.noise}
        />
        <WorkbenchRange
          label="Scan rate"
          max={60}
          min={1}
          onChange={(scanRate) => update({ scanRate })}
          value={material.scanRate}
        />
        <WorkbenchRange
          label="Trace width"
          max={8}
          min={0.5}
          onChange={(traceWidth) => update({ traceWidth })}
          step={0.5}
          value={material.traceWidth}
        />
        <WorkbenchRange
          label="Grid"
          max={64}
          min={8}
          onChange={(gridSize) => update({ gridSize })}
          value={material.gridSize}
        />
        <WorkbenchRange
          label="Audio gain"
          max={0.08}
          min={0}
          onChange={(audioGain) => update({ audioGain })}
          step={0.001}
          value={material.audioGain}
        />
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
                <div
                  {...stylexProps(
                    workbenchStyles.encoder,
                    workbenchStyles.encoderRotation(encoder * detentAngle),
                  )}
                  aria-hidden="true"
                >
                  <i {...stylexProps(workbenchStyles.encoderMark)} />
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

function getWaveformPath(waveform: SignalWaveform) {
  switch (waveform) {
    case 'square':
      return 'M0 120H75V40H150V120H225V40H300V120H375V40H450V120H525V40H600'
    case 'sawtooth':
      return 'M0 128L100 32V128L200 32V128L300 32V128L400 32V128L500 32V128L600 32'
    case 'triangle':
      return 'M0 120L75 40L150 120L225 40L300 120L375 40L450 120L525 40L600 120'
    default:
      return 'M0 80C25 18 75 18 100 80S175 142 200 80S275 18 300 80S375 142 400 80S475 18 500 80S575 142 600 80'
  }
}

function useSignalMonitor(material: SignalMaterial) {
  const context = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)
  const oscillator = useRef<OscillatorNode | null>(null)
  const [active, setActive] = useState(false)
  const available =
    typeof window !== 'undefined' &&
    Boolean(
      window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext,
    )

  useEffect(() => {
    if (!oscillator.current || !gain.current || !context.current) return

    const now = context.current.currentTime
    oscillator.current.type = material.waveform
    oscillator.current.frequency.setTargetAtTime(72 + material.scanRate * 4.25, now, 0.04)
    gain.current.gain.setTargetAtTime(material.audioGain, now, 0.04)
  }, [material.audioGain, material.scanRate, material.waveform])

  useEffect(
    () => () => {
      oscillator.current?.stop()
      oscillator.current?.disconnect()
      gain.current?.disconnect()
      void context.current?.close()
    },
    [],
  )

  async function toggle() {
    if (!available) return

    if (active) {
      oscillator.current?.stop()
      oscillator.current?.disconnect()
      gain.current?.disconnect()
      oscillator.current = null
      gain.current = null
      setActive(false)
      return
    }

    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextConstructor) return

    const audioContext = context.current ?? new AudioContextConstructor()
    context.current = audioContext
    await audioContext.resume()

    const nextOscillator = audioContext.createOscillator()
    const nextGain = audioContext.createGain()
    nextOscillator.type = material.waveform
    nextOscillator.frequency.value = 72 + material.scanRate * 4.25
    nextGain.gain.value = material.audioGain
    nextOscillator.connect(nextGain).connect(audioContext.destination)
    nextOscillator.start()
    oscillator.current = nextOscillator
    gain.current = nextGain
    setActive(true)
  }

  return { active, available, toggle }
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
