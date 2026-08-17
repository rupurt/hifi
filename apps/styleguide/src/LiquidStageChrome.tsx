import type { LiquidMaterial } from '@hifi/liquid'
import { liquidInteractionStyles as styles } from './stylex/liquid-interactions.stylex'
import { className, stylexProps } from './stylex/shared.stylex'

/**
 * The `--lab-*` CSS custom properties every glass surface in the buttons field, the forms
 * demo, and the material lab reads from. `opacity` is overridable so the material lab can dim
 * its specimens without affecting the shared formula.
 */
export function computeMaterialStyle(material: LiquidMaterial, opacity = material.opacity) {
  const profileDirection = material.surfaceProfile === 'concave' ? -1 : 1
  const profileScale = material.surfaceProfile === 'concave' ? 0.94 : 1.04

  return styles.materialVariables({
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
    opacity,
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
}

/** A soft, glass-appropriate backdrop wash — two blooms derived from the actual material tint
 * (so it reflects the glass being shown, the way real light passing through tinted glass
 * would), not a fixed decorative palette. */
export function LiquidBackdrop({ tint }: { readonly tint: LiquidMaterial['tint'] }) {
  const washA = toCssTint({ ...tint, a: Math.min(0.22, tint.a + 0.14) })
  const washB = `rgb(${Math.round(tint.g * 255)} ${Math.round(tint.b * 255)} ${Math.round(tint.r * 255)} / ${Math.min(0.16, tint.a + 0.08)})`

  return (
    <div
      {...stylexProps(styles.backdrop({ washA, washB }))}
      aria-hidden="true"
      role="presentation"
    />
  )
}

export function StageHeader({
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

export function StageFooter({
  detail,
  renderer,
}: {
  readonly detail: string
  readonly renderer: string
}) {
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

export function RangeControl({
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

export function toCssTint({ a, b, g, r }: LiquidMaterial['tint']) {
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${a})`
}

export function toHexColor({ b, g, r }: LiquidMaterial['tint']) {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

export function fromHexColor(value: string) {
  const channels = value.match(/[a-f\d]{2}/gi) ?? ['ff', 'ff', 'ff']

  return {
    b: Number.parseInt(channels[2] ?? 'ff', 16) / 255,
    g: Number.parseInt(channels[1] ?? 'ff', 16) / 255,
    r: Number.parseInt(channels[0] ?? 'ff', 16) / 255,
  }
}

export function toFileName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'liquid-material'
  )
}
