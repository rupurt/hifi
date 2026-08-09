import { describe, expect, it } from 'vitest'
import { kineticGrammar } from './grammar'

describe('kinetic grammar', () => {
  it('defines four causal mechanism themes', () => {
    expect(kineticGrammar.status).toBe('experimental')
    expect(kineticGrammar.themes.map((theme) => theme.name)).toEqual([
      'precision',
      'sprung',
      'magnetic',
      'viscous',
    ])
  })
})
