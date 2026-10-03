import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de l'indicateur de fraîcheur (ADR 0005). L'âge est injecté par
 * l'appelant : c'est lui qui formate (« il y a 2 heures ») et qui décide du seuil de
 * péremption ; le cœur ne fait que le rendre.
 */
export const freshnessManifest: ComponentManifest = {
  name: 'freshness',
  title: 'Freshness',
  summary:
    "The age of a piece of data since its last update, with a dot that turns " +
    "red when it is stale. Renders on its own, outside a table: both a cell and a " +
    'provenance banner use it.',
  level: 'primitive',
  example: { label: '2 hours ago', stale: false },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: "The age already formatted by the caller: the core has no i18n.",
    },
    {
      name: 'stale',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: "True when the data exceeds the staleness threshold decided by the caller.",
    },
    {
      name: 'title',
      type: 'string | null',
      required: false,
      check: 'attribute',
      description: "The absolute timestamp, passed as an HTML tooltip.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
  ],
  usages: [
    {
      when: "a cell says how long ago a piece of data last moved",
      use: '<Freshness label={relativeTime(row.updated_at)} />',
      avoid: 'a bare `<span>`: the dot is the visual freshness marker',
    },
    {
      when: "a banner states the freshness of a snapshot",
      use: '<Freshness label={age} title={absolute} stale={olderThanADay} />',
      avoid: 'a staleness threshold in the core: it depends on the domain, not the rendering',
    },
  ],
}
