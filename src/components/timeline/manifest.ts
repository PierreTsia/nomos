import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la Timeline (ADR 0005). */
export const timelineManifest: ComponentManifest = {
  name: 'timeline',
  title: 'Frise',
  summary:
    "Une suite d'événements datés, du plus récent au plus ancien. Présentation seule : " +
    "l'ordre, la date formatée et le texte viennent de l'appelant.",
  level: 'bloc',
  example: {
    ariaLabel: 'Activité récente',
    items: [
      { id: 'a', at: '2026-10-01 09:12', label: 'sync health', detail: 'les deux produits, 0 gap' },
      { id: 'b', at: '2026-10-01 08:40', label: 'sync prs', detail: '3 PR routées' },
      { id: 'c', at: '2026-09-30 18:05', label: 'sync triage' },
    ],
  },
  variants: [],
  props: [
    {
      name: 'items',
      type: 'TimelineItem[]',
      required: true,
      check: 'accepted',
      description: "Les événements : `id`, `at` (date déjà formatée), `label`, `detail?`.",
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "Le nom accessible de la frise : le cœur n'a pas d'i18n.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du composant.",
    },
  ],
  usages: [
    {
      when: 'montrer une suite d’événements récents (synchronisations, déploiements)',
      use: '<Timeline items={events} ariaLabel={t.timeline.label} />',
      avoid: 'faire formater la date par le cœur : le format appartient à l’app',
    },
    {
      when: 'un seul événement, sans suite',
      use: 'une ligne simple, pas une frise',
      avoid: 'une frise d’un seul point, qui suggère une chronologie inexistante',
    },
  ],
}
