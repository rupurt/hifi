import { describe, expect, it } from 'vitest'
import { mosaicGrammar } from './grammar'

describe('mosaic grammar', () => {
  it('defines four modular-composition themes', () => {
    expect(mosaicGrammar.status).toBe('experimental')
    expect(mosaicGrammar.themes.map((theme) => theme.name)).toEqual([
      'modular',
      'tessellated',
      'stained',
      'pixel',
    ])
  })
})
