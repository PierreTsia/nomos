---
"@nomosui/react": patch
---

Fix the floating layer rendering transparent in consumer apps.

Nomos ships its component classes as strings inside `dist`, and a consumer's
Tailwind (v4) does not scan `node_modules`: without a declared source, utilities
like `bg-popover`, `z-popover` and `shadow-md` were never compiled, so the
facet popover and other overlays computed to `z-index: auto` and
`background: transparent` — the table showed *through* them. `tokens/theme.css`
now declares the compiled bundle (`@source '../dist/index.js'`), so the core's
utilities compile for consumers. The MCP views keep their curated source list
(`@source not`). No JS export, token name, MCP tool or component prop changes.
