# Density is a token mode, and it never hides information

The reference design system has no density scale — nothing to derive, so it must
be designed. We decide that density is a **token mode** (`comfortable` |
`compact`) and not a component variant: it multiplies a small set of semantic
slots — the spacing scale, control height, row height — and resolves through a
custom property (`--nomos-density`) set on the theme root, never through
conditional CSS in a component. Components read the semantic slots, never a
number.

The rule that bounds it: **density changes space and size, never information.** A
dense mode hides neither a column, nor a label, nor a level of detail. What must
disappear when space is tight disappears through an explicit usage decision (a
prop), not through density.

## Consequences

- The mechanism is a **scale multiplier**: the build sets `--nomos-density` on the
  root (a `[data-density='compact']` selector per mode), and the app's Tailwind
  bridge does `--spacing: calc(0.25rem * var(--nomos-density))`. Everything
  Tailwind derives from `--spacing` — margins, paddings, control heights, row
  heights, icon sizes — follows density without any component class changing. A
  **fixed** length (`p-[13px]`, `h-[2rem]`) is rejected by the tokens test: it
  would escape density.
- Because it is set on the theme root, density is **scopable**: a rendering
  iframe can be compact while the host app is comfortable, and vice versa.
- The host app's dense mode serves the Triage desk: it is a dashboard of rows,
  density is a reading requirement, not an ornament.
