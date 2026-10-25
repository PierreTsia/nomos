---
"@nomosui/react": minor
---

`Sheet` gains a **`radius`** axis on the bottom-sheet (#134). `side="bottom"` no longer
hardcodes `rounded-t-lg`: `radius` sets the top corner (`default`, `sheet`, `none`),
applied to the bottom side only — other sides are unaffected. The default keeps today's
rendering.

Two radius **tokens** join the theme contract so a skin can retarget the larger corners
(ADR 0002/0004): `--nomos-radius-surface` (12px, the Button `soft` corner) and
`--nomos-radius-sheet` (24px, the bottom-sheet top). `tokens/theme.css` maps them onto
Tailwind's `--radius-xl` / `--radius-3xl`.

The `Input` / `SelectTrigger` `size` descriptions now state the retarget explicitly: a
`size` moves the height **and** the padding and text size together, by design (ADR 0008);
there is no height-only axis. An adopter that takes a `size` accepts the typography that
comes with it.
