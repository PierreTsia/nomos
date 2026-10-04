---
"@nomosui/react": minor
---

The published package is now a **tree-shakeable module graph** and the MCP SDK leaves the
consumer's install (ADR 0035):

- the core builds with `preserveModules` (one file per module) and declares
  `"sideEffects": ["**/*.css"]` — `import { Badge }` no longer pulls the ~60 components,
  Radix, `@tanstack/react-table` and zod (measured: ~848 kB → ~1.3 kB of package code);
- `@modelcontextprotocol/sdk` is a **devDependency**: the `nomos-mcp` binary inlines it,
  and a consumer that wants it as a client installs it itself;
- `tokens/theme.css` scans `dist/components` (+ `features`, `composites`, `lib`) instead of
  the former one-file bundle.

**Migration note** — the public exports are unchanged; only the internal layout of `dist`
moves from a single `index.js` to a per-module tree. A consumer that reached into
`dist/index.js` by path (it should not) is unaffected at the `exports` level. A consumer
that used the transitive `@modelcontextprotocol/sdk` must add it to its own dependencies.
