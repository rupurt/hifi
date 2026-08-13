import {
  isFiniteMaterialNumber,
  type ProgrammableMaterial,
  parseMaterialEnvelope,
  serializeMaterial,
} from '@hifi/core'
import type { MosaicThemeName } from './grammar.js'

export type MosaicPattern = 'grid' | 'tessellation' | 'leadwork' | 'pixel'

export interface MosaicMaterial extends ProgrammableMaterial<'mosaic', 1> {
  readonly accentColor: string
  readonly accentTextColor: string
  readonly backgroundColor: string
  readonly cellSize: number
  readonly foregroundColor: string
  readonly jointColor: string
  readonly jointWidth: number
  readonly offset: number
  readonly pattern: MosaicPattern
  readonly radius: number
  readonly relief: number
  readonly secondaryColor: string
  readonly tileColor: string
  readonly tileTextColor: string
  readonly variation: number
}

export const mosaicThemeMaterials: Readonly<Record<MosaicThemeName, MosaicMaterial>> = {
  modular: {
    accentColor: '#c9362c',
    accentTextColor: '#ffffff',
    backgroundColor: '#f2ede2',
    cellSize: 44,
    foregroundColor: '#171815',
    grammar: 'mosaic',
    jointColor: '#171815',
    jointWidth: 3,
    name: 'Primary modular',
    offset: 0.35,
    pattern: 'grid',
    radius: 0,
    relief: 2,
    secondaryColor: '#f4c73d',
    tileColor: '#2057c9',
    tileTextColor: '#ffffff',
    variation: 0.42,
    version: 1,
  },
  tessellated: {
    accentColor: '#c94435',
    accentTextColor: '#ffffff',
    backgroundColor: '#eee6d4',
    cellSize: 54,
    foregroundColor: '#172119',
    grammar: 'mosaic',
    jointColor: '#172119',
    jointWidth: 2,
    name: 'Garden tessellation',
    offset: 0.68,
    pattern: 'tessellation',
    radius: 0,
    relief: 1,
    secondaryColor: '#e8ad35',
    tileColor: '#267153',
    tileTextColor: '#ffffff',
    variation: 0.58,
    version: 1,
  },
  stained: {
    accentColor: '#b72b5c',
    accentTextColor: '#ffffff',
    backgroundColor: '#151a2a',
    cellSize: 62,
    foregroundColor: '#fff5dc',
    grammar: 'mosaic',
    jointColor: '#0e0c12',
    jointWidth: 7,
    name: 'Nocturne leadwork',
    offset: 0.5,
    pattern: 'leadwork',
    radius: 9,
    relief: 4,
    secondaryColor: '#d89f24',
    tileColor: '#1753b8',
    tileTextColor: '#ffffff',
    variation: 0.76,
    version: 1,
  },
  pixel: {
    accentColor: '#e33e72',
    accentTextColor: '#080b1f',
    backgroundColor: '#e8efff',
    cellSize: 24,
    foregroundColor: '#11183b',
    grammar: 'mosaic',
    jointColor: '#11183b',
    jointWidth: 2,
    name: 'Electric pixel',
    offset: 1,
    pattern: 'pixel',
    radius: 0,
    relief: 0,
    secondaryColor: '#27bfa0',
    tileColor: '#6040d6',
    tileTextColor: '#ffffff',
    variation: 0.3,
    version: 1,
  },
}

export function serializeMosaicMaterial(material: MosaicMaterial) {
  return serializeMaterial(material)
}

export function parseMosaicMaterial(value: unknown): MosaicMaterial {
  const material = parseMaterialEnvelope(value, 'mosaic', 1)

  if (!isMosaicPattern(material.pattern)) {
    throw new TypeError('Mosaic material has an unsupported pattern')
  }

  for (const key of [
    'accentColor',
    'accentTextColor',
    'backgroundColor',
    'foregroundColor',
    'jointColor',
    'secondaryColor',
    'tileColor',
    'tileTextColor',
  ] as const) {
    if (typeof material[key] !== 'string' || material[key].length === 0) {
      throw new TypeError(`Mosaic material requires a ${key}`)
    }
  }

  for (const key of [
    'cellSize',
    'jointWidth',
    'offset',
    'radius',
    'relief',
    'variation',
  ] as const) {
    if (!isFiniteMaterialNumber(material[key])) {
      throw new TypeError(`Mosaic material requires a finite ${key}`)
    }
  }

  return material as unknown as MosaicMaterial
}

function isMosaicPattern(value: unknown): value is MosaicPattern {
  return value === 'grid' || value === 'tessellation' || value === 'leadwork' || value === 'pixel'
}
