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
    "L'âge d'une donnée depuis sa dernière mise à jour, avec une pastille qui passe au " +
    "rouge quand elle est périmée. Se rend seule, hors d'une table : une cellule comme un " +
    'bandeau de provenance l’utilisent.',
  level: 'primitive',
  example: { label: 'il y a 2 heures', stale: false },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: "L'âge déjà formaté par l'appelant : le cœur n'a pas d'i18n.",
    },
    {
      name: 'stale',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: "Vrai quand la donnée dépasse le seuil de péremption décidé par l'appelant.",
    },
    {
      name: 'title',
      type: 'string | null',
      required: false,
      check: 'attribute',
      description: "L'horodatage absolu, transmis comme infobulle HTML.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
  ],
  usages: [
    {
      when: "une cellule dit depuis quand une donnée n'a pas bougé",
      use: '<Freshness label={relativeTime(row.updated_at)} />',
      avoid: 'un `<span>` nu : la pastille est le repère visuel de fraîcheur',
    },
    {
      when: "un bandeau dit la fraîcheur d'un instantané",
      use: '<Freshness label={age} title={absolute} stale={olderThanADay} />',
      avoid: 'un seuil de péremption dans le cœur : il dépend du domaine, pas du rendu',
    },
  ],
}
