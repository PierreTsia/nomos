# Epic Brief — App bootstrapper: from a prompt to a running app

> Source: `ROADMAP.md` (v2.0, the north star). This brief records the epic; its
> slices are opened as issues from here. The v1.0 public site is its sibling
> (`Epic_Brief_—_Public_catalogue_site_and_docs.md`).

## Summary

Nomos ships bricks and a skill, but **no starting app**: an adopter or an agent
who wants "a todo list" or "three pages and a DataTable" must hand-wire Vite,
Tailwind, the tokens, a skin and a layout shell before writing a single brick.
The heart also has **no layout brick** — `Card`'s manifest says explicitly that a
card is not a layout — so multi-page composition has no held example.

This epic makes the prompt-to-app path real **without a new runtime**: a
**starter template** in the repo (`templates/starter`), a **bootstrapper recipe in
the skill**, and the **existing read-only MCP** as the authoritative catalogue.
The host agent does the generation; Nomos stays app-agnostic and stays read-only
(ADR 0002, 0013, 0024).

## Context & Problem

**Who is affected:** an adopter (starting an app by hand), an agent asked to build
an app, a maintainer (what does a "Nomos app" even look like?).

**Current state:**
- The package distributes the heart (`@nomosui/react`), the tokens and the skill,
  but **no app boilerplate** and no layout/page/nav brick.
- The MCP is read-only by design: it renders bricks and scenes, it writes nothing.
- The MCP composite scenes inline their own layout with `style={{…}}` — proof the
  composition exists, but not a held, runnable example.

**Pain points:**

| Pain | Impact |
|---|---|
| No app boilerplate | every adopter re-wires Vite/Tailwind/tokens/skin; the same mistakes repeat |
| No layout brick, no held shell | a multi-page app has no starting point; composition is folklore |
| The skill says *which brick*, not *how to assemble an app* | an agent knows the bricks and still cannot bootstrap |
| No example held by CI | the intended composition rots and drifts from the catalogue |

## Decisions locked

- **Architecture:** template + skill + MCP. No generator runtime, no LLM inside
  the package — the host agent drives (any agent that reads a skill and runs a
  shell: Claude Code, opencode, a local agent).
- **Layouts live in the template** (app-side, Tailwind), not in the catalogue.
  Adding `AppShell`/`Page`/`Stack`/`Grid` bricks is **out of scope** and, if ever
  wanted, becomes its own epic + ADR.
- **The starter lives in this repo** (`templates/starter`), which amends the "the
  repo root is the package" framing of ADR 0026, dec. 2 — raised as **ADR 0028**
  (repo ancillaries), never applied silently.
- **The MCP is unchanged.** The starter sits in the repo/tarball; the agent copies
  it. No new tool, no new resource, no `surface.generated.json` edit.

## User Stories

1. As an **adopter**, I want a runnable Nomos app in minutes, so that I start from
   a working shell instead of hand-wiring Vite, Tailwind, tokens and a skin.
2. As an **adopter**, I want the starter to show a three-page app with a DataTable
   and a form, so that structure is obvious and copy-able.
3. As an **agent**, I want a skill that maps a prompt to bricks and a scaffold, so
   that "build me a todo list" produces a running app.
4. As an **agent**, I want the MCP to stay read-only and authoritative, so that
   the generated app matches the catalogue exactly.
5. As a **skin author**, I want the starter to ship a `skin.json` and derive its CSS
   from it, so that app identity is an overlay, never a fork (ADR 0022, 0025).
6. As a **maintainer**, I want the starter built and type-checked in CI, so that it
   cannot rot.
7. As a **contributor**, I want the boundary intact — Nomos never imports the
   starter — so that the heart stays app-agnostic.

### Success measures

| Story # | Measure |
|---|---|
| 1, 2 | `templates/starter` installs, type-checks and builds green in a dedicated CI job |
| 3 | a prompt walked through the recipe yields an app that runs, using only catalogued bricks |
| 4 | `surface:check` is unchanged (no MCP tool/URI/message added) |
| 5 | the starter's CSS derives from `resolveSkin`; no colour literal outside `skin.json` |
| 7 | no `@nomos/*` or relative core import in `templates/starter`; the core lint stays green |

## Scope

**In scope:**
1. **ADR 0028 + repo hygiene.** `templates/**` excluded from the core lint and
   test globs; the starter gets its own tsconfig/eslint; a CI job builds it. The
   starter is added to `files` so an external consumer receives it.
2. **The starter** (`templates/starter`): Vite + React 19 + Tailwind v4 +
   `@nomosui/react`; an app-side shell (layout, nav, page, stack/grid); three
   pages (dashboard, list with `FacetedDataTable`, form with `ToastProvider`);
   `skin.json` + derived CSS; a README that is the rename-and-fill recipe.
3. **The skill:** a "bootstrapper" section in `SKILL.md` (prompt → scaffold →
   bricks → skin → run), and `install-skill` copies `templates/starter` alongside
   the skill; a coherence test holds the section.
4. **Docs + changeset:** README/ROADMAP touch, a minor changeset (0.x policy).

**Out of scope:**
- An LLM or API call inside the package (contradicts the app-agnostic heart).
- A `create-nomos-app` CLI (a possible later slice; the template works without it).
- Layout/nav bricks in the catalogue (template owns layout).
- Any workflow engine (n8n and friends): the host agent is the orchestrator.

## Open questions

- **Nomos resolution in the starter:** depend on the published `@nomosui/react`
  (faithful; CI builds against the packed tarball) vs a local alias to `src`
  (direct dev; less faithful). Default: published dependency.
- **One skill or two:** extend `SKILL.md` (simpler for `install-skill`) vs a
  second `skills/nomos-bootstrapper/SKILL.md`. Default: extend.

## Success Criteria

- **Numeric:** `npm test`, `npm run lint`, `npm run typecheck`,
  `npm run build:package` stay green; the starter's build job is green; the four
  drift gates (`tokens:check`, `view:check`, `view-css:check`, `surface:check`)
  are untouched.
- **Qualitative:** from a one-line prompt, an agent produces a running app built
  only from catalogued bricks and a skin; no layout lives in the heart; no private
  reference appears in the template.

## References

- `ROADMAP.md` (v1.0, v2.0); ADR 0002 (app-agnostic), 0005 (catalogue), 0007
  (skills), 0013 / 0019 (MCP contract), 0022 (skin), 0024 (public surface and the
  0.x policy), 0025 (CSS and skin), 0026 (built in public), 0028 (repo
  ancillaries, to be written).
