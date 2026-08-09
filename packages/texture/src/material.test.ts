import { describe, expect, it } from 'vitest'
import { parseTextureMaterial, serializeTextureMaterial, textureThemeMaterials } from './material'

describe('texture materials', () => {
  it('round trips a theme material as JSON', () => {
    const source = textureThemeMaterials.canvas

    expect(parseTextureMaterial(JSON.parse(serializeTextureMaterial(source)))).toEqual(source)
  })

  it('rejects unsupported texture patterns', () => {
    expect(() =>
      parseTextureMaterial({ ...textureThemeMaterials.paper, pattern: 'noise' }),
    ).toThrowError('Texture material has an unsupported pattern')
  })
})
