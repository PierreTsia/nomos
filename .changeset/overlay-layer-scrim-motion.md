---
"@nomosui/react": minor
---

Overlay foundation (ADR 0027): the floating layer reads its layering, its veil
and its motion from tokens.

- New semantic slots: `z.{overlay,popover,tooltip,toast}`,
  `color.scrim`, and `motion.duration.{fast,base,slow}` /
  `motion.ease.{standard,in,out}`. They appear in `tokens.generated.css`, in the
  `nomos://tokens` resource, and therefore in `surface.generated.json`.
- `tokens/theme.css` gains `--color-scrim`, the `z-*` utilities and hand-written
  overlay animations (`animate-overlay-in/out`, `animate-content-in/out`,
  `animate-slide-in/out-{right,left,top,bottom}`) driven by the motion tokens,
  plus a `prefers-reduced-motion` reset. No new dependency.

**Migration.** A consumer that imported the internal `Sheet`, `Select`,
`DropdownMenu` or `Tooltip`, or the toast feature, must **re-import the updated
`@nomosui/react/tokens/theme.css`** (or regenerate its CSS from the skin): the
`z-50` / `bg-black/80` / `animate-in…` classes those components carried are
replaced by `z-*` / `bg-scrim` / the new animations. The previous animation
classes came from no installed plugin and were already inert in views. No JS
export, MCP tool or component prop changes.
