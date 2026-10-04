# Tech Plan — Tree-shakeable distribution

> Issue #104 (the `p0` blocker; #103 is the same report). Decision: ADR 0035.
> Epic Brief: `Epic_Brief_—_Tree-shakeable_distribution.md`.

## Diagnosis

The barrel does not shake because of **where the side effect sits**, not because
`sideEffects` is missing. `src/catalogue/registry.ts:466` runs
`validateCatalogue(catalogueEntries)` at module top level; `catalogueEntries`
(`:144`) imports every component and `componentManifestSchema` (zod,
`contract.ts`). In the one-file `dist/index.js`, importing `Badge` retains the
module (an export is used) and with it the top-level call — so the whole index
and zod stay. Measured on the built package:

| Build | `import { Badge }` internal code |
|---|---|
| single file, `sideEffects: false` | ~848 kB (deps bundled) — unchanged |
| `preserveModules` + `sideEffects: false` | 1.27 kB, no catalogue/zod |

## Slices

### Slice 1 — the module graph (the fix)

`scripts/build-package.mjs` `buildCore`: drop the single-file lib output for
`preserveModules: true` / `preserveModulesRoot: src` / `entryFileNames:
'[name].js'`. `dist/index.js` becomes a thin re-export; each brick a file.
`package.json`: `"sideEffects": ["**/*.css"]` (`false` would let a bundler drop a
CSS `import`; `true` shakes nothing).

**Exit:** `dist/index.js` is a re-export barrel; `npm test` green.

### Slice 2 — the Tailwind bridge follows the layout

`tokens/theme.css`: `@source '../dist/index.js'` →
`@source '../dist/components'` + `features` + `composites` + `lib`. Regenerate
`view.generated.css` + `src/mcp/view-css.generated.ts` (`build:view-css`) and
commit. `src/package.contract.test.ts` asserts the new `@source`.

**Exit:** `view-css:check` green.

### Slice 3 — the SDK leaves the consumer's install

`package.json`: `@modelcontextprotocol/sdk` → `devDependencies` (the bin inlines
it — `build-package.mjs` `buildMcpBin` externalizes only `node:`).
`scripts/smoke-consumer.mjs` installs the SDK explicitly for its client and reads
the spec from `devDependencies`.

**Exit:** `smoke:consumer` green (the installed `nomos-mcp` starts and serves a
view).

### Slice 4 — the guard (never again silently)

`scripts/check-tree-shaking.mjs` (new `size:check`): build an entry importing one
`Badge` against the built `dist`, dependencies external, and fail if the bundle
contains a catalogue/zod marker (`FacetedDataTable`, the duplicate-name message)
or exceeds a ceiling. CI runs `size:check` after `build:package`. Contract tests:
`sideEffects` includes `**/*.css`; the SDK is not a dependency.

**Exit:** `size:check` green; a deliberate single-file revert turns it red.

### Slice 5 — the diagnostic ticket for problem 2

A minimal consumer here does **not** reproduce the `@supabase/supabase-js`
de-tree-shaking on mere presence (measured: delta 0). Open a separate
`diagnostic` ticket if the regression survives slice 3 in the adopter's E32
repro; do not claim the AC before that.

## Verification

- `npm test` · `npm run lint` · `npm run typecheck`
- `npm run build:package` · `npm run size:check`
- `npm run tokens:check` · `view:check` · `view-css:check` · `surface:check`
- `npm run smoke:consumer`

## Risks

| Risk | Mitigation |
|---|---|
| `preserveModules` breaks `@source` (one-file promise) | Scoped globs + `view-css:check` in the same change. |
| `sideEffects` drops a CSS `import` | `["**/*.css"]`, not `false`. |
| A consumer depends on the flat `dist` layout | `exports` unchanged; only internal file names move. |
| SDK dev-only breaks the bin | Smoke starts the installed bin. |
