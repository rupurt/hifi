import type { CSSProperties, PropsWithChildren } from 'react'
import type { MosaicThemeName } from './grammar.js'
import { type MosaicMaterial, mosaicThemeMaterials } from './material.js'

export interface MosaicSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: MosaicMaterial
  readonly theme?: MosaicThemeName
}

export function MosaicSurface({
  children,
  className,
  material,
  theme = 'modular',
}: MosaicSurfaceProps) {
  const selected = material ?? mosaicThemeMaterials[theme]

  return (
    <section
      className={className}
      data-mosaic-pattern={selected.pattern}
      style={{
        ...getMosaicMaterialStyle(selected),
        border: `${Math.max(1, selected.jointWidth)}px solid ${selected.jointColor}`,
        minHeight: 'var(--mosaic-surface-min-height, 320px)',
        overflow: 'hidden',
        padding: 'var(--mosaic-surface-padding, 32px)',
        position: 'relative',
      }}
    >
      {children}
    </section>
  )
}

export function getMosaicMaterialStyle(material: MosaicMaterial): CSSProperties {
  const cell = Math.max(12, material.cellSize)
  const joint = Math.max(1, material.jointWidth)
  const pattern = getMosaicPattern(material, cell, joint)

  return {
    '--mosaic-accent': material.accentColor,
    '--mosaic-accent-text': material.accentTextColor,
    '--mosaic-background': material.backgroundColor,
    '--mosaic-cell': `${cell}px`,
    '--mosaic-foreground': material.foregroundColor,
    '--mosaic-joint': material.jointColor,
    '--mosaic-joint-width': `${joint}px`,
    '--mosaic-offset': material.offset,
    '--mosaic-radius': `${material.radius}px`,
    '--mosaic-relief': `${material.relief}px`,
    '--mosaic-secondary': material.secondaryColor,
    '--mosaic-tile': material.tileColor,
    '--mosaic-tile-text': material.tileTextColor,
    '--mosaic-variation': material.variation,
    backgroundColor: material.backgroundColor,
    backgroundImage: pattern.backgroundImage,
    backgroundPosition: pattern.backgroundPosition,
    backgroundSize: pattern.backgroundSize,
    color: material.foregroundColor,
  } as CSSProperties
}

function getMosaicPattern(material: MosaicMaterial, cell: number, joint: number) {
  const tile = `color-mix(in srgb, ${material.tileColor} ${Math.round(22 + material.variation * 24)}%, transparent)`
  const secondary = `color-mix(in srgb, ${material.secondaryColor} ${Math.round(20 + material.variation * 30)}%, transparent)`
  const accent = `color-mix(in srgb, ${material.accentColor} ${Math.round(18 + material.variation * 28)}%, transparent)`
  const jointColor = `color-mix(in srgb, ${material.jointColor} 78%, transparent)`

  switch (material.pattern) {
    case 'tessellation':
      return {
        backgroundImage: `conic-gradient(from 45deg at 75% 25%, ${tile} 0 90deg, ${secondary} 0 180deg, ${accent} 0 270deg, transparent 0), linear-gradient(${jointColor} ${joint}px, transparent ${joint}px), linear-gradient(90deg, ${jointColor} ${joint}px, transparent ${joint}px)`,
        backgroundPosition: `0 0, ${cell * material.offset}px 0, 0 ${cell * material.offset}px`,
        backgroundSize: `${cell * 2}px ${cell * 2}px, ${cell}px ${cell}px, ${cell}px ${cell}px`,
      }
    case 'leadwork':
      return {
        backgroundImage: `radial-gradient(circle at 18% 22%, ${accent} 0 18%, transparent 18.5%), radial-gradient(circle at 78% 68%, ${secondary} 0 22%, transparent 22.5%), linear-gradient(135deg, ${tile}, transparent 62%), linear-gradient(${jointColor} ${joint}px, transparent ${joint}px), linear-gradient(90deg, ${jointColor} ${joint}px, transparent ${joint}px)`,
        backgroundPosition: '0 0',
        backgroundSize: `${cell * 3}px ${cell * 3}px, ${cell * 4}px ${cell * 4}px, ${cell * 2}px ${cell * 2}px, ${cell}px ${cell}px, ${cell}px ${cell}px`,
      }
    case 'pixel':
      return {
        backgroundImage: `conic-gradient(from 90deg at 50% 50%, ${tile} 0 25%, ${secondary} 0 50%, transparent 0 75%, ${accent} 0), linear-gradient(${jointColor} ${joint}px, transparent ${joint}px), linear-gradient(90deg, ${jointColor} ${joint}px, transparent ${joint}px)`,
        backgroundPosition: '0 0',
        backgroundSize: `${cell * 2}px ${cell * 2}px, ${cell}px ${cell}px, ${cell}px ${cell}px`,
      }
    default:
      return {
        backgroundImage: `linear-gradient(${jointColor} ${joint}px, transparent ${joint}px), linear-gradient(90deg, ${jointColor} ${joint}px, transparent ${joint}px), linear-gradient(135deg, ${tile}, transparent 48%, ${secondary} 48% 67%, transparent 67%), radial-gradient(circle at 72% 28%, ${accent}, transparent 24%)`,
        backgroundPosition: `0 0, 0 0, ${cell * material.offset}px ${cell * material.offset}px, 0 0`,
        backgroundSize: `${cell}px ${cell}px, ${cell}px ${cell}px, ${cell * 3}px ${cell * 3}px, ${cell * 5}px ${cell * 5}px`,
      }
  }
}
