import type { PropsWithChildren } from 'react'
import { type MosaicMaterial, mosaicThemeMaterials } from './material.js'

export type MosaicTileTone = 'accent' | 'neutral' | 'tile'

export interface MosaicTileProps extends PropsWithChildren {
  readonly className?: string
  /** Stable identity for the tile's computed layout slot. Defaults to the element's React key. */
  readonly id?: string
  readonly material?: MosaicMaterial
  readonly tone?: MosaicTileTone
  /** Relative size within the surface's weight-driven treemap. Bigger weight, bigger tile —
   * hierarchy is spatial, not a manually chosen grid span. */
  readonly weight?: number
}

/** A content box. It never computes its own position or shape — `MosaicSurface` owns the real
 * computed geometry for every tile at once, since a tile's box depends on all its siblings'
 * weights, not on itself in isolation. */
export function MosaicTile({
  children,
  className,
  material = mosaicThemeMaterials.modular,
  tone = 'tile',
}: MosaicTileProps) {
  const palette = getTonePalette(material, tone)

  return (
    <article
      className={className}
      data-mosaic-tone={tone}
      style={{
        backgroundColor: palette.background,
        color: palette.foreground,
        height: '100%',
        minWidth: 0,
        overflow: 'hidden',
        padding: 'var(--mosaic-tile-padding, max(24px, var(--mosaic-safe-inset, 24px)))',
        position: 'relative',
        width: '100%',
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
