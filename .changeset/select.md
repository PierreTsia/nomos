---
"@nomosui/react": minor
---

Catalog `Select` (issue #13, ADR 0005 / 0019) — no new dependency.

- `src/internal/select.tsx` becomes `src/components/select/`, catalogued: the
  registry entry and `src/index.ts` expose the parts (`Select`, `SelectTrigger`,
  `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`,
  `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`) plus the
  manifest, so `render_select`, `nomos://component/select` and
  `ui://nomos/select` follow with no MCP file written.
- The floating list reads the ADR 0027 tokens (`z-popover`,
  `animate-content-in/out`): no hard-coded `z-50`.
- `data-table-pagination` now imports the parts from their new home.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.

The per-part exports were already on the public surface (from the raw internal
path); `SelectScrollUpButton` / `SelectScrollDownButton` and `selectManifest` are
new. **Migration.** `@nomos/internal/select` is gone; import the parts from
`@nomos/components/select/select` (or from the package root). No prop, token name
or MCP tool is renamed.
