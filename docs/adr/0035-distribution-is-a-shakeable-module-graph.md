# Distribution is a tree-shakeable module graph and the MCP SDK is build-only

The heart ships to a consumer as one compiled bundle (`dist/index.js`). Issue
#104 measured what that costs: `import { Badge } from '@nomosui/react'` pulls
the whole catalogue — ~60 components, Radix, `@tanstack/react-table` and zod —
and `sideEffects: false` alone does not help. Inside a single file the module
`src/catalogue/registry.ts` evaluates `validateCatalogue(catalogueEntries)` at
top level, and those entries reference every component and the manifest schema.
A consumer that imports one brick keeps the barrel module, so the top-level call
stays, so everything stays. The package is a **design system meant to be
consumed one brick at a time** (ADR 0005); a distribution that cannot shake is a
distribution that taxes every adopter.

A second cost rode the same report: `@modelcontextprotocol/sdk` is a runtime
`dependency`, but only `src/mcp/bin.ts` uses it, and `dist/mcp/bin.js` **bundles
it** (the build externalizes only `node:`). Every consumer of the heart
therefore installed the SDK's tree — express, hono, ajv, jose, cors, … — for a
server binary it may never run.

## Decisions

1. **The core builds as a module graph, not a bundle.** `build:package` emits
   `dist` with `preserveModules` (root `src`): `dist/index.js` re-exports, and
   each brick lives in its own file. The catalogue module is now a leaf a
   bundler can drop when no one imports it.

2. **`sideEffects` protects the CSS and nothing else.** `"sideEffects": ["**/*.css"]`
   marks every JS module as pure (so the barrel shakes) while keeping a CSS
   `import` from being elided. `import { Badge }` yields ~1.3 kB of package code,
   and the catalogue/zod never enter — held by `size:check`.

3. **The MCP SDK is a devDependency.** The published `nomos-mcp` binary is
   self-contained (it inlines the SDK, ADR 0028's rule); a consumer that wants
   the SDK as a **client** installs it itself. The heart's install tree no longer
   carries a server's.

4. **The Tailwind bridge scans the tree.** `tokens/theme.css` declares
   `@source '../dist/components'` (and `features`, `composites`, `lib`) instead of
   the single bundle file, so a consumer compiles the classes the components
   actually use.

5. **A size guard is part of the contract.** `size:check` consumes the built
   `dist` as a consumer would, imports one brick, and fails if the catalogue
   leaks or the internal code exceeds a ceiling. CI runs it right after
   `build:package`.

## Consequences

- The public surface does not move: the same exports, from a per-module tree.
  `surface:check` stays green; the layout of `dist` is no longer a
  one-file promise.
- `@source` moves from a file to directories — a real dependency on the new
  layout. `src/package.contract.test.ts` holds both `sideEffects` and the SDK's
  absence.
- The sub-exports question is **not** taken up: per-brick entry points
  (`@nomosui/react/badge`) would freeze ~60 permanent public paths. The measured
  barrel + `preserveModules` delivers the same shake for none of that surface;
  add sub-exports only if the guard ever proves them necessary.
- Problem 2 of #104 (a consumer's `@supabase/supabase-js` losing its
  tree-shaking on the mere presence of the package) is **not reproduced** in a
  minimal consumer here; the SDK-to-devDependency move removes the largest
  install-tree perturbation. If it returns, it is its own diagnostic ticket.

## References

ADR 0002 (app-agnostic), 0004 (tokens single source), 0005 (the catalogue),
0021 (private distribution, superseded), 0024 (the public surface), 0025
(distribution exposes CSS and skin), 0026 (built in public), 0028 (the repo root
is the package and its ancillaries), 0034 (the package exposes the view entry).
