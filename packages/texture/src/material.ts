import {
  isFiniteMaterialNumber,
  type ProgrammableMaterial,
  parseMaterialEnvelope,
  serializeMaterial,
} from '@hifi/core'
import type { TextureThemeName } from './grammar.js'

export type TexturePattern = 'fiber' | 'weave' | 'grain' | 'crosshatch'

export interface TextureMaterial extends ProgrammableMaterial<'texture', 1> {
  readonly accentColor: string
  readonly backgroundColor: string
  readonly borderRadius: number
  readonly foregroundColor: string
  readonly highlightColor: string
  readonly intensity: number
  readonly pattern: TexturePattern
  readonly scale: number
  readonly shadowDepth: number
  readonly textureColor: string
}

export const textureThemeMaterials: Readonly<Record<TextureThemeName, TextureMaterial>> = {
  paper: {
    accentColor: '#88462f',
    backgroundColor: '#e9dfca',
    borderRadius: 8,
    foregroundColor: '#352d23',
    grammar: 'texture',
    highlightColor: '#ffffff',
    intensity: 0.12,
    name: 'Warm paper',
    pattern: 'fiber',
    scale: 20,
    shadowDepth: 18,
    textureColor: '#513e28',
    version: 1,
  },
  canvas: {
    accentColor: '#76513a',
    backgroundColor: '#b9aa8b',
    borderRadius: 8,
    foregroundColor: '#332d25',
    grammar: 'texture',
    highlightColor: '#ffffff',
    intensity: 0.18,
    name: 'Natural canvas',
    pattern: 'weave',
    scale: 6,
    shadowDepth: 22,
    textureColor: '#2d261d',
    version: 1,
  },
  grain: {
    accentColor: '#e2a872',
    backgroundColor: '#30333a',
    borderRadius: 8,
    foregroundColor: '#f4f0e8',
    grammar: 'texture',
    highlightColor: '#ffffff',
    intensity: 0.16,
    name: 'Technical grain',
    pattern: 'grain',
    scale: 5,
    shadowDepth: 16,
    textureColor: '#ffffff',
    version: 1,
  },
  fabric: {
    accentColor: '#f1b780',
    backgroundColor: '#7e3151',
    borderRadius: 8,
    foregroundColor: '#fff8f2',
    grammar: 'texture',
    highlightColor: '#ffffff',
    intensity: 0.12,
    name: 'Berry fabric',
    pattern: 'crosshatch',
    scale: 5,
    shadowDepth: 24,
    textureColor: '#210711',
    version: 1,
  },
}

export function serializeTextureMaterial(material: TextureMaterial) {
  return serializeMaterial(material)
}

export function parseTextureMaterial(value: unknown): TextureMaterial {
  const material = parseMaterialEnvelope(value, 'texture', 1)
  const pattern = material.pattern

  if (
    pattern !== 'fiber' &&
    pattern !== 'weave' &&
    pattern !== 'grain' &&
    pattern !== 'crosshatch'
  ) {
    throw new TypeError('Texture material has an unsupported pattern')
  }

  for (const key of [
    'accentColor',
    'backgroundColor',
    'foregroundColor',
    'highlightColor',
    'textureColor',
  ] as const) {
    if (typeof material[key] !== 'string' || material[key].length === 0) {
      throw new TypeError(`Texture material requires a ${key}`)
    }
  }

  for (const key of ['borderRadius', 'intensity', 'scale', 'shadowDepth'] as const) {
    if (!isFiniteMaterialNumber(material[key])) {
      throw new TypeError(`Texture material requires a finite ${key}`)
    }
  }

  return material as unknown as TextureMaterial
}
