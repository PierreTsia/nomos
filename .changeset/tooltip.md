---
"@nomosui/react": minor
---

Catalog `Tooltip` — the family `TooltipProvider` / `Tooltip` / `TooltipTrigger` /
`TooltipContent` (issue #14, ADR 0005 / 0019) — no new dependency.

- `src/internal/tooltip.tsx` becomes `src/components/tooltip/`, catalogued: the
  registry entry and `src/index.ts` expose the family plus the manifest, so
  `render_tooltip`, `nomos://component/tooltip` and `ui://nomos/tooltip` follow
  with no MCP file written. The catalogue registers the family on its mandatory
  root, `TooltipProvider`.
- The bubble reads the ADR 0027 tokens (`z-tooltip`, `animate-content-in/out`):
  no hard-coded `z-50`.
- `src/internal/` is now empty and removed; `src/mcp/view.css` drops its
  `@source '../internal'` (the overlay parts all live under `src/components`).
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.

**Migration.** `@nomos/internal/tooltip` is gone; import the family from
`@nomos/components/tooltip/tooltip` (or from the package root), which now exports
`Tooltip`, `TooltipTrigger` and `TooltipContent` in addition to
`TooltipProvider`. No prop, token name or MCP tool is renamed.
