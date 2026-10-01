import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du filtre à facettes (ADR 0005). Les options, la sélection et les
 * libellés sont injectés : c'est ce qui l'importe hors d'une table.
 */
export const facetFilterManifest: ComponentManifest = {
  name: 'facet-filter',
  title: 'FacetFilter',
  summary:
    "Un menu à choix multiples sur une facette : chaque option porte son compte, et la " +
    'sélection se cumule. Rien ne vient de l’app — options, sélection et libellé « effacer » sont injectés.',
  level: 'primitive',
  example: {
    label: 'dépôt',
    options: [
      { value: 'workout-app', label: 'workout-app', count: 3 },
      { value: 'mijote', label: 'mijote', count: 1 },
    ],
    selected: ['workout-app'],
    onChange: () => {},
    clearLabel: 'Effacer',
  },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le nom de la facette, porté par le déclencheur.',
    },
    {
      name: 'options',
      type: 'FacetOption[]',
      required: true,
      check: 'accepted',
      description: 'Les valeurs filtrables, chacune avec son libellé et son compte.',
    },
    {
      name: 'selected',
      type: 'string[]',
      required: true,
      check: 'accepted',
      description: 'Les valeurs déjà retenues ; le compte s’affiche sur le déclencheur.',
    },
    {
      name: 'onChange',
      type: '(next: string[]) => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel de sélection : la liste complète des valeurs retenues.',
    },
    {
      name: 'clearLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: "Le libellé de l'entrée qui efface la sélection (le cœur n'a pas d'i18n).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées sur le déclencheur.",
    },
  ],
  usages: [
    {
      when: 'filtrer une liste par une de ses dimensions',
      use: '<FacetFilter label="dépôt" options={…} selected={…} onChange={…} clearLabel={…} />',
      avoid: 'coder une facette produit dans le cœur : les options sont des données d’app',
    },
    {
      when: 'filtrer autre chose qu’une table (une carte, une liste)',
      use: 'le même atome, avec les options de la source',
      avoid: 'le coupler à un query-param : l’état de sélection appartient à l’appelant',
    },
  ],
}
