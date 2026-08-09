import { describe, expect, it } from 'vitest'
import { parsePrintMaterial, printThemeMaterials, serializePrintMaterial } from './material'

describe('print materials', () => {
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
