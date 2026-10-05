import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Calendrier (ADR 0005, ADR 0036). La grille est une présentation :
 * les libellés sont injectés (le cœur n'a ni `Intl` ni i18n), les dates sont locales, et
 * la composition « picker » (input + popover + validation) reste chez l'app.
 */
export const calendarManifest: ComponentManifest = {
  name: 'calendar',
  title: 'Calendar',
  summary:
    'A single-month grid: a caption, previous/next navigation, a weekday header and day ' +
    'buttons. Prop-controlled and dependency-free; the labels are injected, so the core ' +
    'carries no locale. A composed date picker stays app-side.',
  level: 'primitive',
  example: {
    month: new Date(2026, 2, 1),
    onMonthChange: () => {},
    selected: new Date(2026, 2, 5),
    labels: {
      month: (month: Date) => `${month.getFullYear()}-${month.getMonth() + 1}`,
      day: (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      previous: 'Previous month',
      next: 'Next month',
    },
  },
  variants: [],
  props: [
    {
      name: 'month',
      type: 'Date',
      required: true,
      check: 'accepted',
      description: 'The displayed month (controlled).',
    },
    {
      name: 'onMonthChange',
      type: '(month: Date) => void',
      required: true,
      check: 'accepted',
      description: 'Called when the navigation asks for another month.',
    },
    {
      name: 'selected',
      type: 'Date',
      required: false,
      check: 'accepted',
      description: 'The selected day (controlled).',
    },
    {
      name: 'onSelect',
      type: '(date: Date) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user picks a day.',
    },
    {
      name: 'labels',
      type: 'CalendarLabels',
      required: true,
      check: 'accepted',
      description:
        'Already-formatted labels (month caption, day names, nav labels); the core has no locale.',
    },
    {
      name: 'weekStartsOn',
      type: 'number',
      required: false,
      check: 'accepted',
      description: 'The first day of the week: 0 (Sunday, default) or 1 (Monday).',
    },
    {
      name: 'isDateDisabled',
      type: '(date: Date) => boolean',
      required: false,
      check: 'accepted',
      description: 'A day the predicate rejects cannot be selected or focused.',
    },
    {
      name: 'modifiers',
      type: 'Record<string, (date: Date) => boolean>',
      required: false,
      check: 'accepted',
      description: 'Per-key predicates that mark days (a state, an event) without naming them.',
    },
    {
      name: 'modifierClassNames',
      type: 'Record<string, string>',
      required: false,
      check: 'accepted',
      description: 'The class stamped on the days a modifier matches.',
    },
    {
      name: 'showOutsideDays',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Show the days outside the month (greyed) instead of an empty cell.',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Focus the selected day (or the month start) on mount.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core ones.",
    },
  ],
  usages: [
    {
      when: 'choosing a single date',
      use: '`<Calendar />` inside the existing `Popover`',
      avoid:
        'a heart-owned date picker: the input, the popover and the validation stay app-side (ADR 0036)',
    },
    {
      when: 'showing activity over a month',
      use: '`modifiers` + `modifierClassNames` to stamp the days',
      avoid: 'hardcoding a per-day style: the marker is data, injected',
    },
    {
      when: 'the app knows its locale',
      use: 'pass already-formatted `labels`',
      avoid: 'expecting the core to know a locale or a timezone: it uses local dates only',
    },
  ],
}
