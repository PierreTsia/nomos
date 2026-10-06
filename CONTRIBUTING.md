# Contributing to Nomos

Thanks for taking the time to contribute.

## Setup

```sh
npm ci
npm test
```

## Before you open a PR

- Run `npm test`, `npm run lint` and `npm run typecheck`.
- If you touch the tokens, the views or the public surface, replay the generator and commit
  the artifact: `npm run tokens`, `npm run build:view`, `npm run build:view-css`,
  `npm run build:surface`. CI fails on drift.
- Add a **changeset** (`npx changeset`): a version bump and a note are required for any
  change to the package. A breaking change (surface, tokens, MCP contract) needs a migration
  note.

## Review and QA before merge

A PR merges only on a **traced review and a traced QA pass, both bound to the head commit**.
Run the `@reviewer` agent (diff, ADRs, ponytail, one `## Reviewer report` comment + a
`review:*` label) and the `@qa` agent (renders the views/site in a browser, screenshots, one
`## QA report` comment + a `qa:*` label). A push invalidates both; replay them. CI's
`pr-review-gate` blocks the merge until both markers name the current head. See
[`docs/pr-review.md`](docs/pr-review.md).

## Ground rules

- **App-agnostic.** Nothing in the core may name a product. If explaining a component needs
  the word "issue", "PR" or an app name, it belongs in an app, not here (ADR 0002, 0010).
- **One inventory.** A component is not finished until its `manifest.ts` and its
  `registry.ts` entry exist, and its usages are written, not just its types (ADR 0005).
- **The boundary, held by tooling.** Inside the package, import through `@nomos/*`, never a
  relative path, never app code (ADR 0003). ESLint enforces it.
- **Tokens are the single source.** Change a value in `tokens.json` only; never hardcode a
  colour (ADR 0004).

## Decisions

A structural change that contradicts an existing decision is raised explicitly, in an ADR —
it is never applied silently. See `docs/adr/`.
