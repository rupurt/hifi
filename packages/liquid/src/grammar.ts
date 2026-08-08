import { defineGrammar } from '@hifi/core'

export const liquidGrammar = defineGrammar({
  name: 'liquid',
  label: 'Liquid',
  description: 'Layered, refractive glass surfaces shaped by light, depth, and motion.',
  status: 'active',
  themes: [
    {
      name: 'clear',
      label: 'Clear',
      description: 'Neutral, highly transparent glass with crisp highlights.',
    },
    {
      name: 'tinted',
      label: 'Tinted',
      description: 'Colored glass that participates in hierarchy and mood.',
    },
    {
      name: 'frosted',
      label: 'Frosted',
      description: 'Diffuse glass with stronger separation from its background.',
    },
    {
      name: 'blurred',
      label: 'Blurred',
      description: 'Soft, depth-forward glass with restrained refraction.',
    },
  ],
})

export type LiquidThemeName = (typeof liquidGrammar.themes)[number]['name']
