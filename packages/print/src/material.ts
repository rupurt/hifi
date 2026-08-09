import {
  isFiniteMaterialNumber,
  type ProgrammableMaterial,
  parseMaterialEnvelope,
  serializeMaterial,
} from '@hifi/core'
import type { PrintThemeName } from './grammar.js'

export type PrintComposition = 'columns' | 'split' | 'grid' | 'field'
export type PrintTypeface = 'serif' | 'sans' | 'mono' | 'display'

export interface PrintMaterial extends ProgrammableMaterial<'print', 1> {
  readonly accentColor: string
  readonly composition: PrintComposition
  readonly gridSize: number
  readonly inkColor: string
  readonly paperColor: string
  readonly ruleWeight: number
  readonly shadowOffset: number
  readonly typeface: PrintTypeface
  readonly uppercase: boolean
}

export const printThemeMaterials: Readonly<Record<PrintThemeName, PrintMaterial>> = {
  broadsheet: {
    accentColor: '#8c2e24',
    composition: 'columns',
    grammar: 'print',
    gridSize: 28,
    inkColor: '#181713',
    name: 'Daily broadsheet',
    paperColor: '#eee9dd',
    ruleWeight: 1,
    shadowOffset: 8,
    typeface: 'serif',
    uppercase: false,
    version: 1,
  },
  magazine: {
    accentColor: '#f34b39',
    composition: 'split',
    grammar: 'print',
    gridSize: 32,
    inkColor: '#171515',
    name: 'Feature magazine',
    paperColor: '#f2e7d3',
    ruleWeight: 2,
    shadowOffset: 10,
    typeface: 'sans',
    uppercase: false,
    version: 1,
  },
  technical: {
    accentColor: '#19364a',
    composition: 'grid',
    grammar: 'print',
    gridSize: 20,
    inkColor: '#19364a',
    name: 'Technical sheet',
    paperColor: '#f0eee7',
    ruleWeight: 1,
    shadowOffset: 6,
    typeface: 'mono',
    uppercase: false,
    version: 1,
  },
  poster: {
    accentColor: '#e94424',
    composition: 'field',
    grammar: 'print',
    gridSize: 40,
    inkColor: '#201e18',
    name: 'Display poster',
    paperColor: '#f4c62d',
    ruleWeight: 4,
    shadowOffset: 12,
    typeface: 'display',
    uppercase: true,
    version: 1,
  },
}

export function serializePrintMaterial(material: PrintMaterial) {
  return serializeMaterial(material)
}

export function parsePrintMaterial(value: unknown): PrintMaterial {
  const material = parseMaterialEnvelope(value, 'print', 1)
  const composition = material.composition
  const typeface = material.typeface

  if (
    composition !== 'columns' &&
    composition !== 'split' &&
    composition !== 'grid' &&
    composition !== 'field'
  ) {
    throw new TypeError('Print material has an unsupported composition')
  }

  if (
    typeface !== 'serif' &&
    typeface !== 'sans' &&
    typeface !== 'mono' &&
    typeface !== 'display'
  ) {
    throw new TypeError('Print material has an unsupported typeface')
  }

  for (const key of ['accentColor', 'inkColor', 'paperColor'] as const) {
    if (typeof material[key] !== 'string' || material[key].length === 0) {
      throw new TypeError(`Print material requires an ${key}`)
    }
  }

  for (const key of ['gridSize', 'ruleWeight', 'shadowOffset'] as const) {
    if (!isFiniteMaterialNumber(material[key])) {
      throw new TypeError(`Print material requires a finite ${key}`)
    }
  }

  if (typeof material.uppercase !== 'boolean') {
    throw new TypeError('Print material requires an uppercase setting')
  }

  return material as unknown as PrintMaterial
}
