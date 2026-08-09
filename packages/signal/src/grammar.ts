import { defineGrammar } from '@hifi/core'

export const signalGrammar = defineGrammar({
  name: 'signal',
  label: 'Signal',
  description: 'Information emitted through luminance, frequency, persistence, and time.',
  status: 'experimental',
  themes: [
    {
      name: 'phosphor',
      label: 'Phosphor',
      description: 'Focused monochrome traces with a persistent afterimage.',
    },
    {
      name: 'matrix',
      label: 'Matrix',
      description: 'Discrete illuminated cells with quantized brightness.',
    },
    {
      name: 'spectral',
      label: 'Spectral',
      description: 'Wide-gamut analytical color with frequency separation.',
    },
    {
      name: 'night',
      label: 'Night',
      description: 'Low-luminance instrumentation with restrained bloom.',
    },
  ],
})

export type SignalThemeName = (typeof signalGrammar.themes)[number]['name']
