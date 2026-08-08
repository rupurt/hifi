import { defineGrammar } from '@hifi/core'

export const textureGrammar = defineGrammar({
  name: 'texture',
  label: 'Texture',
  description: 'Tactile, material-rich surfaces with visible grain and physical depth.',
  status: 'planned',
  themes: [
    { name: 'paper', label: 'Paper', description: 'Soft fibers and warm, toothy surfaces.' },
    { name: 'canvas', label: 'Canvas', description: 'A regular woven surface with subtle relief.' },
    { name: 'grain', label: 'Grain', description: 'Fine noise with a dense, technical feel.' },
    {
      name: 'fabric',
      label: 'Fabric',
      description: 'Soft woven material with directional texture.',
    },
  ],
})

export type TextureThemeName = (typeof textureGrammar.themes)[number]['name']
