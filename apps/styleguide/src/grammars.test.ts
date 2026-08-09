import { describe, expect, it } from 'vitest'
import { grammarNames, grammarRegistry, isGrammarName } from './grammars'

describe('styleguide grammar registry', () => {
  it('registers the five foundational grammar routes', () => {
    expect(grammarNames).toEqual(['liquid', 'texture', 'print', 'signal', 'kinetic'])
  })

  it('recognizes registered names without accepting arbitrary paths', () => {
    expect(isGrammarName('liquid')).toBe(true)
    expect(isGrammarName('unknown')).toBe(false)
    expect(grammarRegistry.liquid.status).toBe('active')
  })
})
