import { describe, expect, it } from 'vitest'
import { liquidGrammar } from './grammar'

describe('liquid grammar', () => {
  it('defines the initial material variants', () => {
    expect(liquidGrammar.themes.map((theme) => theme.name)).toEqual([
      'clear',
      'tinted',
      'frosted',
      'blurred',
    ])
  })
})
