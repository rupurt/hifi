import type { PropsWithChildren } from 'react'
import { type MosaicMaterial, mosaicThemeMaterials } from './material.js'

export type MosaicTileTone = 'accent' | 'neutral' | 'tile'

export interface MosaicTileProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: MosaicMaterial
  readonly rowSpan?: 1 | 2 | 3
  readonly span?: 1 | 2 | 3
  readonly tone?: MosaicTileTone
}

export function MosaicTile({
  children,
  className,
  material = mosaicThemeMaterials.modular,
  rowSpan = 1,
  span = 1,
  tone = 'tile',
}: MosaicTileProps) {
  const palette = getTonePalette(material, tone)

  return (
    <article
      className={className}
      data-mosaic-tone={tone}
      style={{
        backgroundColor: palette.background,
        border: `${Math.max(1, material.jointWidth)}px solid ${material.jointColor}`,
        borderRadius: material.radius,
        boxShadow:
          material.relief > 0
            ? `${material.relief}px ${material.relief}px 0 ${material.jointColor}`
            : 'none',
        color: palette.foreground,
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`,
        minWidth: 0,
        padding: 'var(--mosaic-tile-padding, 24px)',
        position: 'relative',
      }}
    >
      {children}
    </article>
  )
}

function getTonePalette(material: MosaicMaterial, tone: MosaicTileTone) {
  switch (tone) {
    case 'accent':
      return { background: material.accentColor, foreground: material.accentTextColor }
    case 'neutral':
      return { background: material.backgroundColor, foreground: material.foregroundColor }
    default:
      return { background: material.tileColor, foreground: material.tileTextColor }
  }
}
