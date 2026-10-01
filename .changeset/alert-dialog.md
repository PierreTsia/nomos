---
"@nomosui/react": minor
---

Add and catalog `AlertDialog` (issue #17, ADR 0005 / 0019).

- New dependency `@radix-ui/react-alert-dialog`; `package-lock.json` is replayed
  so `npm ci` is reproducible.
- `src/components/alert-dialog/`: the component (parts `AlertDialog`,
  `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogOverlay`,
  `AlertDialogPortal`, `AlertDialogHeader`, `AlertDialogFooter`,
  `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`,
  `AlertDialogCancel`), its hand-written manifest and a colocated test; the
  registry and `src/index.ts` expose them, so `render_alert-dialog`,
  `nomos://component/alert-dialog` and `ui://nomos/alert-dialog` follow with no
  MCP file written.
- The scrim and the layer read the ADR 0027 tokens (`z-overlay`, `bg-scrim`,
  `animate-overlay-in/out`, `animate-content-in/out`): no hard-coded value.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.
