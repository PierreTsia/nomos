# Epic Brief — Public catalogue site and docs

> Source: `ROADMAP.md` (v1.0). This brief records the epic; its slices are opened
> as issues from here. Its sibling is the v2 app bootstrapper
> (`Epic_Brief_—_App_bootstrapper.md`).

## Summary

Nomos is built in public (ADR 0026) but shows almost nothing for it: a human who
wants to learn the system must install the package, run the MCP server or read the
ADRs. There is **no public surface** — no site, no per-brick page, no browsable
layout examples. The catalogue already holds one inventory (manifests + registry,
ADR 0005) rendered twice — the style page and the MCP server; this epic adds the
**third rendering**, for the human, from the **same source**.

## Context & Problem

**Who is affected:** an adopter (discovering the system), an agent (pointing a
human at a canonical example), a contributor (where does my brick appear?).

**Current state:**
- Discovery is: README → ADRs → run `npm run mcp`. No visual reference, no
  copy-paste examples of whole screens.
- The human "style page" named in ADR 0005 does not exist yet in the public repo.
- Layout composition is folklore — the composite scenes exist but are not a
  browsable gallery.

**Pain points:**

| Pain | Impact |
|---|---|
| No public site | adoption requires tooling; nothing to link, nothing to skim |
| No per-brick page | the manifest (variants, usages, *intention*) is invisible to a human |
| No layout examples | an adopter cannot see how bricks compose into a screen |
| Docs scattered across README and ADRs | getting started, the boundary and contributing are hard to navigate |

## Decisions locked

- **One inventory, several renderings.** The site is **generated from the
  catalogue** — a page per brick, built from its manifest — never a hand-kept
  list. A brick added without its page fails a test (ADR 0005 spirit).
- **The site is a consumer.** It imports `@nomosui/react` like an app; Nomos never
  imports the site (ADR 0002). It lives as a repo ancillary under **ADR 0028**
  (the repo root is the package *and* its ancillaries).
- **Static, built in public.** No CMS, no server; published from this repo.

## User Stories

1. As an **adopter**, I want to browse every brick with its variants and usages,
   so that I can choose without running the MCP.
2. As an **adopter**, I want copy-paste examples of whole screens, so that I start
   from a working layout.
3. As an **agent**, I want the site generated from the manifest index, so that it
   can never diverge from the catalogue.
4. As a **contributor**, I want a page per brick tied to its manifest, so that
   adding a brick adds its page.
5. As a **curious developer**, I want the site static and hosted, so that I can
   read Nomos without cloning anything.

### Success measures

| Story # | Measure |
|---|---|
| 3, 4 | a test asserts 100% catalogue coverage: one page per manifest |
| 1 | every variant and usage of a manifest is rendered on its page |
| 2 | the layout gallery examples compile in the site build |
| 5 | the site builds in CI and is published from `main` |

## Scope

**In scope:**
1. **ADR 0028 + hygiene.** The `site/` ancillary is excluded from the core lint
   and test globs and gets its own config; a CI job builds it.
2. **The site skeleton**, generated from the catalogue registry: a landing page,
   the token reference (`nomos://tokens` rendering), and a page per brick.
3. **The component showcase:** each page renders its manifest — props, variants,
   usages (when/use/avoid) and the example.
4. **The layout gallery:** the composite scenes promoted to browsable examples of
   whole screens.
5. **The docs:** getting started (install, tokens, skin/theme), the boundary rule,
   and the contributing flow.
6. **Publication:** deploy from `main` (e.g. GitHub Pages), built in public.

**Out of scope:**
- A live playground with state/router and editable props (that is an app; a later
  epic if wanted).
- A CMS or any non-static backend.
- Versioned docs (Nomos is 0.x, a single line; revisit at 1.0).

## Success Criteria

- **Numeric:** the site build is green in CI; a coverage test holds one page per
  catalogue entry; `surface:check` and the other drift gates are untouched.
- **Qualitative:** a newcomer understands a brick (intention, not just props) from
  its page alone; no component list is maintained by hand.

## References

- `ROADMAP.md` (v1.0); ADR 0002 (app-agnostic), 0005 (catalogue), 0007 (skills),
  0019 (agentic contract), 0024 (public surface), 0026 (built in public), 0028
  (repo ancillaries, to be written).
