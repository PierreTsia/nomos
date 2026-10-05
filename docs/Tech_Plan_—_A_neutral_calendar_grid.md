# Tech Plan — A neutral calendar grid

> Issue #112. Supersedes ADR 0015, decision 3 — new ADR
> `0036-the-heart-owns-a-neutral-calendar-grid.md`. Epic Brief:
> `Epic_Brief_—_A_neutral_calendar_grid.md`.

## Diagnosis

Both adopters vendor the same shadcn wrapper around `react-day-picker`; the library's
engine is unused (single month, no range, no min/max). The wrapper carries no date math
and no locale default. The only hard part is **accessibility**; the rest is plain
arithmetic on local `Date`.

## Decisions (locked before coding)

- **Single selection** only; `range` deferred (non-breaking later).
- Markers via `modifiers` (predicate per key) + `modifierClassNames`.
- `labels` injected, already formatted; **no** `Intl`/i18n in the core.
- Accessibility **hand-built, dependency-free**.
- v1 excludes multiple months, dropdown caption, week numbers.
- **No** composed `DatePicker` (popover/input/validation) — app-side.
- Adopter migrations are separate tickets.

## Public interface (deep module)

```ts
type CalendarLabels = {
  /** The caption, already localized, e.g. `March 2026`. */
  month: (month: Date) => string
  /** Seven weekday labels, already ordered to match `weekStartsOn`. */
  weekdays: readonly string[]
  /** Accessible labels for the two navigation buttons. */
  previous: string
  next: string
  /** Optional accessible name for the grid; defaults to `month(month)`. */
  grid?: string
}

type CalendarProps = {
  month: Date
  onMonthChange: (month: Date) => void
  selected?: Date
  onSelect?: (date: Date) => void
  weekStartsOn?: 0 | 1 // Sunday (default) or Monday
  isDateDisabled?: (date: Date) => boolean
  modifiers?: Record<string, (date: Date) => boolean>
  modifierClassNames?: Record<string, string>
  showOutsideDays?: boolean
  labels: CalendarLabels
  autoFocus?: boolean
  className?: string
}
```

`mode`/range, multiple months and the popover composition are **not** in the surface.

## Internal design

- `src/components/calendar/date.ts` — pure, dependency-free, unit-tested helpers:
  `startOfMonth`, `endOfMonth`, `addDays`, `addMonths`, `isSameDay`, `isSameMonth`,
  `startOfWeek(date, weekStartsOn)`, `dayKey(date)` (local `YYYY-MM-DD`),
  `monthMatrix(month, weekStartsOn, showOutsideDays): Date[][]`.
  **Local time only**: a day is bucketed by its local Y/M/D; the core never converts to
  UTC (the app owns timezone anchoring).
- `src/components/calendar/calendar.tsx` — the grid. Roving-tabindex focus kept in a
  `focused` state; after navigation, focus the button `[data-day=<key>]` via a ref.
  Keyboard on the day button: `ArrowLeft/Right` (±1 day), `ArrowUp/Down` (±7),
  `Home/End` (week start/end), `PageUp/PageDown` (±1 month). Moving outside the visible
  month calls `onMonthChange`.
- ARIA: `<table role="grid">`, `<tr role="row">`, `<th scope="col">`, `<td
  role="gridcell">`, day `<button>` with `aria-selected` / `aria-disabled` / `disabled`,
  caption `role="status" aria-live="polite"`, nav buttons `aria-label`.
- Styling from tokens only (`text-*`, `bg-*`, `size-*`, `--spacing`); no fixed length
  (ADR 0008). RTL: the layout is logical (grid handles it).

## Slices

0. **ADR 0036** — supersedes ADR 0015 dec. 3, records the scope (grid, not picker) and
   the no-dependency / injected-labels boundary.
1. **Grid skeleton** — `monthMatrix` + caption + weekday header + day buttons +
   `grid`/`gridcell` roles + outside days + `labels`; a day renders selected.
2. **Navigation** — prev/next, roving tabindex, arrows / Home / End / PageUp / PageDown,
   `onMonthChange` on crossing.
3. **Selection & disabled** — `selected`/`onSelect`, `aria-selected`, `isDateDisabled`
   → `disabled` + `aria-disabled`.
4. **Markers** — `modifiers` + `modifierClassNames`.
5. **The net** — `manifest.ts`, `registry.ts`, MCP view (`build:view`/`build:view-css`),
   `SKILL.md`, changeset, and the drift gates.

## Verification

- `npm test` (new `calendar.test.tsx` + `date.test.ts`), `npm run lint`,
  `npm run typecheck`.
- `npm run view:check` / `view-css:check` / `surface:check` after replaying generators.
- `npm run build:package` · `size:check` · `smoke:consumer`.

## Risks

| Risk | Mitigation |
|---|---|
| a11y parity with the library | Boundary tests: roles (`grid`/`gridcell`), `aria-selected`, full keyboard matrix, disabled. |
| Timezone | Operate on local `Date`; bucket by local Y/M/D; documented — no UTC normalization. |
| Focus in jsdom | Roving tabindex asserted via `tabIndex`; navigation asserted via `document.activeElement`. |
| Marketing an abstraction nobody wants | Two real adopters already vendor the same widget; the interface is the wrapper's used subset. |

## Migration (separate tickets, later)

Each adopter deletes its vendored wrapper, drops the date library, and composes
`Calendar` (with the existing `Popover` where a picker is needed). Not in this epic.
