# The heart owns a neutral calendar grid, not a date picker

ADR 0015, decision 3, puts the `pickers` (`date`, `tree`) out of scope to keep a
date/validation/i18n library out of the heart. That reasoning holds for a
**composed picker** — an input, a popover, a validation engine, a message. It does
not hold for the **grid** underneath, and the exclusion has a cost that is now
measured: two independent adopters each vendor a near-identical calendar wrapper
(~220 lines) around `react-day-picker`. The wrapper carries no date math and no
locale of its own; one app passes `fr`, the other `enUS`; one does not even load
the library's stylesheet. The library is pulled for a grid the app re-styles from
end to end, and the same accessible widget is maintained twice, in two forks that
drift.

The grid is a **presentation primitive**: it lays out a month, moves focus, and
reports selection. It knows no business rule, no locale, no timezone, no data.
That is exactly the heart's mandate (ADR 0002), so — scoped to the grid alone —
the heart takes it.

## Decisions

1. **The heart owns `Calendar`, a single-month grid.** Caption, weekday header,
   previous/next navigation, day buttons and outside days. It is **prop-controlled**:
   `month`/`onMonthChange`, `selected`/`onSelect`. It owns no state the app wants.

2. **No composed `DatePicker`.** The input, the popover, the validation and the
   error message stay app-side (they are a feature, not a primitive — ADR 0015
   decision 1). An app composes `Calendar` with the heart's `Popover`.

3. **No date library, no `Intl`, no i18n in the core.** The grid receives its
   **already-formatted `labels`** (caption, seven weekdays, nav labels) and a
   numeric `weekStartsOn` — the same "slots, no engine" boundary the `Field` uses
   for its error message (ADR 0015 decision 2). Local `Date` only; bucketing is by
   local year/month/day, never normalized to UTC — timezone anchoring is the app's.

4. **Accessibility is hand-built and dependency-free.** Roving tabindex, arrows,
   `Home`/`End`, `PageUp`/`PageDown`, roles `grid`/`row`/`gridcell`/`columnheader`,
   `aria-selected`/`aria-disabled`, `role="status"` caption. This is the one hard
   part, and it is why the brick exists: an app should not re-implement it.

5. **Markers are data, injected.** `modifiers` (a predicate per key) and
   `modifierClassNames` let an app stamp days — a per-day dot, a state — without
   the core knowing what they mean (the `Timeline` state precedent).

6. **v1 is deliberately narrow.** Single selection only; range/multiple selection,
   multiple months, a dropdown caption and week numbers are **not** in v1 — no
   adopter uses them, and adding one later is non-breaking. The optional surface
   is refused, not deferred behind dead props.

## Consequences

- ADR 0015, decision 3, is **superseded for the date grid**: the `tree` and the
  other `pickers` remain out of scope; a **composed** date picker remains
  app-side. The core stays free of any date dependency, held by
  `package.contract.test.ts`.
- An adopter deletes its vendored wrapper and its date library; the heart ships
  one grid, in one place, with one accessibility contract.
- The grid is catalogued like any brick: a `manifest.ts`, a `registry.ts` entry,
  an MCP view and a `SKILL.md` line (ADR 0005).
- The accessibility matrix is a permanent test obligation: a grid regression is a
  keyboard regression, so the tests are the boundary, not the styling.

## References

ADR 0002 (app-agnostic core), 0004 (tokens single source), 0005 (the catalogue),
0008 (density), 0015 (what the heart owns of a form — decision 3 superseded for
the date grid), 0022 (skin overlay), 0027 (overlay: layer, scrim and motion),
0035 (shakeable distribution).
