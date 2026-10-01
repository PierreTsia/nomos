---
"@nomosui/react": minor
---

Add and catalog `Popover` (issue #15, ADR 0005 / 0019).

- New dependency `@radix-ui/react-popover` (light, the same family as the other
  atoms); `package-lock.json` is replayed so `npm ci` is reproducible.
- `src/components/popover/`: the component (parts `Popover`, `PopoverTrigger`,
  `PopoverContent`, `PopoverAnchor`), its hand-written manifest and a colocated
  test; the registry and `src/index.ts` expose them, so `render_popover`,
  `nomos://component/popover` and `ui://nomos/popover` follow with no MCP file
  written.
- The surface reads the ADR 0027 tokens (`z-popover`,
  `animate-content-in/out`): no hard-coded `z-50`.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.
