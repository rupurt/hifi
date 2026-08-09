import { describe, expect, it } from 'vitest'
import { defineGrammar, getGrammarTheme, parseMaterialEnvelope, serializeMaterial } from './index'

describe('grammar contracts', () => {
  const grammar = defineGrammar({
    name: 'example',
    label: 'Example',
    description: 'An example grammar.',
    status: 'experimental',
    themes: [
      { name: 'first', label: 'First', description: 'The first theme.' },
      { name: 'second', label: 'Second', description: 'The second theme.' },
    ],
  })

  it('preserves literal grammar and theme names', () => {
    expect(grammar.name).toBe('example')
    expect(grammar.themes.map((theme) => theme.name)).toEqual(['first', 'second'])
  })

  it('resolves a requested theme and falls back to the first theme', () => {
    expect(getGrammarTheme(grammar, 'second').name).toBe('second')
    expect(getGrammarTheme(grammar, 'missing').name).toBe('first')
  })
})

describe('programmable material contracts', () => {
  const material = { grammar: 'example', name: 'Example material', roughness: 0.4, version: 1 }

  it('serializes and validates the common material envelope', () => {
    const parsed = parseMaterialEnvelope(JSON.parse(serializeMaterial(material)), 'example', 1)

    expect(parsed).toEqual(material)
  })

  it('rejects a material from another grammar', () => {
    expect(() => parseMaterialEnvelope(material, 'different', 1)).toThrowError(
      'Expected a version 1 @hifi/different material',
    )
  })
})
