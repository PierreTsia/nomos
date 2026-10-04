# Epic Brief — Tree-shakeable distribution

> Source: issue #104 (the `p0` blocker), consolidating the duplicate #103. This
> brief records the epic as refined; the tickets are its slices. The packaging
> decision lives in ADR 0035.

## Summary

`@nomosui/react` cannot be adopted incrementally: importing **one** brick pulls
the whole catalogue. Issue #104 measured it in a real consumer (a Vite 8 +
rolldown PWA): `import { Badge }` brought the ~60 components, Radix,
`@tanstack/react-table` and zod (+208 kB), and simply installing the package
cost +225 kB elsewhere. Nomos is a design system built to be consumed brick by
brick (ADR 0005); a distribution that cannot shake taxes every adopter and
**suspends** the mijote adoption (epic E32, `mijote#178`).

This epic makes the published package a **tree-shakeable module graph** and
removes a server dependency from a consumer's install, verified by a consumer
build guard.

## Context & Problem

**Who is affected:** an adopter app (mijote, GymLogic) and any bundler that
resolves the package.

**Current state:**
- `build:package` emits a single `dist/index.js` bundle (254 kB).
- `src/catalogue/registry.ts` evaluates `validateCatalogue(catalogueEntries)` at
  module top level; the entries reference every component and the zod manifest
  schema. In one file, a barrel import keeps that call alive → everything stays.
  `sideEffects: false` alone was measured to change nothing.
- `@modelcontextprotocol/sdk` is a runtime `dependency`, but only the MCP binary
  uses it and that binary inlines it; consumers install express/hono/ajv/jose/… .

**Pain points:**

| Pain | Impact |
|---|---|
| Barrel not shaken | An app pays for 60 bricks to use one; bundle bloat. |
| SDK as a runtime dep | Every consumer installs a server's dependency tree. |
| No guard | The regression is invisible until a consumer measures it. |
| `@source '../dist/index.js'` | Pins the CSS bridge to a one-file layout. |

## User Stories

1. As an **adopter app**, I want to import one brick without the catalogue, so
   that my bundle only pays for what I use.
2. As an **adopter app**, I want installing Nomos to add no server dependency,
   so that my install tree stays lean.
3. As a **maintainer**, I want a guard that fails CI when the barrel stops
   shaking, so that the regression cannot return silently.
4. As a **contributor**, I want the Tailwind bridge to follow the module layout,
   so that a consumer still compiles every class the components use.
5. As an **agent/consumer**, I want the public JS surface unchanged, so that the
   fix costs no migration.

### Success measures

| Story # | Measure |
|---|---|
| 1 | `import { Badge }` yields a few kB of package code and contains no catalogue/zod marker (`size:check`) |
| 2 | `@modelcontextprotocol/sdk` is absent from `dependencies`; the installed `nomos-mcp` still starts (`smoke:consumer`) |
| 3 | `size:check` runs in CI after `build:package` |
| 4 | `view-css:check` is green from the per-module scan |

## Scope

**In scope:**
1. `preserveModules` core build + `sideEffects: ["**/*.css"]`.
2. Move the MCP SDK to `devDependencies`; the smoke installs it as a client.
3. `@source` scoped to the `dist` UI directories; regenerate the view CSS.
4. `size:check` + CI step; contract tests for `sideEffects` and the SDK.

**Out of scope:**
- Per-brick sub-exports (`@nomosui/react/badge`) — ~60 permanent public paths for
  no shake `preserveModules` does not already give (ADR 0035).
- Problem 2's exact diagnosis in a non-minimal consumer — not reproduced; a
  separate diagnostic ticket if it returns.

## Success Criteria

- **Numeric:** the drift checks (`tokens:check`, `view:check`, `view-css:check`,
  `surface:check`) and `size:check` are green; `smoke:consumer` is green.
- **Qualitative:** the exports of `src/index.ts` are unchanged; a consumer build
  of one brick carries no catalogue; the `dist` layout is per-module.
