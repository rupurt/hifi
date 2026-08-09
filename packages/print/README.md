# @hifi/print

Programmable editorial surfaces for React. Print materials combine paper, ink, type, composition, grid, rules, casing, and physical shadow behavior.

## Install

```sh
pnpm add @hifi/print react
```

## Use a preset or material

```tsx
import { parsePrintMaterial, PrintSurface } from '@hifi/print'
import materialJson from './print-theme.json'

const material = parsePrintMaterial(materialJson)

export function Story() {
  return <PrintSurface material={material}>Editorial content</PrintSurface>
}
```

Pass `theme="broadsheet"`, `theme="magazine"`, `theme="technical"`, or `theme="poster"` instead to use a bundled edition. `getPrintMaterialStyle` exposes the generated CSS properties for integration with an existing component.

This package is ESM-only and supports Node.js 20 or newer.
