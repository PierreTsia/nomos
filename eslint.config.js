import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `site/` is an ancillary (ADR 0028): a consumer of the package, never linted by the
  // core — it carries its own config and its own CI job.
  globalIgnores(['dist', '**/dist', '.view-dist', 'site']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Catalogued components export their cva config and manifest next to the component
    // itself, so the fast-refresh rule does not apply to the core (ADR 0005).
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // The boundary, held by tooling and not by discipline (ADR 0002, 0003, 0028). Nomos
    // never imports app code, never through a relative path, never the router, and never
    // the site ancillary: a relative path climbing two levels up is exactly where a
    // boundary leaks.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/*',
                './*',
                '../*',
                'react-router',
                'react-router-dom',
                'react-router/*',
                'nomos-site',
                'site/*',
              ],
              message:
                'Nomos never imports app code, never through a relative path, never the router, and never the site ancillary (ADR 0028).',
            },
          ],
        },
      ],
    },
  },
])
