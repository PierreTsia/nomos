---
"@nomosui/react": minor
---

Catalog `Dialog` end to end (issue #10, ADR 0005 / 0019): a centred modal on a
scrim.

- `src/components/dialog/` ships the component (`DialogProps`), its hand-written
  manifest, and a colocated test; it joins the registry, `src/index.ts` and the
  MCP catalogue, so `list_components`, `get_component { name: "dialog" }`,
  `preview_component`, the resource `nomos://component/dialog` and the view
  `ui://nomos/dialog` follow with **no MCP file written**.
- The floating layer reads the ADR 0027 tokens (`z-overlay`, `bg-scrim`,
  `animate-overlay-in/out`, `animate-content-in/out`) — no hard-coded layer,
  veil or animation.
- `coherence.test.ts` now unmounts with `cleanup()` instead of clearing
  `document.body`, so a component that renders into a portal is verified
  correctly (the first such component is `Dialog`).
- `surface.generated.json` and the view CSS/bundle are replayed.

`Dialog` is a convenience surface (trigger, title, description, body, footer,
`closeLabel`, `open`/`defaultOpen`/`onOpenChange`); the sub-parts stay an
internal detail for now. No existing export, tool or prop changes.
