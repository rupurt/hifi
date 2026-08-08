import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const fromStyleguide = (path: string) => new URL(path, import.meta.url).pathname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@hifi/liquid/grammar',
        replacement: fromStyleguide('../../packages/liquid/src/grammar.ts'),
      },
      {
        find: '@hifi/print/grammar',
        replacement: fromStyleguide('../../packages/print/src/grammar.ts'),
      },
      {
        find: '@hifi/texture/grammar',
        replacement: fromStyleguide('../../packages/texture/src/grammar.ts'),
      },
      { find: '@hifi/core', replacement: fromStyleguide('../../packages/core/src/index.ts') },
      { find: '@hifi/liquid', replacement: fromStyleguide('../../packages/liquid/src/index.ts') },
      { find: '@hifi/print', replacement: fromStyleguide('../../packages/print/src/index.ts') },
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
