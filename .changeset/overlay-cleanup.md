---
"@nomosui/react": patch
---

Cleanup after the overlay epic: drop a dead `.z-50`, fix manifest types and the
ADR 0027 wording.

- The `z-50` left in three manifest comments is gone, so Tailwind no longer emits
  an unused `.z-50` utility into `view-css.generated.ts` — the whole overlay layer
  reads the ADR 0027 tokens now.
- `onOpenChange` is typed `(open: boolean) => void` (not `() => void`) in the
  `dialog`, `sheet`, `dropdown-menu` and `popover` manifests.
- The accordion's chevron transition reads `--nomos-motion-duration-fast` instead
  of a raw `duration-200`.
- ADR 0027 and the view-scan test comment say `src/components` (the overlay parts
  live there) instead of the removed `@source '../internal'`.
- `vitest`'s `testTimeout` is raised to 10 s: the growing catalogue was bringing
  the resource-listing test close to the 5 s default.

No export, token name, MCP tool or component prop changes.
