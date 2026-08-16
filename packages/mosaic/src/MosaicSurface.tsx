import {
  Children,
  type CSSProperties,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import { computeMosaicGeometry } from './geometry.js'
import type { MosaicThemeName } from './grammar.js'
import type { MosaicLayoutSize } from './layout.js'
import { type MosaicMaterial, mosaicThemeMaterials } from './material.js'
import type { MosaicTileProps } from './MosaicTile.js'
import { useReducedMotion } from './useReducedMotion.js'

export interface MosaicSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: MosaicMaterial
  readonly theme?: MosaicThemeName
}

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

export function MosaicSurface({
  children,
  className,
  material,
  theme = 'modular',
}: MosaicSurfaceProps) {
  const selected = material ?? mosaicThemeMaterials[theme]
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<MosaicLayoutSize>({ height: 0, width: 0 })
  const reducedMotion = useReducedMotion()
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const measure = () => {
      const bounds = node.getBoundingClientRect()
      setSize({ height: bounds.height, width: bounds.width })
    }
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<
    MosaicTileProps & { readonly key?: string | number | null }
  >[]
  const leaves = items.map((child, index) => ({
    id: String(child.props.id ?? child.key ?? index),
    weight: Math.max(0.05, child.props.weight ?? 1),
  }))
  const hasGeometry = size.width > 0 && size.height > 0

  // biome-ignore lint/correctness/useExhaustiveDependencies: leaves/size/selected intentionally re-trigger the settle-in animation on every layout/material change
  useEffect(() => {
    setSettled(false)
    if (reducedMotion) {
      setSettled(true)
      return
    }

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettled(true))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [leaves, size, selected, reducedMotion])

  const geometry = hasGeometry ? computeMosaicGeometry(leaves, size, selected) : []
  const geometryById = new Map(geometry.map((tile) => [tile.id, tile]))
  const duration = settleDuration(selected)

  return (
    <section
      className={className}
      data-mosaic-pattern={selected.pattern}
      style={{
        ...getMosaicMaterialStyle(selected),
        backgroundColor: selected.jointColor,
        minHeight: 'var(--mosaic-surface-min-height, 320px)',
        overflow: 'hidden',
        padding: 'var(--mosaic-surface-padding, 32px)',
        position: 'relative',
      }}
    >
      <div
        ref={containerRef}
        style={{
          inset: 0,
          overflow: hasGeometry ? undefined : 'auto',
          position: 'absolute',
          ...(hasGeometry ? {} : { display: 'flex', flexWrap: 'wrap', gap: selected.jointWidth }),
        }}
      >
        {items.map((child, index) => {
          const leaf = leaves[index] ?? { id: String(index), weight: 1 }
          const tile = geometryById.get(leaf.id)

          if (!tile) {
            return (
              <div key={leaf.id} style={{ flexBasis: 0, flexGrow: leaf.weight, minWidth: 0 }}>
                {child}
              </div>
            )
          }

          return (
            <div
              key={leaf.id}
              style={{
                clipPath: tile.clipPath === 'none' ? undefined : tile.clipPath,
                filter: tile.filter,
                height: tile.height,
                left: tile.left,
                opacity: settled ? 1 : 0,
                position: 'absolute',
                top: tile.top,
                transform: settled ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(6px)',
                transition: reducedMotion
                  ? 'none'
                  : `opacity ${duration}ms ${EASING} ${tile.settleDelayMs}ms, transform ${duration}ms ${EASING} ${tile.settleDelayMs}ms`,
                width: tile.width,
              }}
            >
              {child}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function getMosaicMaterialStyle(material: MosaicMaterial): CSSProperties {
  return {
    '--mosaic-accent': material.accentColor,
    '--mosaic-accent-text': material.accentTextColor,
    '--mosaic-background': material.backgroundColor,
    '--mosaic-cell': `${material.cellSize}px`,
    '--mosaic-edge-segments': material.edgeSegments,
    '--mosaic-foreground': material.foregroundColor,
    '--mosaic-joint': material.jointColor,
    '--mosaic-joint-width': `${material.jointWidth}px`,
    '--mosaic-light-angle': `${material.lightAngle}deg`,
    '--mosaic-perturbation': material.perturbation,
    '--mosaic-radius': `${material.radius}px`,
    '--mosaic-relief': `${material.relief}px`,
    '--mosaic-safe-inset': `${Math.ceil(material.perturbation * material.cellSize * 0.3 + material.radius)}px`,
    '--mosaic-secondary': material.secondaryColor,
    '--mosaic-seed': material.seed,
    '--mosaic-tempo': `${material.tempo}ms`,
    '--mosaic-tile': material.tileColor,
    '--mosaic-tile-text': material.tileTextColor,
    backgroundColor: material.backgroundColor,
    color: material.foregroundColor,
  } as CSSProperties
}

function settleDuration(material: MosaicMaterial): number {
  return Math.min(420, Math.max(120, 90 + material.relief * 14 + material.jointWidth * 6))
}
