import { describe, expect, it } from 'vitest'
import { parsePrintMaterial, printThemeMaterials, serializePrintMaterial } from './material'

describe('print materials', () => {
  it('uses a high-contrast monochrome palette for the broadsheet theme', () => {
    expect(printThemeMaterials.broadsheet).toMatchObject({
      accentColor: '#080808',
      inkColor: '#080808',
      paperColor: '#fafafa',
    })
  })

  it('round trips a theme material as JSON', () => {
    const source = printThemeMaterials.technical

    expect(parsePrintMaterial(JSON.parse(serializePrintMaterial(source)))).toEqual(source)
  })

  it('rejects unsupported compositions', () => {
    expect(() =>
      parsePrintMaterial({ ...printThemeMaterials.broadsheet, composition: 'stack' }),
    ).toThrowError('Print material has an unsupported composition')
  })
})
