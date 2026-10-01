---
"@nomosui/react": minor
---

Catalog `DropdownMenu` (issue #12, ADR 0005 / 0019) — no new dependency.

- `src/internal/dropdown-menu.tsx` becomes `src/components/dropdown-menu/`,
  catalogued: the registry entry and `src/index.ts` expose every part
  (`DropdownMenu`, `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioItem`,
  `RadioGroup`, `Label`, `Separator`, `Shortcut`, `Group`, `Portal`, `Sub`,
  `SubTrigger`, `SubContent`) plus the manifest, so `render_dropdown-menu`,
  `nomos://component/dropdown-menu` and `ui://nomos/dropdown-menu` follow with no
  MCP file written.
- The floating menu reads the ADR 0027 tokens (`z-popover`,
  `animate-content-in/out`): no `z-50` in hard copy.
- `facet-filter` and `data-table-toolbar` now import the parts from their new
  home.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.

**Migration.** `@nomos/internal/dropdown-menu` is gone; import the parts from
`@nomos/components/dropdown-menu/dropdown-menu` (or from the package root). No
prop, token name or MCP tool is renamed.
