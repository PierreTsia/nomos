# Nomos site (ancillary)

The public catalogue site, built from this repo and published from `main` (v1.0,
`ROADMAP.md`). Per **ADR 0028**, `site/` is an **ancillary**: a **consumer** of
`@nomosui/react`, outside the core's `eslint` / `tsc` / `vitest`, built by its own
CI job. The core never imports it.

The site is **generated from the catalogue** (ADR 0005) — never hand-maintained:
`src/catalogue.ts` maps the package's exported `catalogue` to bricks, and
`src/catalogue.test.ts` holds the coverage (one page per manifest).

Routes (hash-based, no router dependency):

- `#/` — the landing page, every brick grouped by level, from the catalogue.
- `#/brick/<name>` — one page per brick.
- `#/tokens` — the semantic slots, read from the single source (`tokens.json`).

The showcase (props, variants, usages, rendered example) fills the brick pages in
#40.

```sh
npm ci
npm run dev        # local preview
npm test           # catalogue-coverage test
npm run lint
npm run typecheck
npm run build      # type-check + static build
```

It depends on the **published** `@nomosui/react` (the faithful consumer path).
