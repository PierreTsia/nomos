# Tech Plan — App bootstrapper

> Epic Brief: `Epic_Brief_—_App_bootstrapper.md`. Roadmap: v2.0. Decision: ADR
> 0038 (framing; to be written). Epics #174 (starter), #175 (recipe), #176
> (CLI + distribution); slices #177–#184.

## Diagnosis

**The heart is deep enough; the repo is missing the app around it.** No new
runtime feature is required to bootstrap an app:

- **Theme/skin is CSS-first.** `tokens.generated.css` + `theme.css` are imported;
  a skin's CSS derives from `renderCss(resolveSkin(tokens.json, skin.json))`
  (ADR 0022/0025). No `<ThemeProvider>`.
- **Dark mode and density are token modes**, resolved by `data-theme` /
  `--nomos-density` on the root (ADR 0008/0009). No JS provider.
- **The only DS providers a template mounts** are `ToastProvider`
  (`src/features/toast`, ADR 0020) and `TooltipProvider` (Radix) — both already
  exported.
- Router, app state, i18n and data stay **app-side** (ADR 0002); the site already
  proves the pattern (`site/src/router.ts`, `LanguageProvider`).

**The one unproven path.** App-side skin derivation is exported (ADR 0025) but
exercised nowhere: `renderCss` runs only in the token build and the MCP view
builder; the site imports the *pre-generated default* CSS. The starter is the
first consumer to run `renderCss(resolveSkin(...))` at build time. If that needs
a helper or a new export, it is a public-surface change (ADR 0024) and lands in
the same PR as #179.

**Ancillary plumbing.** Root `eslint.config.js` ignores `site` but **not**
`templates`; root `tsconfig.json` (`include: [src, vitest.setup.ts]`) and
`vitest.config.ts` (`include: ['src/**']`) already exclude it by scope. Only the
eslint ignore is strictly required; the TP keeps the trio explicit for ADR 0028
coherence.

## Slices

Each slice is an issue; exit criteria are the issue's AC.

### Slice 0 — framing (#177)

Rewrite `ROADMAP.md` v2.0 (template + skill + read-only MCP); write ADR 0038
recorded against 0002/0007/0013/0024/0028.

**Exit:** ROADMAP matches the brief; ADR 0038 merged; `surface:check` unchanged.

### Slice 1 — ancillary hygiene + CI (#178)

`eslint.config.js`: add `templates` to `globalIgnores`. `tsconfig.json` /
`vitest.config.ts`: confirm scoping (no edit needed if `include` holds). Add
`templates/starter/{package.json,tsconfig.json,eslint.config.js,package-lock.json}`
mirroring `site/` (React 19, Tailwind v4, `@nomosui/react`). Add a `starter` job
to `.github/workflows/ci.yml` (`working-directory: templates/starter`, own npm
cache path; install → lint → typecheck → test → build), seeded with a minimal app.

**Exit:** root `test`/`lint`/`typecheck` ignore `templates/**`; the `starter` job
is green on the minimal app; no ancillary dep enters the package.

### Slice 2 — the starter (#179)

`templates/starter/src`: app-side shell (layout/nav/page/stack-grid) using
`Navbar`/`Footer`; a light app-side router; three pages — dashboard, list with
`FacetedDataTable`, form inside `ToastProvider`; English labels as props.
`skin.json` + `scripts/skin.build.mjs` emitting `renderCss(resolveSkin(tokens.json,
skin.json))` into the app CSS; the shell imports the token CSS. `README.md` = the
rename-and-fill recipe.

**Exit:** installs/type-checks/builds green in the `starter` job; no colour
literal outside `skin.json`; no `@nomos/*` import; the skin path is exercised.

### Slice 3 — the recipe (#184)

A "bootstrapper" section in `SKILL.md` (prompt → scaffold → bricks → skin → run);
held by `src/mcp/skill.test.ts`.

**Exit:** the section is asserted; `surface:check` unchanged.

### Slice 4 — install-skill (#180)

`scripts/install-skill.mjs` copies `templates/starter` beside `SKILL.md`; a test
asserts both land.

**Exit:** `nomos-skill --dir <tmp>` leaves both; test green.

### Slice 5 — tarball + smoke (#181)

`package.json` `files` gains `templates/starter`; `scripts/smoke-consumer.mjs`
asserts the packed tarball carries it. Minor changeset.

**Exit:** `npm pack` includes the template; `smoke:consumer` fails without it.

### Slice 6 — the CLI (#182)

`create-nomos-app` (`bin`): copy `templates/starter` into a target dir, substitute
the app name; no network, no LLM. Test scaffolds into a temp dir.
**Public-surface change:** edit `surface.generated.json` in the same PR, with a
minor changeset + migration note.

**Exit:** scaffolds a green app; `surface:check` passes with the snapshot.

### Slice 7 — site docs (#183)

A `site/` page: start from the starter (copy or CLI), rename, fill, run. README
touch if the entry point moved.

**Exit:** the `site` job builds green; no core gate touched.

## Verification

- Core: `npm test` · `npm run lint` · `npm run typecheck` · `npm run build:package`
  · `npm run size:check` · the four drift gates (`tokens:check`, `view:check`,
  `view-css:check`, `surface:check`) · `npm run smoke:consumer`.
- Ancillary: the `starter` job (install, lint, typecheck, test, build) and the
  `site` job.

## Risks

| Risk | Mitigation |
|---|---|
| The skin-derivation path needs a new export | Detect in #179; ship the export + `surface:check` edit + changeset together. |
| A second `bin` (CLI) drifts `surface.generated.json` | #182 owns the snapshot + minor changeset + migration note in one PR. |
| Starter rots from the catalogue | Own CI job (#178), a fresh consumer install, and the migration note per ADR 0024. |
| Layout leaks into the heart | No layout brick; `templates/**` is app-side and never imported by `src/` (ADR 0002/0028). |
| Ancillary deps enter the tarball | `files` is explicit; `smoke:consumer` counts them. |
