import { describe, expect, it } from 'vitest'
import { grammarSections } from './StyleguideNav'

describe('styleguide section contract', () => {
  it('covers the fourteen shared grammar sections', () => {
    expect(grammarSections.map(({ label }) => label)).toEqual([
      'Material',
      'Typography',
      'Color',
      'Spacing',
      'Layout',
      'Icons',
      'Buttons',
      'Forms',
      'Badges',
      'Cards',
      'Tables',
      'Lists',
      'Feedback',
      'Composition',
    ])
  })

  it('gives every section a unique link target', () => {
    const targets = grammarSections.map(({ id }) => id)

    expect(new Set(targets).size).toBe(grammarSections.length)
    expect(targets.every((target) => target.endsWith('-heading'))).toBe(true)
  })
})
