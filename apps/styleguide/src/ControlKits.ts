import type { KineticMaterial } from '@hifi/kinetic'
import type { LiquidMaterial } from '@hifi/liquid'
import type { MosaicMaterial } from '@hifi/mosaic'
import type { PrintMaterial } from '@hifi/print'
import type { TextureMaterial } from '@hifi/texture'
import { useMemo, type InputHTMLAttributes, type ReactNode } from 'react'
import { createKineticControlKit } from './KineticControlKit'
import { createLiquidControlKit } from './LiquidControlKit'
import { createMosaicControlKit } from './MosaicControlKit'
import { createPrintControlKit } from './PrintControlKit'
import { createTextureControlKit } from './TextureControlKit'

export interface ReviewRow {
  readonly bound: string
  readonly detail: string
  readonly id: string
  readonly operation: string
  readonly rationale: string
  readonly state: 'ready' | 'review'
  readonly subject: string
}

export const reviewRows: readonly ReviewRow[] = [
  {
    bound: '6 columns · 3 records',
    detail: 'Native row + column semantics',
    id: 'alignment-surface',
    operation: 'VERIFY',
    rationale: 'Dense evidence remains attached to an explicit subject and heading.',
    state: 'ready',
    subject: 'Alignment surface',
  },
  {
    bound: '1040 px minimum',
    detail: 'One bounded horizontal axis',
    id: 'viewport-continuity',
    operation: 'PRESERVE',
    rationale: 'Narrow viewports scroll the relation instead of changing its meaning.',
    state: 'review',
    subject: 'Viewport continuity',
  },
  {
    bound: '0 implied records',
    detail: 'Full-span declared result',
    id: 'empty-evidence',
    operation: 'DECLARE',
    rationale: 'An empty relation communicates its boundary instead of rendering silence.',
    state: 'ready',
    subject: 'Empty evidence',
  },
]

export interface RangeKitProps {
  readonly value: number
  readonly onChange: (value: number) => void
}

export interface ChoiceKitProps {
  readonly inputProps: InputHTMLAttributes<HTMLInputElement>
  readonly type: 'checkbox' | 'radio'
}

export interface TableKitProps {
  readonly rows: readonly ReviewRow[]
}

export interface GrammarControlKit {
  renderChoice?(props: ChoiceKitProps): ReactNode
  renderRange?(props: RangeKitProps): ReactNode
  renderTable?(props: TableKitProps): ReactNode
}

export type AnyControlMaterial =
  | KineticMaterial
  | LiquidMaterial
  | MosaicMaterial
  | PrintMaterial
  | TextureMaterial

type ControlKitFactory<Material extends AnyControlMaterial> = (
  material: Material,
) => GrammarControlKit

const factories: {
  [Grammar in AnyControlMaterial['grammar']]?: ControlKitFactory<
    Extract<AnyControlMaterial, { grammar: Grammar }>
  >
} = {
  kinetic: createKineticControlKit,
  liquid: createLiquidControlKit,
  mosaic: createMosaicControlKit,
  print: createPrintControlKit,
  texture: createTextureControlKit,
}

export function useControlKit(
  material: AnyControlMaterial | undefined,
): GrammarControlKit | undefined {
  return useMemo(() => {
    if (!material) return undefined
    const factory = factories[material.grammar] as ControlKitFactory<typeof material> | undefined
    return factory?.(material)
  }, [material])
}
