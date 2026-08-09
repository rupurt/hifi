import type { CSSProperties, PropsWithChildren } from 'react'
import type { SignalThemeName } from './grammar.js'
import { type SignalMaterial, signalThemeMaterials } from './material.js'

export interface SignalSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: SignalMaterial
  readonly theme?: SignalThemeName
}

export function SignalSurface({
  children,
  className,
  material,
  theme = 'phosphor',
}: SignalSurfaceProps) {
  const selected = material ?? signalThemeMaterials[theme]

  return (
    <section
      className={className}
      data-signal-mode={selected.mode}
      style={{
        ...getSignalMaterialStyle(selected),
        border: `1px solid color-mix(in srgb, ${selected.emissionColor} 34%, transparent)`,
        display: 'grid',
        minHeight: 'var(--signal-surface-min-height, 320px)',
        overflow: 'hidden',
        padding: 'var(--signal-surface-padding, 48px)',
        placeItems: 'center',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      {children}
    </section>
  )
}

export function getSignalMaterialStyle(material: SignalMaterial): CSSProperties {
  const emission = `color-mix(in srgb, ${material.emissionColor} ${Math.round(material.intensity * 100)}%, transparent)`
  const grid = `color-mix(in srgb, ${material.emissionColor} ${Math.round(5 + material.intensity * 9)}%, transparent)`
  const scanAlpha = Math.round(4 + material.noise * 24)

  return {
    '--signal-bloom': `${material.bloom}px`,
    '--signal-decay': `${material.decay}s`,
    '--signal-focus': material.focus,
    '--signal-grid': `${material.gridSize}px`,
    '--signal-intensity': material.intensity,
    '--signal-noise': material.noise,
    '--signal-rate': `${Math.max(0.3, 60 / material.scanRate)}s`,
    '--signal-trace': `${material.traceWidth}px`,
    backgroundColor: material.backgroundColor,
    backgroundImage: `repeating-linear-gradient(0deg, transparent 0 3px, rgb(255 255 255 / ${scanAlpha / 1000}) 3px 4px), linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px), radial-gradient(circle at 50% 42%, ${emission}, transparent 68%)`,
    backgroundSize: `auto, ${material.gridSize}px ${material.gridSize}px, ${material.gridSize}px ${material.gridSize}px, auto`,
    boxShadow: `inset 0 0 ${material.bloom * 2}px color-mix(in srgb, ${material.emissionColor} 12%, transparent)`,
    color: material.secondaryColor,
    textShadow: `0 0 ${Math.max(2, material.bloom * 0.55)}px ${material.emissionColor}`,
  } as CSSProperties
}
