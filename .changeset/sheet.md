---
"@nomosui/react": minor
---

Catalog `Sheet` — side panel and `drawer` (issue #11, ADR 0005 / 0019).

- `src/internal/sheet.tsx` becomes `src/components/sheet/`, catalogued: the
  registry entry and `src/index.ts` expose the parts (`Sheet`, `SheetTrigger`,
  `SheetContent`, `SheetOverlay`, `SheetPortal`, `SheetClose`, `SheetHeader`,
  `SheetFooter`, `SheetTitle`, `SheetDescription`) plus the manifest, so the MCP
  tool `render_sheet`, the resource `nomos://component/sheet` and the view
  `ui://nomos/sheet` follow with no MCP file written.
- The four sides are the documented `side` variant; `side="bottom"` is the
  **drawer** — the same panel, not a separate atom.
- The floating layer reads the ADR 0027 tokens (`z-overlay`, `bg-scrim`,
  `animate-overlay-in/out`, `animate-slide-in/out-{side}`): no hard-coded layer,
  veil or animation.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.

**Migration.** `@nomos/internal/sheet` is gone; import the parts from
`@nomos/components/sheet/sheet` (or from the package root). `src/index.ts`
previously exported only `SheetDescription` / `SheetHeader` / `SheetTitle` from
the internal path; it now exports every part from the catalogued brick. No prop,
token name or MCP tool is renamed.
