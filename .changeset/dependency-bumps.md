---
"@nomosui/react": patch
---

Dependency refresh. The published dependency ranges are unchanged — the existing `^`
ranges already allowed the newer minors, so `package.json` (and the core `dist`) is
untouched. What moves is the locked build: the MCP server bundles its dependencies, so
the shipped `nomos-mcp` binary now carries the newer `@radix-ui/*` (tooltip 1.4, dialog
1.3, scroll-area 1.4, checkbox 1.4, select 2.4, collapsible 1.2, switch 1.4) and `zod`
4.6.7. `src/mcp/view.generated.ts` is regenerated to match. No change to the public API.
