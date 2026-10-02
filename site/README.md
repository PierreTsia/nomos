# Nomos site (ancillary)

The public catalogue site, built from this repo and published from `main` (v1.0,
`ROADMAP.md`). Per **ADR 0028**, `site/` is an **ancillary**: a **consumer** of
`@nomosui/react`, outside the core's `eslint` / `tsc` / `vitest`, built by its own
CI job. The core never imports it.

The site is **generated from the catalogue** (ADR 0005) — never hand-maintained.
This directory is the skeleton; the generated pages (one per brick) follow in the
v1.0 slices.

```sh
npm ci
npm run dev        # local preview
npm run build      # type-check + static build
npm run lint
npm run typecheck
```

It depends on the **published** `@nomosui/react` (the faithful consumer path).
