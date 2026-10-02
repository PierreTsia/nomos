# Nomos

**The laws of the interface.** An app-agnostic design system: a core of semantic tokens and
React primitives, exposed to humans (a catalog) and to agents (an MCP server), and built in
public.

Nomos names the **visual layer only** — tokens, primitives, catalog, MCP server. It knows
nothing about an app's state, i18n, router, or data. An app's identity is a **skin**: a token
overlay the app owns, never the core.

## Layout

- `src/components/<name>/` — catalogued atoms and blocks. Each one ships three pieces: the
  component (with its cva config), a hand-written `manifest.ts` (props, variants, usages,
  ADR 0005), and one entry in `src/catalogue/registry.ts`. One inventory, two renderings: a
  style page for a human, the MCP server for an agent.
- `src/features/` — behaviours the kit can render (`FacetedDataTable`), exported but not
  catalogued. They carry state and receive injected `labels`; the core has no i18n.
- `src/internal/` — the raw Radix primitives the atoms and features compose. Plumbing, not
  pieces.
- `src/mcp/` — the local stdio MCP server and the `ui://nomos/<name>` views.
- `tokens/` — `tokens.json` (DTCG) is the single source; `tokens.generated.css` and
  `tokens.resource.json` are committed renderings, never edited by hand.

## The boundary rule

Imports go one way: an app may import Nomos, Nomos never imports app code. Inside the
package, imports go through `@nomos/*` and never through a relative path — ESLint enforces
it.

## Development

```sh
npm ci
npm test            # vitest, jsdom
npm run lint
npm run typecheck
npm run mcp         # the stdio MCP server against the source
```

Generated artifacts are committed and replayed by a script; CI fails if one has drifted:

```sh
npm run tokens            # tokens.generated.css + tokens.resource.json
npm run build:view        # src/mcp/view.generated.ts
npm run build:view-css    # src/mcp/view-css.generated.ts
npm run build:surface     # surface.generated.json (the public surface snapshot)
```

Build and smoke-test the distributable package:

```sh
npm run build:package     # dist/index.js + dist/mcp/bin.js + types
npm run smoke:consumer    # installs the tarball in a fresh project and exercises it
```

## Roadmap

The milestones — v1.0 (a public static site, docs and a component showcase) and v2.0
(an app-bootstrapper MCP, the north star) — live in [`ROADMAP.md`](ROADMAP.md).

## Decisions

The structural decisions live in `docs/adr/`. Start with 0002 (app-agnostic core), 0003 (the
theme interface), 0004 (`tokens.json` as the single source), 0005 (the catalogue manifest),
0017 (the name), 0024 (the public surface), 0026 (Nomos goes public), 0027 (overlay:
layer, scrim and motion as tokens) and 0028 (the repo root is the package and its
ancillaries).

## License

MIT — see [LICENSE](LICENSE).
