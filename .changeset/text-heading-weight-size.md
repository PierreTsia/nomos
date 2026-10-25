---
"@nomosui/react": minor
---

`Text` and `Heading` gain the axes #133 asked for, the ones still faked with a Tailwind
utility after the adoption type-scale migration:

- **`Heading`** gains **`size`**, decoupling the visual size from `level`: an adopter keeps
  the `h2` tag for the document structure while rendering a smaller size (`<Heading level={2}
  size="body">`), instead of a `text-*` class. Unset, the size still follows the level.
- **`Text` and `Heading`** gain **`weight`** (`regular` / `medium` / `strong`, from the token
  scale): `Text` defaults to `regular`, `Heading` to `strong` (its previous fixed weight).
  No raw `font-bold`; `font-bold` (700) has no token and stays out of the core.
- `cn` declares the `font-weight` group, so `font-regular`/`font-medium`/`font-strong` merge
  like the semantic sizes.

**Out of scope** (also noted on the issue):

- tone opacity (`text-muted-foreground/70` — a contrast smell, not a core axis) and the
  20px `text-xl` step (not a semantic step);
- the `Badge` asks — the extended palette (`sage`, `ai`, `accent` — app semantic slots, the
  app's skin, not the app-agnostic core, ADR 0002/0006), the `text-[10px]` size (below the
  `micro` step) and the large `px-4 py-1 text-sm` pill (no semantic step), all app-level
  overrides.
