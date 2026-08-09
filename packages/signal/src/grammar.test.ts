import { describe, expect, it } from 'vitest'
import { signalGrammar } from './grammar'

describe('signal grammar', () => {
  it('defines four emitted-information themes', () => {
    expect(signalGrammar.status).toBe('experimental')
    expect(signalGrammar.themes.map((theme) => theme.name)).toEqual([
      'phosphor',
      'matrix',
      'spectral',
      'night',
    ])
  })
})
