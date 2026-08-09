import {
  isFiniteMaterialNumber,
  type ProgrammableMaterial,
  parseMaterialEnvelope,
  serializeMaterial,
} from '@hifi/core'
import type { SignalThemeName } from './grammar.js'

export type SignalMode = 'trace' | 'matrix' | 'spectrum' | 'lowlight'
export type SignalWaveform = 'sine' | 'square' | 'sawtooth' | 'triangle'

export interface SignalMaterial extends ProgrammableMaterial<'signal', 1> {
  readonly audioGain: number
  readonly backgroundColor: string
  readonly bloom: number
  readonly decay: number
  readonly emissionColor: string
  readonly focus: number
  readonly gridSize: number
  readonly intensity: number
  readonly mode: SignalMode
  readonly noise: number
  readonly scanRate: number
  readonly secondaryColor: string
  readonly traceWidth: number
  readonly waveform: SignalWaveform
}

export const signalThemeMaterials: Readonly<Record<SignalThemeName, SignalMaterial>> = {
  phosphor: {
    audioGain: 0.018,
    backgroundColor: '#03110b',
    bloom: 18,
    decay: 1.4,
    emissionColor: '#8dffb3',
    focus: 0.82,
    grammar: 'signal',
    gridSize: 24,
    intensity: 0.86,
    mode: 'trace',
    name: 'Green phosphor',
    noise: 0.08,
    scanRate: 24,
    secondaryColor: '#d8ffe3',
    traceWidth: 2,
    version: 1,
    waveform: 'sine',
  },
  matrix: {
    audioGain: 0.012,
    backgroundColor: '#070b0d',
    bloom: 10,
    decay: 0.32,
    emissionColor: '#ffb84d',
    focus: 0.96,
    grammar: 'signal',
    gridSize: 12,
    intensity: 0.78,
    mode: 'matrix',
    name: 'Amber matrix',
    noise: 0.02,
    scanRate: 12,
    secondaryColor: '#fff0ba',
    traceWidth: 4,
    version: 1,
    waveform: 'square',
  },
  spectral: {
    audioGain: 0.02,
    backgroundColor: '#07071a',
    bloom: 26,
    decay: 0.72,
    emissionColor: '#6cecff',
    focus: 0.7,
    grammar: 'signal',
    gridSize: 20,
    intensity: 0.94,
    mode: 'spectrum',
    name: 'Spectral field',
    noise: 0.05,
    scanRate: 48,
    secondaryColor: '#ff5fd1',
    traceWidth: 3,
    version: 1,
    waveform: 'sawtooth',
  },
  night: {
    audioGain: 0.008,
    backgroundColor: '#05090f',
    bloom: 7,
    decay: 0.94,
    emissionColor: '#ef5b4c',
    focus: 0.9,
    grammar: 'signal',
    gridSize: 32,
    intensity: 0.52,
    mode: 'lowlight',
    name: 'Night instrument',
    noise: 0.03,
    scanRate: 18,
    secondaryColor: '#ffd5a0',
    traceWidth: 1.5,
    version: 1,
    waveform: 'triangle',
  },
}

export function serializeSignalMaterial(material: SignalMaterial) {
  return serializeMaterial(material)
}

export function parseSignalMaterial(value: unknown): SignalMaterial {
  const material = parseMaterialEnvelope(value, 'signal', 1)

  if (!isSignalMode(material.mode)) {
    throw new TypeError('Signal material has an unsupported mode')
  }

  if (!isSignalWaveform(material.waveform)) {
    throw new TypeError('Signal material has an unsupported waveform')
  }

  for (const key of ['backgroundColor', 'emissionColor', 'secondaryColor'] as const) {
    if (typeof material[key] !== 'string' || material[key].length === 0) {
      throw new TypeError(`Signal material requires a ${key}`)
    }
  }

  for (const key of [
    'audioGain',
    'bloom',
    'decay',
    'focus',
    'gridSize',
    'intensity',
    'noise',
    'scanRate',
    'traceWidth',
  ] as const) {
    if (!isFiniteMaterialNumber(material[key])) {
      throw new TypeError(`Signal material requires a finite ${key}`)
    }
  }

  return material as unknown as SignalMaterial
}

function isSignalMode(value: unknown): value is SignalMode {
  return value === 'trace' || value === 'matrix' || value === 'spectrum' || value === 'lowlight'
}

function isSignalWaveform(value: unknown): value is SignalWaveform {
  return value === 'sine' || value === 'square' || value === 'sawtooth' || value === 'triangle'
}
