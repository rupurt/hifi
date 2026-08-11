import { liquidGrammar } from '@hifi/liquid'
import { describe, expect, it } from 'vitest'
import { liquidFabrics } from './liquidFabrics'

describe('liquid route fabrics', () => {
  it('provides a distinct field for every liquid theme', () => {
    expect(Object.keys(liquidFabrics)).toEqual(liquidGrammar.themes.map((theme) => theme.name))
    expect(new Set(Object.values(liquidFabrics).map((fabric) => fabric.backgroundImage)).size).toBe(
      liquidGrammar.themes.length,
    )
  })
})
