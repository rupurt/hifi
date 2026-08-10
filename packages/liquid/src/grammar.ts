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
      description: 'Amethyst glass that recolors the spectrum passing through it.',
    },
    {
      name: 'frosted',
      label: 'Frosted',
      description: 'Diffuse glass with stronger separation from its background.',
    },
    {
      name: 'prismatic',
      label: 'Frozen',
      description: 'Crisp glass that holds a separated spectrum inside its edge.',
    },
    {
      name: 'blurred',
      label: 'Blurred',
      description: 'Soft, depth-forward glass with restrained refraction.',
    },
    {
      name: 'smoked',
      label: 'Smoked',
      description: 'Dark absorptive glass with reduced transmission and a hard specular edge.',
    },
  ],
})

export type LiquidThemeName = (typeof liquidGrammar.themes)[number]['name']
