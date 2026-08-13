import { fileURLToPath } from 'node:url'
import stylex from '@stylexjs/unplugin'
import { defineConfig } from 'vitest/config'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [stylex.rollup({ devMode: 'full', useCSSLayers: true })],
  resolve: {
    alias: {
      '@hifi/core': fromRoot('./packages/core/src/index.ts'),
      '@hifi/liquid/grammar': fromRoot('./packages/liquid/src/grammar.ts'),
      '@hifi/mosaic/grammar': fromRoot('./packages/mosaic/src/grammar.ts'),
      '@hifi/mosaic': fromRoot('./packages/mosaic/src/index.ts'),
      '@hifi/print/grammar': fromRoot('./packages/print/src/grammar.ts'),
      '@hifi/texture/grammar': fromRoot('./packages/texture/src/grammar.ts'),
    },
  },
  test: {
    include: ['apps/**/*.test.ts', 'packages/**/*.test.ts'],
  },
})
