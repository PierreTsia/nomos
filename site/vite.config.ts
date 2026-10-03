import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Preview the local core instead of the published package: `NOMOS_LOCAL=1 npm run dev`
// (see the `dev:preview` script at the repo root). The build stays on the published
// package, so the site remains a faithful consumer (ADR 0028).
const LOCAL = process.env.NOMOS_LOCAL === '1'
const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => ({
  // A project GitHub Pages site is served from /<repo>/; the dev server stays at /.
  base: command === 'build' ? '/nomos/' : '/',
  plugins: [react()],
  resolve: LOCAL
    ? {
        dedupe: ['react', 'react-dom'],
        alias: [
          { find: /^@nomosui\/react$/, replacement: path.resolve(here, '../src/index.ts') },
          { find: /^@nomos\/derived\//, replacement: path.resolve(here, '../tokens') + '/' },
          { find: /^@nomos\//, replacement: path.resolve(here, '../src') + '/' },
        ],
      }
    : undefined,
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
}))
