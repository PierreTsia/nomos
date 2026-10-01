# The design system is named Nomos

The design system had no name for its visual language: everything was borrowed
from GymLogic and the package was named after the host product, with no
identity. We decide: the **design system** is called **Nomos**.

## Decisions

1. **The name: `nomos`.** Greek νόμος — law, order, usage (econo**my**, auto**nomy**).
   A design system *is* a corpus of rules: the name says the function. Spelling:
   `nomos` in code, `Nomos` in marketing and on React components. Frozen tagline:
   "**Nomos — the laws of the interface.**"

2. **Scope: the design system alone.** The host product keeps its own name; Nomos
   names the visual layer (tokens, primitives, catalogue, MCP server). We rename
   neither the repo, nor the dashboard, nor the agent.

3. **The name lives in the code, everywhere.** Consistent rename (no derived
   synonym):
   - the package scope → a Nomos scope (finally **`@nomos/react`**, ADR 0026);
   - alias `@ds` → **`@nomos`**, `@ds/derived` → **`@nomos/derived`**;
   - CSS token prefix `--ds-*` → **`--nomos-*`** (`cssNamespace` in
     `tokens/tokens.json`, derived by `scripts/build-tokens.mjs`);
   - MCP server → **`nomos`**, URIs `design-system://` → **`nomos://`**.

   > **Decision 3 on the scope** is **superseded**: first by ADR 0021, then by
   > ADR 0026 (public scope `@nomos/react`). The name, spelling, `--nomos-*`
   > prefix, MCP server and `nomos://` URIs stay unchanged.

4. **The package folder stays as it is.** It is a path, not the brand; renaming it
   would only bring configuration churn without gaining on the objective.

5. **The tokens file stays `tokens.json`.** A generic artefact name; the prefix
   (decision 3) carries the brand. `tokens.json` is cited by ADR 0004, and the
   build's error messages name it: renaming it would cost without saying anything
   more.

## Collisions (checked on 2026-10-01)

- **npm**: `nomos` exists at `0.0.0` **without a description** — a placeholder, not
  a competitor. The package is **scoped** (`@nomos/react`), therefore with no
  global collision; no publication is planned (ADR 0002). Nothing blocking.
- **Domain**: `nomos.design` does not respond (probably free); `nomos.dev` and
  `nomos.io` are taken. With no marketing surface for now, no action.

## Consequences

- A single name for the visual layer, from the package to the CSS up to the MCP
  server — no second derived name (`@ds`) that would coexist.
- The repo's glossary (`CONTEXT.md`) opens on this first resolved term.

## References

- ADR 0002 (app-agnostic heart), ADR 0004 (`tokens.json` single source).
