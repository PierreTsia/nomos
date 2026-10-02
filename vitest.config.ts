import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@nomos/derived': path.resolve(import.meta.dirname, './tokens'),
      '@nomos': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Only the core's tests. The site ancillary (ADR 0028) runs its own tooling and has
    // its own CI job; the core must never pick up a file from it.
    include: ['src/**/*.test.{ts,tsx}'],
    // Le catalogue grandit : les tests qui listent outils et ressources approchent le
    // défaut de 5 s. Une marge large évite un flake sans masquer une vraie lenteur.
    testTimeout: 10000,
  },
})
