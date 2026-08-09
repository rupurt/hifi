# @hifi/signal

Programmable emissive interfaces for React. Signal materials govern luminance, bloom, focus, persistence, scan behavior, noise, waveform, and optional audio gain as portable JSON.

## Install

```sh
pnpm add @hifi/signal react
```

## Use a preset or generated material

```tsx
import { parseSignalMaterial, SignalSurface } from '@hifi/signal'
import materialJson from './signal-theme.json'

const material = parseSignalMaterial(materialJson)

export function Monitor() {
  return <SignalSurface material={material}>Channel live</SignalSurface>
}
```

Pass `theme="phosphor"`, `theme="matrix"`, `theme="spectral"`, or `theme="night"` to use a bundled signal profile. `getSignalMaterialStyle` exposes the same generated CSS properties for an existing component.

HDR and Web Audio are progressive enhancements. The package baseline remains legible in standard dynamic range and does not start audio without an explicit application-controlled interaction.

This package is ESM-only and supports Node.js 20 or newer.
