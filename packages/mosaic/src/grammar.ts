import { defineGrammar } from '@hifi/core'

export const mosaicGrammar = defineGrammar({
  name: 'mosaic',
  label: 'Mosaic',
  description: 'Bold information composed through tiles, adjacency, rhythm, and negative space.',
  status: 'experimental',
  themes: [
    {
      name: 'modular',
      label: 'Modular',
      description: 'A rational grid of high-contrast blocks with deliberate asymmetry.',
    },
    {
      name: 'tessellated',
      label: 'Tessellated',
      description: 'Interlocking geometry that carries hierarchy through direction and fit.',
    },
    {
      name: 'stained',
      label: 'Stained',
      description: 'Deep joints and saturated panes held together by luminous contrast.',
    },
    {
      name: 'pixel',
      label: 'Pixel',
      description: 'Chunky digital cells with compact rhythm and hard, readable edges.',
    },
  ],
})

export type MosaicThemeName = (typeof mosaicGrammar.themes)[number]['name']
