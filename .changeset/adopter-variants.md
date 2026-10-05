---
"@nomosui/react": minor
---

Six bricks gain the variants an adopter had to fake with Tailwind utilities — the
E32 recensement (mijote adoption) turned the recurring `className` patterns into core
variants:

- **Button** — `shape="pill"`, sizes `touch` (mobile CTA) and `icon-lg`.
- **Text / Heading** — `tone` (`default|muted|primary|danger`), from the semantic palette.
- **Badge** — `size` (`default|sm|xs`), `shape` (`default|square`) and the `subtle` tone
  (primary ink on a primary-tinted surface).
- **Input / SelectTrigger** — `size` (`sm|md|lg`, from the density scale, no fixed height),
  `variant="flush"` for inline fields, and `icon="leading"` to reserve the icon padding
  without a caller `pl-*` (`SearchField` now uses it).
- **Card** — `padding` (`default|compact|flush`), `gap` (`default|comfy`) and `variant`
  (`default|muted`, a more discreet border). Padding and gap go through `--card-pad` /
  `--card-gap`, so no caller `p-*`/`gap-*`.
- **Sheet** — `side="bottom"` is now a **bottom-sheet**: rounded top, safe-area bottom
  padding and a capped height.

Also fixes `cn`: it declared no theme, so tailwind-merge classed the semantic sizes
(`text-lead`, `text-body`…) as *text colours* and dropped them whenever a colour followed.
The Nomos scale is now declared, matching `tokens/theme.css`.

**Migration note** — additive: the public exports are unchanged, the new variant groups
extend existing props (`shape`/`tone`/`size`/`padding`/`gap`), and `side="bottom"` changes
only the panel's default styling (a drawer becomes a bottom-sheet). An adopter that already
applies the equivalent utilities can drop them.
