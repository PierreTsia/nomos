# Icons are app-side; the heart exposes only the `LucideIcon` type

Nomos depends on `lucide-react` and uses it internally: the atoms that need a
glyph (Alert, Chip, Toast, the table toolbar, the pagination, the tree, the
faceted filter…) import the icons they render. The package, however, exports
**no icon**. A consumer that wants to pass an icon into a slot — a leading icon
on a Button, a status glyph on a Chip — has to bring its own.

That raises the question of what the heart owes the app on the icon front. The
temptation is to re-export a curated set, or all of `lucide-react`, so the app
"just imports from Nomos". This ADR settles it: **the heart exposes no icon
set**; it exposes only the **type** that lets an app type its own icon slots.

## Context

- The public surface is frozen by `surface.generated.json` + `surface:check`
  (ADR 0024). Every name added to `src/index.ts` is a name Nomos must carry
  **for life**: removing it later is a breaking change.
- The heart is app-agnostic and imposes no unnecessary dependency (ADR 0002).
  An icon set is a **product choice** — which glyphs, which style, which
  library — not a structural one.
- `lucide-react` is already a dependency of the package, but that is an
  **implementation detail**: the atoms compose it, the consumer does not see it.

## Decisions

1. **The heart exposes no icon set.** Neither a curated subset nor the whole of
   `lucide-react` is re-exported from `src/index.ts`. The app provides its own
   icons, from `lucide-react` or from anywhere else.

2. **The app owns its icon identity.** Which icons exist, how they are named and
   how they are bundled is the app's business — the same way the palette and the
   density are the skin's (ADR 0002, 0022). Nomos names the visual layer, not
   the app's vocabulary.

3. **The heart exposes exactly one icon-related name: the `LucideIcon` type.**
   `export type { LucideIcon } from 'lucide-react'` lets an app type the slots
   the heart offers (`icon?: LucideIcon`) without depending on a curated set of
   the heart. It is a **type**, erased at build time: it adds no runtime surface
   and no icon to the bundle.

4. **The internal use of `lucide-react` is unchanged.** The atoms keep importing
   the glyphs they render; that stays an implementation detail, not a contract.

## Consequences

- An app that wants icons installs `lucide-react` (or another library) itself and
  passes the components into the heart's slots. The heart never re-exports them.
- The public surface grows by exactly one **type** name, `LucideIcon`. The
  snapshot (`surface.generated.json`) must be regenerated in the same PR
  (ADR 0024).
- A consumer can type its icon props against the heart's contract without
  pulling a set of icons from the heart — the seam stays where it belongs.

## Alternatives considered

- **Re-export a curated set of icons.** Refused: it freezes a product choice
  (which glyphs, which names) into the public surface **for life** (ADR 0024).
  Every icon added or removed becomes a surface change, and the heart starts
  carrying the app's vocabulary — exactly what ADR 0002 forbids.
- **Re-export all of `lucide-react`.** Refused for the same reason, worse: it
  makes the heart a proxy for a third-party library, couples the surface to
  `lucide-react`'s releases, and invites consumers to depend on Nomos for
  something that is not Nomos.
- **Expose nothing at all, not even the type.** Refused: an app typing a slot
  (`icon?: LucideIcon`) would have to depend on `lucide-react` directly just to
  name the type, even when it uses another icon library. The type is the minimal
  seam that keeps the slot typed without shipping a set.

## References

- ADR 0002 — the heart is app-agnostic and imposes no unnecessary dependency.
- ADR 0022 — the skin (palette, density) is carried by the app, not the heart.
- ADR 0024 — the public surface is frozen by a snapshot; a name added is a name
  carried for life.
