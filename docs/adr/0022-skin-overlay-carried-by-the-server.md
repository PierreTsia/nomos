# The skin: a token overlay, carried by the server, single source for app and views

A shared design system (ADR 0002) must let each app set **its** identity. Until now
`appViewFor` inlined the host app's tokens hard-coded, and a view carried only the
custom properties — **not the utility classes**: a component served in a `ui://`
iframe was not styled (the e2e only checked the text). We settle the missing
contract.

## Decisions

1. **A *skin* is a semantic overlay.** It is a DTCG document that carries only
   **semantic** slots (no `primitive`), merged over the heart's default
   (`tokens.json`, which remains the *reference skin*). An **absent** slot inherits
   the default; an **unknown** slot (a typo, a non-existent slot) fails. The
   **theme interface** (ADR 0003) is the set of semantic paths of the default.

2. **The server carries the skin.** The Nomos instance (or the app rendering a
   view) receives a skin by **configuration** — a DTCG document (a file via
   `NOMOS_SKIN`, or an object passed to `createDesignSystemServer({ skin })`),
   default = `tokens.json`. The host only switches theme and density (`set-view`):
   it knows **no** skin. An agent client does not have to resolve an app's palette.

3. **The style is in the heart, the values in the skin.** The heart publishes a
   **compiled CSS** (utilities + `@theme`) that maps the components' classes onto
   the `--nomos-*` variables. This is app-agnostic: the same classes for all apps.
   A view inlines this CSS + the skin's **values** + the markup + the bundle. The
   `--nomos-*` namespace is **fixed**: a skin changes the values, never the names.

4. **Single source.** The skin produces the **app's** CSS
   (`renderCss(fusion(default, skin))`) **and** the **views'** values: the app and
   the agent of the same app cannot diverge. This is what an adopter (GymLogic)
   sets.

## Consequences

- The heart gains a pure function `resolveSkin(default, overlay)` (merge +
  validation) and a generated-and-committed **utility CSS build**, held by a
  `check` — the same regime as the tokens and the view bundle (ADR 0004, 0013).
- `buildAppView` takes the **resolved** tokens (the skin's values) + the utility
  CSS, instead of a hard-coded `tokens.json`. The MCP server takes a skin by
  configuration.
- Fixing the **unstyled** views is part of this contract, not a separate fix.
- **Assumed debt**: the heart's default still looks like the host app (ADR 0001);
  we neutralise it the day a real 2nd app requires it, not before.
- The POC proves an app skin end to end (real data + distinct identity).

## References

ADR 0001 (the host app's identity), 0002 (app-agnostic heart + skin), 0003 (theme
interface), 0004 (tokens single source), 0008 / 0009 (density, mode), 0013 / 0019
(`ui://` views), 0021 (distribution).
