import {
  isFiniteMaterialNumber,
  isMaterialRecord,
  type ProgrammableMaterial,
  parseMaterialEnvelope,
  serializeMaterial,
} from '@hifi/core'
import type { LiquidThemeName } from './grammar'

export type LiquidSurfaceProfile = 'convex' | 'concave' | 'lip'

export interface LiquidColor {
  readonly a: number
  readonly b: number
  readonly g: number
  readonly r: number
}

/**
 * Portable optical settings for a Liquid surface.
 *
 * The discriminator and version make exported JSON safe to evolve and validate
 * before it is passed back to the renderer.
 */
export interface LiquidMaterial extends ProgrammableMaterial<'liquid', 1> {
  readonly bezelWidth: number
  readonly blur: number
  readonly cornerRadius: number
  readonly cornerSmoothing: number
  readonly contentDepth: number
  readonly contentIor: number
  readonly dispersion: number
  readonly displacementBlur: number
  readonly displacementFactor: number
  readonly ior: number
  readonly opacity: number
  readonly specularOpacity: number
  readonly specularSharpness: number
  readonly specularStrength: number
  readonly surfaceProfile: LiquidSurfaceProfile
  readonly thickness: number
  readonly tint: LiquidColor
}

export const liquidThemeMaterials: Readonly<Record<LiquidThemeName, LiquidMaterial>> = {
  clear: {
    bezelWidth: 28,
    blur: 6,
    cornerRadius: 34,
    cornerSmoothing: 0.42,
    contentDepth: 30,
    contentIor: 1.46,
    dispersion: 0.018,
    displacementBlur: 12,
    displacementFactor: 1,
    grammar: 'liquid',
    ior: 1.46,
    name: 'Clear glass',
    opacity: 0.72,
    specularOpacity: 0.68,
    specularSharpness: 2.8,
    specularStrength: 1,
    surfaceProfile: 'convex',
    thickness: 28,
    tint: { r: 0.82, g: 0.94, b: 1, a: 0.09 },
    version: 1,
  },
  tinted: {
    bezelWidth: 32,
    blur: 10,
    cornerRadius: 38,
    cornerSmoothing: 0.48,
    contentDepth: 34,
    contentIor: 1.5,
    dispersion: 0.022,
    displacementBlur: 14,
    displacementFactor: 1.15,
    grammar: 'liquid',
    ior: 1.5,
    name: 'Tinted glass',
    opacity: 0.82,
    specularOpacity: 0.72,
    specularSharpness: 2.6,
    specularStrength: 1.1,
    surfaceProfile: 'convex',
    thickness: 34,
    tint: { r: 0.58, g: 0.42, b: 1, a: 0.17 },
    version: 1,
  },
  frosted: {
    bezelWidth: 38,
    blur: 18,
    cornerRadius: 30,
    cornerSmoothing: 0.36,
    contentDepth: 38,
    contentIor: 1.42,
    dispersion: 0.014,
    displacementBlur: 18,
    displacementFactor: 0.78,
    grammar: 'liquid',
    ior: 1.42,
    name: 'Frosted glass',
    opacity: 0.9,
    specularOpacity: 0.56,
    specularSharpness: 3.2,
    specularStrength: 0.72,
    surfaceProfile: 'concave',
    thickness: 40,
    tint: { r: 0.92, g: 0.97, b: 1, a: 0.24 },
    version: 1,
  },
  blurred: {
    bezelWidth: 44,
    blur: 28,
    cornerRadius: 42,
    cornerSmoothing: 0.55,
    contentDepth: 44,
    contentIor: 1.38,
    dispersion: 0.01,
    displacementBlur: 22,
    displacementFactor: 0.62,
    grammar: 'liquid',
    ior: 1.38,
    name: 'Blurred glass',
    opacity: 0.78,
    specularOpacity: 0.48,
    specularSharpness: 3.6,
    specularStrength: 0.58,
    surfaceProfile: 'lip',
    thickness: 44,
    tint: { r: 0.35, g: 0.86, b: 0.83, a: 0.14 },
    version: 1,
  },
}

export function serializeLiquidMaterial(material: LiquidMaterial) {
  return serializeMaterial(material)
}

export function parseLiquidMaterial(value: unknown): LiquidMaterial {
  const material = parseMaterialEnvelope(value, 'liquid', 1)

  const profile = material.surfaceProfile
  if (profile !== 'convex' && profile !== 'concave' && profile !== 'lip') {
    throw new TypeError('Liquid material has an unsupported surface profile')
  }

  const numericKeys = [
    'bezelWidth',
    'blur',
    'cornerRadius',
    'cornerSmoothing',
    'contentDepth',
    'contentIor',
    'dispersion',
    'displacementBlur',
    'displacementFactor',
    'ior',
    'opacity',
    'specularOpacity',
    'specularSharpness',
    'specularStrength',
    'thickness',
  ] as const

  for (const key of numericKeys) {
    if (!isFiniteMaterialNumber(material[key])) {
      throw new TypeError(`Liquid material requires a finite ${key}`)
    }
  }

  if (!isMaterialRecord(material.tint)) {
    throw new TypeError('Liquid material requires an RGBA tint')
  }

  for (const channel of ['r', 'g', 'b', 'a'] as const) {
    if (!isFiniteMaterialNumber(material.tint[channel])) {
      throw new TypeError(`Liquid material requires a finite tint.${channel}`)
    }
  }

  return material as unknown as LiquidMaterial
}
