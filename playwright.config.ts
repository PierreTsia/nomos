import { defineConfig } from '@playwright/test'

/**
 * The QA browser pass (`@qa`, docs/pr-review.md) drives what the package ships. Scope
 * discovery to `e2e/` so a bare `npx playwright test` never picks up vitest's `*.test.ts(x)`;
 * no `webServer` — a spec opens the `file://` view or a locally-started site itself.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  reporter: 'line',
})
