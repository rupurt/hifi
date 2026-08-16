import { describe, expect, it } from 'vitest'
import { mosaicThemeMaterials, parseMosaicMaterial, serializeMosaicMaterial } from './material'

describe('mosaic materials', () => {
  it('round trips a modular material as JSON', () => {
    const source = mosaicThemeMaterials.stained

    expect(parseMosaicMaterial(JSON.parse(serializeMosaicMaterial(source)))).toEqual(source)
  })

  it('rejects unsupported patterns', () => {
    expect(() =>
      parseMosaicMaterial({ ...mosaicThemeMaterials.modular, pattern: 'random' }),
    ).toThrowError('Mosaic material has an unsupported pattern')
  })

  it.each(['seed', 'tempo', 'lightAngle', 'perturbation', 'edgeSegments'] as const)(
    'rejects a non-finite %s',
    (key) => {
      expect(() =>
        parseMosaicMaterial({ ...mosaicThemeMaterials.tessellated, [key]: Number.NaN }),
      ).toThrowError(`Mosaic material requires a finite ${key}`)
    },
  )

  it('keeps every preset text pair at WCAG AA contrast', () => {
    for (const material of Object.values(mosaicThemeMaterials)) {
      expect(
        contrast(material.backgroundColor, material.foregroundColor),
        material.name,
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrast(material.tileColor, material.tileTextColor),
        material.name,
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrast(material.accentColor, material.accentTextColor),
        material.name,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })
})

function contrast(first: string, second: string) {
  const light = Math.max(luminance(first), luminance(second))
  const dark = Math.min(luminance(first), luminance(second))
  return (light + 0.05) / (dark + 0.05)
}

function luminance(color: string) {
  const channels = color
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))

  if (channels?.length !== 3) throw new TypeError(`Expected a six-digit hex color: ${color}`)
  const [red = 0, green = 0, blue = 0] = channels
  return red * 0.2126 + green * 0.7152 + blue * 0.0722
}
