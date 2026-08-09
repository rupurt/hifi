# @hifi/texture

Programmable tactile surfaces for React. Texture materials describe substrate, ink, fibers, scale, relief, pattern, and geometry as portable JSON.

## Install

```sh
pnpm add @hifi/texture react
```

## Use a preset or material

```tsx
import {
  parseTextureMaterial,
  TextureSurface,
} from '@hifi/texture'
import materialJson from './texture-theme.json'

const material = parseTextureMaterial(materialJson)

export function Card() {
  return <TextureSurface material={material}>Tactile content</TextureSurface>
}
```

Pass `theme="paper"`, `theme="canvas"`, `theme="grain"`, or `theme="fabric"` instead to start from a bundled preset. `getTextureMaterialStyle` exposes the same generated CSS properties for integration with an existing component.

This package is ESM-only and supports Node.js 20 or newer.
