# Overlay: layer, scrim and motion as tokens

Nomos has no floating brick yet, and the plumbing that will carry them
(`src/internal/{sheet,select,dropdown-menu,tooltip}.tsx`, `src/features/toast.tsx`)
hard-codes its own layering and its own veil: `z-50` in six places and
`bg-black/80` in `sheet.tsx`. That is a violation of ADR 0004 (no hard-coded
value) and a hole in the theme interface (ADR 0003): an app cannot re-layer its
overlays, cannot tint its scrim, and inherits whatever a component chose. The
motion is worse — the `animate-in` / `fade-in-0` / `zoom-in-95` classes the
internals carry come from no installed plugin, so in a `ui://` view they are
silently dropped and the overlays render **unanimated**. We settle the three
slots the whole floating layer depends on.

## Decisions

1. **Layering is a token.** A `z` scale names the layers by usage —
   `overlay` (50) < `popover` (60) < `tooltip` (70) < `toast` (80) — and
   components read `z-overlay` / `z-popover` / `z-tooltip` / `z-toast`, never a
   number. The tens leave room for a local layer between two paliers. As with
   `radius`, a `primitive.z.*` holds the raw number and the `semantic.z.*`
   aliases it (ADR 0004): the slot is replaceable by a skin, the alias is the
   contract.

2. **The scrim carries its opacity.** `semantic.color.scrim` is a colour at
   **four** HSL components (`[0, 0, 0, 0.8]`), not a colour plus an `80`
   modifier in the class. The derivation renders a four-component colour as
   `H S% L% / A`, so `bg-scrim` is the whole veil and no opacity literal
   survives in a component. The slot is filled in both modes (parity, ADR 0009).

3. **Motion is a token, and it is ours.** `motion.duration.{fast,base,slow}`
   and `motion.ease.{standard,in,out}` join the semantic slots —
   `fast`/`base`/`slow` for time, the three Tailwind curves for easing. The
   heart defines the overlay animations **by hand** in `tokens/theme.css`
   (`@keyframes` + `@utility`: `animate-overlay-in/out`, `animate-content-in/out`,
   `animate-slide-in/out-{right,left,top,bottom}`), each reading a duration and
   a curve token. We add **no** dependency (`tailwindcss-animate` /
   `tw-animate-css`): ADR 0020 makes zero-third-party a hard rule, and a plugin
   would not let a token drive the timing. The definitions live in `theme.css`
   because that file is already the single Tailwind raccord imported by **both**
   the app and the views — one definition, two renderings, as with the rest of
   the tokens.

4. **`prefers-reduced-motion` is honoured in the heart.** A media rule targets
   the animation utilities and sets `animation: none`; a consumer gets the
   accessibility baseline without writing it.

## Consequences

- `z-50` and `bg-black/80` disappear from `src/`; the internals read the new
  slots, so a skin changes layer order and scrim without a fork.
- `view.css` scans `src/components` (where the overlay parts live): a promoted
  overlay's classes — the utilities and their keyframes — are compiled into
  `VIEW_CSS`, so the overlay scene (`ui://nomos/composite/overlay`) renders
  **styled and animated** in a view. A test fails if that CSS loses `.bg-scrim`,
  `--nomos-z-overlay` or the keyframes.
- The generated artifacts move with the source: `tokens.generated.css`,
  `tokens.resource.json` and `surface.generated.json` (new token slots) are
  replayed and committed, same regime as ADR 0004.
- **Assumed debt**: the four-component HSL and the `cubicBezier` array widen the
  derivation; both are covered by a test. The scrim is the same black 80 % in
  both modes until a light identity asks for less.

## Alternatives considered

| Option | Why we didn't pick it |
|---|---|
| Keep `z-50`, a scrim class and let overlays animate via `tailwindcss-animate` | A hard-coded layer violates ADR 0004, and the plugin's timings ignore the tokens. |
| A numeric `z` scale (`z-1`, `z-2`…) | Names by usage tell the reader *which* layer; a number does not. |
| Carry the scrim as a colour + an `80` opacity utility | Leaves the opacity as a literal in a component — the exact class of violation the ticket closes. |
| Put the motion utilities in a new exported CSS subpath | A second import a consumer can forget; `theme.css` is already the raccord both sides load. |

## References

ADR 0003 (theme interface), 0004 (`tokens.json` as the single source), 0008 /
0009 (density, mode and parity), 0020 (the heart imposes no dependency), 0022
(the skin and the view CSS), 0024 (the public surface).
