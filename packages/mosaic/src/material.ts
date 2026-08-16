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
  /** Minimum tile edge (px) the treemap floors every tile to, so tiny weights never sliver. */
  readonly cellSize: number
  /** Extra seeded vertices per interior shared edge (1-4). */
  readonly edgeSegments: number
  readonly foregroundColor: string
  readonly jointColor: string
  /** The real grout gap width — every tile erodes toward its own centroid by half of this. */
  readonly jointWidth: number
  /** Simulated light azimuth in degrees, drives the bevel highlight/shadow direction. */
  readonly lightAngle: number
  readonly pattern: MosaicPattern
  /** Seeded edge-displacement amplitude, as a fraction of each interior edge's length. */
  readonly perturbation: number
  /** Corner chamfer length in px, cut at interior corners only. */
  readonly radius: number
  readonly relief: number
  readonly secondaryColor: string
  /** Seeds the deterministic geometry — same seed always produces the same tile silhouettes. */
  readonly seed: number
  readonly tileColor: string
  readonly tileTextColor: string
  /** Base pace (ms) for the settle-in stagger and duration. */
  readonly tempo: number
}

export const mosaicThemeMaterials: Readonly<Record<MosaicThemeName, MosaicMaterial>> = {
  modular: {
    accentColor: '#c9362c',
    accentTextColor: '#ffffff',
    backgroundColor: '#f2ede2',
    cellSize: 44,
    edgeSegments: 1,
    foregroundColor: '#171815',
    grammar: 'mosaic',
    jointColor: '#171815',
    jointWidth: 3,
    lightAngle: 125,
    name: 'Primary modular',
    pattern: 'grid',
    perturbation: 0,
    radius: 0,
    relief: 2,
    secondaryColor: '#f4c73d',
    seed: 1,
    tempo: 70,
    tileColor: '#2057c9',
    tileTextColor: '#ffffff',
    version: 1,
  },
  tessellated: {
    accentColor: '#c94435',
    accentTextColor: '#ffffff',
    backgroundColor: '#eee6d4',
    cellSize: 54,
    edgeSegments: 2,
    foregroundColor: '#172119',
    grammar: 'mosaic',
    jointColor: '#172119',
    jointWidth: 2,
    lightAngle: 140,
    name: 'Garden tessellation',
    pattern: 'tessellation',
    perturbation: 0.55,
    radius: 10,
    relief: 1,
    secondaryColor: '#e8ad35',
    seed: 7,
    tempo: 110,
    tileColor: '#267153',
    tileTextColor: '#ffffff',
    version: 1,
  },
  stained: {
    accentColor: '#b72b5c',
    accentTextColor: '#ffffff',
    backgroundColor: '#151a2a',
    cellSize: 62,
    edgeSegments: 3,
    foregroundColor: '#fff5dc',
    grammar: 'mosaic',
    jointColor: '#0e0c12',
    jointWidth: 7,
    lightAngle: 200,
    name: 'Nocturne leadwork',
    pattern: 'leadwork',
    perturbation: 0.7,
    radius: 6,
    relief: 4,
    secondaryColor: '#d89f24',
    seed: 42,
    tempo: 140,
    tileColor: '#1753b8',
    tileTextColor: '#ffffff',
    version: 1,
  },
  pixel: {
    accentColor: '#e33e72',
    accentTextColor: '#080b1f',
    backgroundColor: '#e8efff',
    cellSize: 24,
    edgeSegments: 1,
    foregroundColor: '#11183b',
    grammar: 'mosaic',
    jointColor: '#11183b',
    jointWidth: 2,
    lightAngle: 90,
    name: 'Electric pixel',
    pattern: 'pixel',
    perturbation: 0.25,
    radius: 0,
    relief: 0,
    secondaryColor: '#27bfa0',
    seed: 99,
    tempo: 40,
    tileColor: '#6040d6',
    tileTextColor: '#ffffff',
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
    'edgeSegments',
    'jointWidth',
    'lightAngle',
    'perturbation',
    'radius',
    'relief',
    'seed',
    'tempo',
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
