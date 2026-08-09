# @hifi/core

Shared TypeScript contracts for defining hifi grammars and exchanging programmable material data. This package has no React dependency.

## Install

```sh
pnpm add @hifi/core
```

## Define a grammar

```ts
import { defineGrammar, getGrammarTheme } from '@hifi/core'

const grammar = defineGrammar({
  name: 'example',
  label: 'Example',
  description: 'An application-specific design language.',
  status: 'experimental',
  themes: [
    {
      name: 'default',
      label: 'Default',
      description: 'The default expression.',
    },
  ],
})

const theme = getGrammarTheme(grammar, 'default')
```

Material helpers validate the shared `grammar`, `name`, and `version` envelope used by `@hifi/liquid`, `@hifi/texture`, and `@hifi/print`.

This package is ESM-only and supports Node.js 20 or newer.
