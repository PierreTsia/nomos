import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la Timeline (ADR 0005). */
export const timelineManifest: ComponentManifest = {
  name: 'timeline',
  title: 'Timeline',
  summary:
    "A series of dated events, from most recent to oldest. Presentation only: " +
    "the order, the formatted date and the text come from the caller.",
  level: 'bloc',
  example: {
    ariaLabel: 'Recent activity',
    items: [
      { id: 'a', at: '2026-10-01 09:12', label: 'sync health', detail: 'both products, 0 gap' },
      { id: 'b', at: '2026-10-01 08:40', label: 'sync prs', detail: '3 PRs routed' },
      {
        id: 'c',
        at: '2026-09-30 18:05',
        label: 'sync triage',
        state: 'past',
        stateLabel: 'past',
      },
    ],
  },
  variants: [],
  props: [
    {
      name: 'items',
      type: 'TimelineItem[]',
      required: true,
      check: 'accepted',
      description:
        "The events: `id`, `at` (already formatted date), `label`, `detail?`, " +
        "`state?` (`done` by default, `past` greyed out) and `stateLabel?` (the accessible " +
        "text of the state, required for `past` — color alone is not enough).",
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "The accessible name of the timeline: the core has no i18n.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the component's.",
    },
  ],
  usages: [
    {
      when: 'showing a series of recent events (syncs, deployments)',
      use: '<Timeline items={events} ariaLabel={t.timeline.label} />',
      avoid: 'making the core format the date: the format belongs to the app',
    },
    {
      when: 'a single event, without a series',
      use: 'a plain line, not a timeline',
      avoid: 'a timeline with a single point, which suggests a chronology that does not exist',
    },
    {
      when: 'marking a point as past',
      use: "state: 'past' with a stateLabel provided by the app (e.g. “past”)",
      avoid: 'relying on color alone: the point is aria-hidden, the state must be read',
    },
  ],
}
