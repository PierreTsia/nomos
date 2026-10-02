import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command }) => ({
  // A project GitHub Pages site is served from /<repo>/; the dev server stays at /.
  base: command === 'build' ? '/nomos/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
}))
