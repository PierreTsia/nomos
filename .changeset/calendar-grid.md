---
"@nomosui/react": minor
---

New brick: **`Calendar`** — a neutral, dependency-free single-month grid (ADR 0036,
superseding ADR 0015 decision 3 for the date grid).

- controlled `month`/`onMonthChange`, `selected`/`onSelect` (single);
- `weekStartsOn`, `isDateDisabled`, `modifiers` + `modifierClassNames`, `showOutsideDays`,
  `autoFocus`;
- full keyboard and ARIA built in (roving tabindex, arrows, Home/End, PageUp/Down,
  `grid`/`gridcell`, `aria-selected`/`aria-disabled`);
- **labels are injected already formatted** (`CalendarLabels`): the core carries no locale,
  no `Intl`, no date library, and uses local dates only.

A **composed date picker** (input + popover + validation) stays app-side: compose `Calendar`
with `Popover`. Range/multiple selection, multiple months, dropdowns and week numbers are
out of scope for v1 (non-breaking to add later).
