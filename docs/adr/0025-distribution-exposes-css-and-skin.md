# Distribution exposes the CSS and the skin

ADR 0021 opens distribution (heart, skill, MCP server) and ADR 0022 settles that
the skin produces the app's CSS — `renderCss(resolveSkin(tokens, skin))`. Both are
true in the repo, false in the package: `package.json` exposed only `.`, and
`resolveSkin` / `renderCss` were not re-exported. An external consumer could
therefore neither load the Tailwind bridge nor derive its CSS from the skin. We
make the package consumable.

## Decisions

1. **The CSS follows the heart as sub-exports.** `package.json` exposes
   `./tokens/theme.css` (the Tailwind bridge → `--nomos-*`),
   `./tokens/tokens.generated.css` (the per-mode values) and `./tokens/tokens.json`
   (the source). The `tokens/` folder is already in `files` (ADR 0021): publication
   embeds them, and `build:package` fails if a sub-export points to a missing file
   or a file outside `files`.

2. **The theme is public.** `src/index.ts` re-exports `resolveSkin`, `renderCss`
   and the `TokensDocument` type: the app derives its CSS from the **same** skin as
   the served views (ADR 0022 dec. 4). No second package or separate entry as long
   as a consumer does not ask for the theme without React.

3. **`build:package` carries the contract.** It copies `build.d.mts` — the
   derivation module is a `.mjs` that `tsc` does not emit — so that `renderCss` has
   a resolved type at the consumer. Its self-sufficiency check now accepts
   `.mjs → .d.mts`.

## Consequences

- ADR 0021 (dec. 3, "what the package ships") is **amended**: the CSS and the theme
  functions are added to the heart, the skill and the MCP.
- ADR 0022 dec. 4 leaves intention: `renderCss(resolveSkin(...))` is reachable from
  the outside.
- The public surface (ADR 0024) gains three names (`resolveSkin`, `renderCss`,
  `TokensDocument`): `surface.generated.json` is updated in the same PR,
  `surface:check` holds it.
- ADR 0017 (dec. 3, scope) remains **superseded** by 0021; the name, the
  `--nomos-*` prefix and the aliases do not move.
- `AGENTS.md` ("no published package") is corrected: a **private** publication
  exists (ADR 0021).

## References

ADR 0017 (the name), 0021 (private distribution), 0022 (the skin), 0024 (the
public surface).
