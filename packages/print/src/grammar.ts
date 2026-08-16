import { defineGrammar } from '@hifi/core'

export const printGrammar = defineGrammar({
  name: 'print',
  label: 'Print',
  description: 'Editorial composition informed by ink, paper, rhythm, and typographic hierarchy.',
  status: 'planned',
  themes: [
    {
      name: 'broadsheet',
      label: 'Broadsheet',
      description: 'Stark monochrome columns with cinematic contrast.',
    },
    {
      name: 'magazine',
      label: 'Magazine',
      description: 'Expressive pacing and image-led hierarchy.',
    },
    {
      name: 'technical',
      label: 'Technical',
      description: 'Precise grids, notation, and restrained color.',
    },
    {
      name: 'poster',
      label: 'Poster',
      description: 'Large gestures with immediate visual hierarchy.',
    },
  ],
})

export type PrintThemeName = (typeof printGrammar.themes)[number]['name']
