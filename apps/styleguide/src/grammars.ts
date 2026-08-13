import type { GrammarDefinition } from '@hifi/core'
import { kineticGrammar } from '@hifi/kinetic/grammar'
import { liquidGrammar } from '@hifi/liquid/grammar'
import { mosaicGrammar } from '@hifi/mosaic/grammar'
import { printGrammar } from '@hifi/print/grammar'
import { textureGrammar } from '@hifi/texture/grammar'

export const grammarRegistry = {
  liquid: liquidGrammar,
  texture: textureGrammar,
  print: printGrammar,
  mosaic: mosaicGrammar,
  kinetic: kineticGrammar,
} as const satisfies Record<string, GrammarDefinition>

export type GrammarName = keyof typeof grammarRegistry

export const grammarNames = Object.keys(grammarRegistry) as GrammarName[]

export function isGrammarName(value: string): value is GrammarName {
  return value in grammarRegistry
}
