import stylex from '@stylexjs/unplugin'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const fromStyleguide = (path: string) => new URL(path, import.meta.url).pathname

function stylexCssTarget(): Plugin {
  const resolvedId = '\0virtual:hifi-stylex.css'

  return {
    name: 'hifi-stylex-css-target',
    resolveId(id) {
      return id === 'virtual:hifi-stylex.css' ? resolvedId : undefined
    },
    load(id) {
      return id === resolvedId ? '' : undefined
    },
  }
}

export default defineConfig({
  plugins: [stylex.vite({ devMode: 'full', useCSSLayers: true }), stylexCssTarget(), react()],
  resolve: {
    alias: [
      {
        find: '@hifi/kinetic/grammar',
        replacement: fromStyleguide('../../packages/kinetic/src/grammar.ts'),
      },
      {
        find: '@hifi/liquid/grammar',
        replacement: fromStyleguide('../../packages/liquid/src/grammar.ts'),
      },
      {
        find: '@hifi/print/grammar',
        replacement: fromStyleguide('../../packages/print/src/grammar.ts'),
      },
      {
        find: '@hifi/signal/grammar',
        replacement: fromStyleguide('../../packages/signal/src/grammar.ts'),
      },
      {
        find: '@hifi/texture/grammar',
        replacement: fromStyleguide('../../packages/texture/src/grammar.ts'),
      },
      { find: '@hifi/core', replacement: fromStyleguide('../../packages/core/src/index.ts') },
      { find: '@hifi/kinetic', replacement: fromStyleguide('../../packages/kinetic/src/index.ts') },
      { find: '@hifi/liquid', replacement: fromStyleguide('../../packages/liquid/src/index.ts') },
      { find: '@hifi/print', replacement: fromStyleguide('../../packages/print/src/index.ts') },
      { find: '@hifi/signal', replacement: fromStyleguide('../../packages/signal/src/index.ts') },
      { find: '@hifi/texture', replacement: fromStyleguide('../../packages/texture/src/index.ts') },
    ],
  },
  server: {
    allowedHosts: ['.local'],
    host: true,
    port: 5713,
    strictPort: true,
  },
})
