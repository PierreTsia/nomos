---
"@nomosui/react": minor
---

`Button` extends its **`size`** and **`shape`** scales, closing #130's residual gaps (the
`className` the adopter kept after the E32 migration):

- **`size`** gains `xs` (h-8, compact inline chip), `xl` (h-14) and `2xl` (h-16, large
  full-width CTA), and the square icon sizes `icon-xs` (h-7) / `icon-sm` (h-8), alongside
  the existing `sm`/`default`/`lg`/`touch`/`icon`/`icon-lg`.
- **`shape`** gains `soft` (`rounded-xl`, a non-pill rounded corner).

`CopyButton` reuses the Button config, so it inherits the same size scale; its manifest is
brought in line. No export is removed; icon sizes below 32px (`icon-xs`) are documented as
off the tap target.
