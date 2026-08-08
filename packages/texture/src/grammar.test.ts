import { describe, expect, it } from 'vitest'
import { textureGrammar } from './grammar'

describe('texture grammar', () => {
  it('starts as a planned grammar with tangible theme names', () => {
    expect(textureGrammar.status).toBe('planned')
    expect(textureGrammar.themes.map((theme) => theme.name)).toContain('paper')
  })
})
