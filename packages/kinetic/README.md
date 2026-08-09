# @hifi/kinetic

Programmable physical interaction for React. Kinetic materials govern mass, stiffness, damping, friction, travel, actuation, detents, and restitution as portable JSON.

## Install

```sh
pnpm add @hifi/kinetic react
```

## Use a mechanism

```tsx
import { KineticButton, parseKineticMaterial } from '@hifi/kinetic'
import materialJson from './kinetic-theme.json'

const material = parseKineticMaterial(materialJson)

export function LaunchControl() {
  return <KineticButton material={material}>Launch</KineticButton>
}
```

`KineticButton` remains a native button and preserves consumer event handlers while mapping the active material into travel, settling, and shadow response. `KineticSurface` and `getKineticMaterialStyle` apply the same mechanism to larger compositions.

Sound, vibration, and other physical feedback remain application-controlled progressive enhancements. Core meaning must remain available through visual state and native semantics.

This package is ESM-only and supports Node.js 20 or newer.
