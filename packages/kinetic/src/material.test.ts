import { describe, expect, it } from 'vitest'
import { getKineticMaterialStyle } from './KineticSurface'
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

  it('derives cast shadows from the housing rather than the foreground', () => {
    const style = getKineticMaterialStyle({
      ...kineticThemeMaterials.viscous,
      backgroundColor: '#101614',
      foregroundColor: '#f4f1e8',
    }) as Record<string, string>

    expect(style['--kinetic-shadow-color']).toBe('color-mix(in srgb, #101614 38%, black)')
    expect(style.boxShadow).not.toContain('#f4f1e8')
  })
})
