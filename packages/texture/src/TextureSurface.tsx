import type { CSSProperties, PropsWithChildren } from 'react'
import type { TextureThemeName } from './grammar'
import { type TextureMaterial, type TexturePattern, textureThemeMaterials } from './material'

export interface TextureSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: TextureMaterial
  readonly theme?: TextureThemeName
}

export function TextureSurface({
  children,
  className,
  material,
  theme = 'paper',
}: TextureSurfaceProps) {
  const selected = material ?? textureThemeMaterials[theme]

  return (
    <section
      className={className}
      style={{
        ...getTextureMaterialStyle(selected),
        border: '1px solid rgb(44 36 24 / 0.22)',
        borderRadius: selected.borderRadius,
        boxShadow: `0 ${selected.shadowDepth}px ${selected.shadowDepth * 2.4}px rgb(42 29 16 / 0.2)`,
        display: 'grid',
        minHeight: 'var(--texture-surface-min-height, 320px)',
        padding: 'var(--texture-surface-padding, 48px)',
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      {children}
    </section>
  )
}

export function getTextureMaterialStyle(material: TextureMaterial): CSSProperties {
  const texture = mix(material.textureColor, material.intensity)
  const highlight = mix(material.highlightColor, material.intensity)
  const scale = `${material.scale}px`
  const line = `${Math.max(1, material.scale - 1)}px`

  const patterns: Record<TexturePattern, string> = {
    crosshatch: `repeating-linear-gradient(45deg, transparent 0 ${line}, ${highlight} ${line} ${scale}), repeating-linear-gradient(-45deg, transparent 0 ${line}, ${texture} ${line} ${scale})`,
    fiber: `radial-gradient(circle at 20% 30%, ${texture} 0 1px, transparent 1.5px), radial-gradient(circle at 70% 65%, ${highlight} 0 1px, transparent 1.5px)`,
    grain: `radial-gradient(circle at 25% 25%, ${texture} 0 0.7px, transparent 1px)`,
    weave: `repeating-linear-gradient(0deg, transparent 0 ${line}, ${texture} ${line} ${scale}), repeating-linear-gradient(90deg, transparent 0 ${line}, ${highlight} ${line} ${scale})`,
  }

  return {
    backgroundColor: material.backgroundColor,
    backgroundImage: patterns[material.pattern],
    backgroundSize:
      material.pattern === 'fiber'
        ? `${scale} ${scale}, ${material.scale + 3}px ${material.scale + 2}px`
        : scale,
    color: material.foregroundColor,
  }
}

function mix(color: string, intensity: number) {
  return `color-mix(in srgb, ${color} ${Math.round(intensity * 100)}%, transparent)`
}
