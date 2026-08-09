# hifi

High-fidelity grammars for multi-dimensional interfaces.

`hifi` is a TypeScript-first suite of React libraries for building interfaces with a strong and coherent visual language. Each language is packaged as a **grammar**: a set of primitives, components, tokens, motion, and interaction rules that work together as one material system.

The project is in its foundation phase. The first grammar is **liquid**, a glassmorphic system built with [liquid-dom](https://github.com/AndrewPrifer/liquid-dom).

## What is a grammar?

A theme changes values within a visual language. A grammar defines the language itself.

For example, a glass grammar and a print grammar differ in their treatment of depth, light, edges, texture, typography, motion, and interaction—not just in their color tokens. Each grammar should make those dimensions feel intentional across everything from a button to a complete application surface.

A grammar owns:

- design tokens and semantic variables;
- React primitives and composed components;
- layout, depth, motion, and interaction rules;
- one or more themes;
- accessibility behavior and reduced-effect fallbacks;
- examples, usage guidance, and tests.

Themes are variants inside a grammar. In `liquid`, themes might describe clear, tinted, blurred, frosted, or highly transparent glass while preserving the same underlying component vocabulary and behavior.

## Initial grammars

| Grammar | Language | Example themes | Status |
| --- | --- | --- | --- |
| `liquid` | Layered, refractive glass surfaces | clear, tinted, frosted, transparent | First priority |
| `texture` | Tactile and material-rich surfaces | paper, canvas, grain, fabric | Planned |
| `print` | Editorial composition inspired by physical print | broadsheet, magazine, technical, poster | Planned |

These are the starting points, not a closed set. A new grammar belongs in `hifi` when it offers a distinct, reusable visual language rather than a one-off component skin.

## Principles

- **Coherence over collection.** Components within a grammar should look, move, and respond as if they belong to the same world.
- **Fidelity is multi-dimensional.** Color, material, light, depth, typography, motion, sound, and interaction are parts of the same system.
- **Themes preserve the grammar.** A theme can tune the material without changing its fundamental rules or component API.
- **React APIs stay composable.** Consumers should be able to extend primitives without fighting hidden structure or state.
- **Accessibility is part of fidelity.** Keyboard behavior, contrast, reduced motion, reduced transparency, and non-GPU fallbacks are design inputs.
- **The styleguide is the specification.** Every public primitive, state, theme, and fallback should be observable there.

## Repository shape

`hifi` is a [Turborepo](https://turbo.build/repo) monorepo with [pnpm](https://pnpm.io/) workspaces.

```text
.
├── apps/
│   └── styleguide/          # TanStack Router development and showcase app
├── packages/
│   ├── core/                # Shared grammar contracts and utilities
│   ├── liquid/              # Glassmorphic React grammar
│   ├── texture/             # Textured React grammar
│   └── print/               # Print-inspired React grammar
├── tooling/                 # Shared TypeScript configuration
├── flake.nix                # Reproducible Node.js development shell
├── justfile                 # Developer task interface
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Grammar packages should expose React components, tokens, theme definitions, and public types from deliberate entry points. Shared code belongs in `core` only when it describes a capability common to multiple grammars; grammar-specific abstractions stay with their grammar.

## Styleguide

The sample application is both a development harness and the living specification for the packages. It uses [TanStack Router](https://tanstack.com/router) and builds to static assets in `apps/styleguide/dist`.

Each grammar owns an explicit route component, its own art direction, and its own theme-responsive control treatment. The routes share an accessible specimen taxonomy—commands, selection, native fields, choices, feedback, cards, lists, and tables—so the same interface vocabulary can be compared without forcing every grammar into the same page design.

Each grammar has a stable route:

```text
/styleguide/liquid
/styleguide/texture
/styleguide/print
```

The page at `/styleguide/{grammar}` should include:

- a theme switcher for that grammar;
- tokens and visual foundations;
- every public component and meaningful state;
- interaction, motion, and layering examples;
- accessibility and reduced-effect examples;
- implementation notes and copyable usage examples.

Theme selection is represented by the `theme` search parameter so that a specific variant can be shared without adding a separate route tree. Static deployments must support direct navigation to every grammar route, either by prerendering those routes or by providing an SPA fallback. The current build includes a Netlify-compatible `_redirects` file.

## Liquid

`liquid` is the first active grammar and will be the first one completed. It uses [`@liquid-dom/react`](https://github.com/AndrewPrifer/liquid-dom/tree/master/packages/react) to provide real-time liquid-glass rendering through a React API.

The upstream renderer currently targets React 19 and requires WebGPU for rendering. DOM content rendered into the glass canvas also relies on experimental browser support. The `liquid` styleguide should document the browser setup it expects and demonstrate an accessible fallback when GPU rendering or the required browser feature is unavailable.

The first themes should explore a useful range without fragmenting the API:

- `clear` — neutral, highly transparent glass;
- `tinted` — glass whose color participates in hierarchy and mood;
- `frosted` — diffuse glass with stronger separation from its background;
- `blurred` — soft, depth-forward glass with restrained refraction.

Theme names and parameters should describe material behavior rather than a single product or color palette.

## Development environment

The canonical development environment is a Nix flake. It provides Node.js 24, pnpm, and [`just`](https://github.com/casey/just); the flake and workspace lockfiles pin the complete toolchain.

With Nix and flakes enabled:

```sh
nix develop
just bootstrap
just dev
```

The development server listens on all interfaces at port `5713`. Open
`http://localhost:5713`, or use the machine's network hostname, such as
`http://kawasaki.local:5713`. All `*.local` hostnames are accepted.

## Developer tasks

The `justfile` is the supported entry point for routine work. It remains small and delegates workspace orchestration to Turbo.
Run `just` without arguments to print the available commands.

| Command | Purpose |
| --- | --- |
| `just bootstrap` | Install the pinned workspace dependencies |
| `just dev` | Run the styleguide and watched package builds |
| `just build` | Build all packages and the static styleguide |
| `just test` | Run the Vitest suite |
| `just typecheck` | Type-check every workspace package |
| `just lint` | Run repository lint checks |
| `just format` | Format supported source and configuration files |
| `just check` | Run the full local validation suite |

## Testing

[Vitest](https://vitest.dev/) is the default test runner for packages and applications. Tests should live near the behavior they protect and cover:

- public component contracts and composition;
- theme and token resolution;
- interaction and accessibility behavior;
- grammar registration and styleguide routing;
- graceful behavior when optional rendering capabilities are unavailable.

GPU rendering quality is difficult to establish with DOM-only unit tests. The initial Vitest suite should validate deterministic application behavior; browser smoke tests and visual regression coverage can be added as the visual contract stabilizes.

`just check` is the expected pre-push gate.

## Adding a grammar

Before a grammar is considered part of the suite, it should:

1. define its visual premise and the dimensions governed by that premise;
2. expose a typed React package with at least one complete theme;
3. register itself with the styleguide at `/styleguide/{grammar}`;
4. document its tokens, components, states, interactions, and fallbacks;
5. include Vitest coverage for its public contracts;
6. pass `just check` and produce a static styleguide build.

## Roadmap

- [x] Scaffold the Nix, pnpm, Turbo, TypeScript, React, TanStack Router, and Vitest foundation.
- [x] Define the initial shared grammar and theme contracts.
- [ ] Build out the `liquid` component vocabulary and mature its initial theme variants.
- [ ] Publish the static styleguide with reliable deep links.
- [ ] Establish complete `texture` and `print` grammars from the shared contracts.
- [ ] Add browser-level accessibility, rendering, and visual regression coverage.

## Status

`hifi` is experimental and its package APIs are not yet stable. The immediate goal is to prove the grammar model through `liquid`, then use that experience to refine the shared contracts before expanding the suite.
