# The repo root is the package and its ancillaries

The roadmap takes Nomos past the package: v1.0 wants a **public site** built and
published from this repo, and v2.0 a **starter template** an agent copies. Those
are not part of the published `@nomosui/react` surface, yet they must be built in
public, linted and built in CI, and made to respect the one-way boundary (ADR
0002). ADR 0026 decision 2 fixed "the repo root is the package" — true when the
repo held nothing else; it does not say where a sibling artifact lives, whether it
enters the tarball, or how the core's tooling stays clear of it. Left open, the
first such artifact would either enlarge the package by accident or fork the repo
to escape it. This ADR names the **ancillary** and the rule.

## Decisions

1. **The repo hosts the package and its ancillaries.** The root stays the home of
   `@nomosui/react`; alongside it the repo may carry **ancillaries** — the public
   site (`site/`) and the app starter (`templates/**`) named by the roadmap, and
   any later sibling of the same kind. An ancillary is a **consumer** of the
   package: it imports `@nomosui/react` and is **never imported by `src/`**. The
   one-way boundary (ADR 0002) becomes a property of the repo layout, not only of
   the published module.

2. **An ancillary is outside the core's tooling.** The package's `eslint`, `tsc`
   and `vitest` cover the heart (`src/`, `tokens/`, `scripts/`) and nothing else:
   each ancillary carries its own config and its own test command, and the core's
   globs ignore it (`eslint.config.js`, `tsconfig.json`, `vitest.config.ts`). A
   change in the site can never turn the core red, and a core change can never
   silently break the site — each is proven by its own job.

3. **An ancillary is not the public surface.** No ancillary adds an export, a
   token slot, an MCP tool/URI or a message literal; `surface.generated.json` is
   untouched (ADR 0024). Whether one is **shipped in the tarball** is decided per
   ancillary, never by this ADR: the site is never published; the starter ships
   deliberately, as the `files` entry `templates/starter`, so an external consumer
   receives it (v2.0 epic). The default is *outside* `files`.

4. **CI builds each ancillary in its own job.** The core `verify` job is
   unchanged; each ancillary gets a dedicated job (install, build, its own
   checks) so a failure reads as *the site broke*, never as *the core broke*.
   Built in public (ADR 0026): the ancillary is built from `main`.

5. **The core drift gates stay core.** `tokens:check`, `view:check`,
   `view-css:check` and `surface:check` guard the package. The site is
   **generated from the catalogue** (ADR 0005) — one inventory, one more
   rendering — and may hold its **own** coverage test (one page per manifest),
   but it adds no gate to the core and weakens none.

## Consequences

- ADR 0026 decision 2 is **amended**: the repo root is the package **and** its
  ancillaries, not the package alone.
- `eslint.config.js`, `tsconfig.json` and `vitest.config.ts` gain ignores for
  `site/**` and `templates/**`; each ancillary carries its own config. The
  boundary is extended to the repo: importing an ancillary from `src/` is a
  violation, held by tooling.
- An ancillary's dependencies stay out of the package: a site-only library never
  enters the heart's `dependencies`, and the heart's `package-lock.json` remains
  the package's. Whether an ancillary uses a workspace or its own lockfile is an
  implementation choice, not a decision here.
- The site's build lives in CI and deploys from `main`; the starter is built and
  type-checked in CI so it cannot rot.

## Alternatives considered

| Option | Why we didn't pick it |
|---|---|
| A separate repo for the site | Loses the built-in-public adjacency and the "generated from the catalogue" guarantee; a second repo, CI and deploy to keep in sync. |
| A `packages/` workspace, the site as a package | Moves the package root (the tarball root) to make room; heavier than the need, and an ancillary is not a published package. |
| The site under `src/` | Enters the tarball and the core globs — the site is not the heart; it breaks "the tarball is the package". |
| Keep the repo package-only and out-source the site | The roadmap keeps the site in this repo, built in public from the catalogue; naming it here is the point. |

## References

ADR 0002 (app-agnostic boundary), 0005 (the catalogue: one inventory, several
renderings), 0007 (the skill ships the starter), 0024 (the public surface), 0026
(**decision 2 amended**), and `ROADMAP.md` / the two epic briefs that name the
site and the starter.
