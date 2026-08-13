# @hifi/mosaic

Programmable modular composition for React. Mosaic materials govern tile palettes, explicit text colors, joint geometry, cell scale, offset, relief, variation, and pattern as portable JSON.

## Install

```sh
pnpm add @hifi/mosaic react
```

## Compose readable tiles

```tsx
import { MosaicSurface, MosaicTile, mosaicThemeMaterials } from '@hifi/mosaic'

const material = mosaicThemeMaterials.modular

export function Dashboard() {
  return (
    <MosaicSurface material={material}>
      <MosaicTile material={material} span={2}>Current balance</MosaicTile>
      <MosaicTile material={material} tone="accent">Transfer</MosaicTile>
    </MosaicSurface>
  )
}
```

Pass `theme="modular"`, `theme="tessellated"`, `theme="stained"`, or `theme="pixel"` to use a bundled surface. Text-bearing `MosaicTile` variants use explicit foreground/background pairs; decorative pattern colors never determine content contrast.

This package is ESM-only and supports Node.js 20 or newer.
