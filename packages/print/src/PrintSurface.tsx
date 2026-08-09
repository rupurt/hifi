import type { CSSProperties, PropsWithChildren } from 'react'
import type { PrintThemeName } from './grammar.js'
import { type PrintComposition, type PrintMaterial, printThemeMaterials } from './material.js'

export interface PrintSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: PrintMaterial
  readonly theme?: PrintThemeName
}

export function PrintSurface({
  children,
  className,
  material,
  theme = 'broadsheet',
}: PrintSurfaceProps) {
  const selected = material ?? printThemeMaterials[theme]

  return (
    <section
      className={className}
      style={{
        ...getPrintMaterialStyle(selected),
        border: `${selected.ruleWeight}px solid color-mix(in srgb, ${selected.inkColor} 30%, transparent)`,
        boxShadow: `${selected.shadowOffset}px ${selected.shadowOffset + 2}px 0 color-mix(in srgb, ${selected.inkColor} 16%, transparent)`,
        display: 'grid',
        minHeight: 'var(--print-surface-min-height, 320px)',
        padding: 'var(--print-surface-padding, 48px)',
        placeItems: 'center',
        textAlign: 'center',
        textTransform: selected.uppercase ? 'uppercase' : undefined,
      }}
    >
      {children}
    </section>
  )
}

export function getPrintMaterialStyle(material: PrintMaterial): CSSProperties {
  const backgrounds: Record<PrintComposition, string> = {
    columns: `repeating-linear-gradient(90deg, transparent 0 ${material.gridSize - 1}px, color-mix(in srgb, ${material.inkColor} 7%, transparent) ${material.gridSize - 1}px ${material.gridSize}px)`,
    field: material.accentColor,
    grid: `linear-gradient(color-mix(in srgb, ${material.accentColor} 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${material.accentColor} 9%, transparent) 1px, transparent 1px)`,
    split: `linear-gradient(145deg, ${material.accentColor} 0 48%, ${material.paperColor} 48%)`,
  }

  const typefaces: Record<PrintMaterial['typeface'], string> = {
    display: 'Impact, Haettenschweiler, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace',
    sans: 'Arial, Helvetica, sans-serif',
    serif: 'Georgia, Times, serif',
  }

  return {
    backgroundColor: material.paperColor,
    backgroundImage:
      material.composition === 'field' ? undefined : backgrounds[material.composition],
    backgroundSize:
      material.composition === 'grid' ? `${material.gridSize}px ${material.gridSize}px` : undefined,
    color: material.inkColor,
    fontFamily: typefaces[material.typeface],
  }
}
