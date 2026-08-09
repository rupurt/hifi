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
import { useState } from 'react'
import './styles/material-workbench.css'

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
    <div className="material-workbench" data-workbench="texture">
      <TextureSurface className="material-workbench-preview" material={material}>
        <div className="texture-workbench-specimen">
          <span>Live substrate / {material.pattern}</span>
          <strong>Texture is information.</strong>
          <p>
            Scale {material.scale}px · intensity {Math.round(material.intensity * 100)}%
          </p>
          <div aria-hidden="true">
            <i />
            <i />
            <i />
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
    <div className="material-workbench" data-workbench="print">
      <PrintSurface className="material-workbench-preview" material={material}>
        <div className="print-workbench-specimen">
          <span>Hifi material proof / 08.08.26</span>
          <strong>The medium sets the rhythm.</strong>
          <p>Live paper, ink, grid, type, rules, and composition.</p>
          <hr />
          <small>
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
          className="material-workbench-toggle"
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
      className="material-workbench-controls"
      onSubmit={(event) => {
        event.preventDefault()
        downloadJson(fileName, json)
        setStatus('JSON exported')
      }}
    >
      <header>
        <span>{label}</span>
        <small>{status}</small>
      </header>
      <div className="material-workbench-fields">{children}</div>
      <details>
        <summary>Theme JSON</summary>
        <pre>{json}</pre>
      </details>
      <footer>
        <button onClick={onReset} type="button">
          Reset preset
        </button>
        <button onClick={() => void copy()} type="button">
          Copy JSON
        </button>
        <button type="submit">Download</button>
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
    <label className="material-workbench-range">
      <span>
        {label}
        <output>{value.toFixed(step < 1 ? 2 : 0)}</output>
      </span>
      <input
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
    <label className="material-workbench-color">
      <span>
        {label}
        <output>{value}</output>
      </span>
      <input onChange={(event) => onChange(event.currentTarget.value)} type="color" value={value} />
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
    <label className="material-workbench-text">
      <span>{label}</span>
      <input onChange={(event) => onChange(event.currentTarget.value)} type="text" value={value} />
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
    <label className="material-workbench-select">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.currentTarget.value)} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
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
