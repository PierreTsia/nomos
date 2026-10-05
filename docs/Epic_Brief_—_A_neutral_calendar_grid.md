# Epic Brief — A neutral calendar grid

> Source: issue #112. Supersedes ADR 0015, decision 3 (the pickers stay out of the
> heart). Tech Plan: `Tech_Plan_—_A_neutral_calendar_grid.md`.

## Summary

Two independent adopters ship a **near-identical vendored calendar wrapper** (~220
lines each) around `react-day-picker`. One uses it as a single-date **picker** inside a
popover; the other as a **month grid with per-day markers** and a controlled visible
month. Neither uses the library's date engine: the wrapper carries no date math, no
locale by default (one app passes `fr`, the other `enUS`), and one app does not even load
the library's stylesheet — it re-styles every slot with utilities. The heart owns no
calendar, so each app duplicates an accessible grid it must maintain alone.

## Context & Problem

**Who is affected:** every adopter that needs to choose or display dates; the catalogue,
which has no date brick.

**Current state:**

- ADR 0015, decision 3, puts the `pickers` (`date`, `tree`) out of scope, to keep a
  date/validation/i18n library out of the heart (ADR 0002).
- Both adopters re-vendor the same shadcn-style wrapper, with the same `classNames`,
  `components` and `DayButton` overrides.
- The two usages differ only at the edges — locale, `weekStartsOn`, the `disabled`
  rule, per-day markers, and the popover composition — all **app-side**.

**Pain points:**

| Pain | Impact |
|---|---|
| No calendar in the heart | Each app vendors and maintains the same ~220-line a11y widget. |
| A date library in the app | `react-day-picker` + its CSS are pulled for grid layout the app does not use. |
| Divergent wrappers | The same bug is fixed twice; the two copies drift (one loads the CSS, one does not). |

## User Stories

1. As an **adopter**, I want a neutral month grid I can drop in without a date library,
   so that I do not maintain an accessible widget alone.
2. As an **adopter choosing one date**, I want to compose the grid with the existing
   `Popover`, so that the heart stays free of a composed picker.
3. As an **adopter showing activity**, I want per-day markers, so that the grid reflects
   my data without my owning the layout.
4. As an **agent**, I want the grid catalogued (manifest + MCP contract), so that I can
   pick it and read its props.

### Success measures

| Story # | Measure |
|---|---|
| 1 | an adopter deletes its vendored wrapper and `react-day-picker` from its dependencies |
| 2 | the grid works inside `Popover` with caller-driven state; the core ships no popover/input |
| 3 | `modifiers` + `modifierClassNames` mark days; asserted in tests |
| 4 | `manifest.ts` + `registry.ts` entry + an MCP view; `SKILL.md` names the brick |

## Scope

**In scope:**

1. `Calendar` — a **single-month grid**: caption, prev/next navigation, weekday header,
   day buttons, outside days.
2. Controlled `month` / `onMonthChange`, `selected` / `onSelect` (single).
3. `weekStartsOn`, `isDateDisabled`, `modifiers` + `modifierClassNames`, injected
   `labels` (already formatted), `autoFocus`, `showOutsideDays`, `className`.
4. Full keyboard / ARIA behaviour: roving tabindex, arrows, Home/End, PageUp/Down,
   `grid`/`gridcell` roles, `aria-selected`/`aria-disabled`, RTL.
5. Catalogue companions, tests, `SKILL.md`, a changeset.

**Out of scope:**

- A composed `DatePicker` (input + popover + validation + error message) — app-side.
- Any date library, `Intl`, i18n or default locale in the heart — the app passes
  already-formatted `labels`.
- Range/multiple selection, multiple months, dropdown caption, week numbers — later,
  non-breaking.
- Business rules (min/max semantics, timezone anchoring) — the app passes a predicate
  and handles time.

## Success Criteria

- **Numeric:** `npm test` covers roles, keyboard navigation, selection, disabled days
  and modifiers; `tokens:check` / `view:check` / `view-css:check` / `surface:check` green;
  no new dependency in `package.json`.
- **Qualitative:** an adopter can delete its vendored wrapper; the grid names no product
  and carries no locale default; a host that supplies `labels` sees fully localized
  caption and weekday text.
