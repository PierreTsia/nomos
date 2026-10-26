import { defineConfig } from '@playwright/test'

/**
 * The QA browser pass (`@qa`, docs/pr-review.md) drives what the package ships: a
 * `ui://nomos/<brick>` view or the catalogue site. The specs are throwaway — written,
 * run, then deleted — so they live in `e2e/` and are git-ignored. This config exists only
 * to scope discovery to `e2e/`: without it, a bare `npx playwright test` walks the repo,
 * picks up vitest's `*.test.ts(x)` and crashes. No `webServer`: a spec opens the generated
 * `file://` view or a locally-started site itself.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.{ts,mts}',
  reporter: 'line',
})
