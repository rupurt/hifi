import { describe, expect, it } from 'vitest'
import { printGrammar } from './grammar'

describe('print grammar', () => {
  it('describes editorial rather than material themes', () => {
    expect(printGrammar.status).toBe('planned')
    expect(printGrammar.themes.map((theme) => theme.name)).toContain('broadsheet')
  })
})
