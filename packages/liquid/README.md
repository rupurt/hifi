# @hifi/liquid

Programmable liquid-glass surfaces for React, rendered with [`@liquid-dom/react`](https://github.com/AndrewPrifer/liquid-dom) when its WebGPU requirements are available and with an accessible CSS fallback otherwise.

## Install

```sh
pnpm add @hifi/liquid react react-dom
```

React 19 is required by the liquid-dom renderer.

Preset themes cover `clear`, `tinted`, `frosted`, `prismatic`, `blurred`, and `smoked` glass.

## Use a preset

```tsx
import { LiquidSurface } from '@hifi/liquid'

export function Panel() {
  return <LiquidSurface theme="clear">Refracted content</LiquidSurface>
}
```

## Use an exported material

```tsx
import { LiquidSurface, parseLiquidMaterial } from '@hifi/liquid'
import materialJson from './liquid-theme.json'

const material = parseLiquidMaterial(materialJson)

export function Panel() {
  return <LiquidSurface material={material}>Calibrated surface</LiquidSurface>
}
```

The package exports its grammar definition, theme names, material presets, parser, serializer, renderer capability check, and `LiquidSurface`. It is ESM-only and supports Node.js 20 or newer.
