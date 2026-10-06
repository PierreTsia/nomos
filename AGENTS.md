# nomos — agent instructions

**The laws of the interface.** An app-agnostic design system: a core of semantic
tokens and React primitives, exposed to humans (a catalog) and to agents (an MCP
server), and **built in public** (`PierreTsia/nomos`, MIT, published to public npm
as `@nomosui/react`). Nomos names the **visual layer only** — tokens, primitives,
catalog, MCP server. It knows nothing about an app's state, i18n, router, or data.
An app's identity is a **skin**: a token overlay the app owns, never the core.

Read [`README.md`](README.md) for the shape and [`SKILL.md`](SKILL.md) for which
brick to reach for. Structural decisions live in [`docs/adr/`](docs/adr/): start
with 0002 (app-agnostic core), 0003 (theme interface), 0004 (`tokens.json` as the
single source), 0005 (the catalogue manifest), 0017 (the name), 0024 (the public
surface), 0026 (built in public).

## The boundary rule — imports go one way

An app may import Nomos; **Nomos never imports app code**. If explaining a
component needs a product word ("issue", "PR", an app name), it belongs in an app,
not here (ADR 0002, 0010). Inside the package, imports go through `@nomos/*` and
**never** through a relative path — ESLint enforces it.

## Layout

- `src/components/<name>/` — catalogued atoms and blocks. Each ships three pieces:
  the component (with its cva config), a hand-written `manifest.ts` (props,
  variants, usages — ADR 0005), and one entry in `src/catalogue/registry.ts`. One
  inventory, two renderings: a style page for a human, the MCP server for an agent.
- `src/features/` — behaviours the kit renders (`FacetedDataTable`), exported but
  not catalogued. They carry state and receive injected `labels`; the core has no i18n.
- `src/internal/` — the raw Radix primitives the atoms compose. Plumbing, not pieces.
- `src/mcp/` — the local stdio MCP server and the `ui://nomos/<name>` views.
- `tokens/` — `tokens.json` (DTCG) is the **single source**; `tokens.generated.css`
  and `tokens.resource.json` are committed renderings, **never edited by hand**.

## Commands

- `npm ci` · `npm test` (vitest, jsdom) · `npm run test:watch`
- `npm run lint` (eslint) · `npm run typecheck` (tsc)
- `npm run mcp` — the stdio MCP server against the source (no token needed)
- Generators (commit the artifact they write): `npm run tokens` · `build:view` ·
  `build:view-css` · `build:surface`
- Package: `npm run build:package` · `npm run size:check` · `npm run smoke:consumer`

## CI is the contract

`.github/workflows/ci.yml` runs `test`, `lint`, `typecheck`, `build:package`, then
`size:check` (the published tree stays shakeable), then the **drift gates** `tokens:check`,
`view:check`, `view-css:check`, `surface:check`, then `smoke:consumer`. A generated artifact
that has drifted from its source fails CI — replay the generator and commit the result in the
same PR.

`.github/workflows/pr-review-gate.yml` is the **merge gate**: a PR stays red until `@reviewer`
and `@qa` have left a review and a QA report, both bound to the head commit
(`<!-- review sha=… -->`, `<!-- qa sha=… -->` + `review:*` / `qa:*` labels). A push
invalidates both — replay them. `main` is protected and requires `verify`, `site` and
`pr-review-gate`. See [`docs/pr-review.md`](docs/pr-review.md).

## Public surface & releases (ADR 0024, 0026)

The public surface is the `src/index.ts` exports, the `--nomos-*` token **names**,
the MCP tool/URI/message-literals contract, and the shipped skill. It is frozen by
`surface.generated.json` + `surface:check`: a surface change fails the snapshot and
**must** edit it in the same PR (the act of documenting). A breaking change is a
**minor** while Nomos stays on **0.x**, and needs a **migration note**. Every change
to the package goes through a **changeset** (`npx changeset`); a published version
is immutable.

## Conventions

- **English.** README, ADRs, CONTRIBUTING, skill and commits are English (ADR 0026);
  the code comments are still the French of the port — leave them unless you touch them.
- **Tests colocated** (`*.test.ts` / `*.test.tsx` beside the code), red → green →
  refactor. A change to a contract starts with its test. Catalogue invariants are
  held by `src/catalogue/*.test.ts` and `src/mcp/skill.test.ts`: a component added
  without its manifest and registry entry, or missing from the SKILL inventory,
  turns them red.
- **Tokens are the single source.** Change a value in `tokens.json` only; never
  hardcode a colour (ADR 0004).
- **A structural change that contradicts a decision is raised in an ADR**, never
  applied silently. Commits: Conventional Commits, English.
- This repo is public and built in public: everything committed here is visible.
  No private references — no host-app names, no internal links (ADR 0006, 0026).

## If you change the design system

A change that changes a brick's **usage** updates `SKILL.md` in the same change —
the inventory list and the prose. The inventory is kept by
`src/mcp/skill.test.ts`; the manifest/registry coherence by
`src/catalogue/coherence.test.ts`.
