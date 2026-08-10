import { describe, expect, it } from 'vitest'
import { liquidThemeMaterials, parseLiquidMaterial, serializeLiquidMaterial } from './material'

describe('liquid materials', () => {
  it('round trips the portable JSON representation', () => {
    const source = liquidThemeMaterials.tinted
    const parsed = parseLiquidMaterial(JSON.parse(serializeLiquidMaterial(source)))

    expect(parsed).toEqual(source)
  })

  it('keeps the extended spectrum optically distinct', () => {
    expect(liquidThemeMaterials.tinted.tint.a).toBeGreaterThan(
      liquidThemeMaterials.clear.tint.a * 3,
    )
    expect(liquidThemeMaterials.prismatic.dispersion).toBeGreaterThan(
      liquidThemeMaterials.tinted.dispersion,
    )
    expect(liquidThemeMaterials.prismatic.blur).toBeLessThan(liquidThemeMaterials.clear.blur)
    expect(liquidThemeMaterials.smoked.tint.a).toBeGreaterThan(
      liquidThemeMaterials.frosted.tint.a,
    )
  })

  it('rejects incompatible material versions', () => {
    expect(() => parseLiquidMaterial({ ...liquidThemeMaterials.clear, version: 2 })).toThrowError(
      'Expected a version 1 @hifi/liquid material',
    )
  })

  it('rejects incomplete optical values', () => {
    expect(() =>
      parseLiquidMaterial({ ...liquidThemeMaterials.clear, thickness: Number.NaN }),
    ).toThrowError('Liquid material requires a finite thickness')
  })
})
