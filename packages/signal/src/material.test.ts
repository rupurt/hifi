import { describe, expect, it } from 'vitest'
import { parseSignalMaterial, serializeSignalMaterial, signalThemeMaterials } from './material'

describe('signal materials', () => {
  it('round trips an emissive material as JSON', () => {
    const source = signalThemeMaterials.spectral

    expect(parseSignalMaterial(JSON.parse(serializeSignalMaterial(source)))).toEqual(source)
  })

  it('rejects unsupported waveforms', () => {
    expect(() =>
      parseSignalMaterial({ ...signalThemeMaterials.phosphor, waveform: 'pulse' }),
    ).toThrowError('Signal material has an unsupported waveform')
  })
})
