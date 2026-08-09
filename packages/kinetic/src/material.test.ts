import { describe, expect, it } from 'vitest'
import { kineticThemeMaterials, parseKineticMaterial, serializeKineticMaterial } from './material'

describe('kinetic materials', () => {
  it('round trips a mechanism as JSON', () => {
    const source = kineticThemeMaterials.magnetic

    expect(parseKineticMaterial(JSON.parse(serializeKineticMaterial(source)))).toEqual(source)
  })

  it('rejects incomplete physical values', () => {
    expect(() =>
      parseKineticMaterial({ ...kineticThemeMaterials.precision, stiffness: Number.NaN }),
    ).toThrowError('Kinetic material requires a finite stiffness')
  })
})
