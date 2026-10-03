import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du filtre à facettes (ADR 0005). Les options, la sélection et les
 * libellés sont injectés : c'est ce qui l'importe hors d'une table.
 */
export const facetFilterManifest: ComponentManifest = {
  name: 'facet-filter',
  title: 'FacetFilter',
  summary:
    "A multi-select menu on a facet: each option carries its count, and the " +
    'selection accumulates. Nothing comes from the app — options, selection and the “clear” label are injected.',
  level: 'primitive',
  example: {
    label: 'repository',
    options: [
      { value: 'workout-app', label: 'workout-app', count: 3 },
      { value: 'mijote', label: 'mijote', count: 1 },
    ],
    selected: ['workout-app'],
    onChange: () => {},
    clearLabel: 'Clear',
  },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The facet name, carried by the trigger.',
    },
    {
      name: 'options',
      type: 'FacetOption[]',
      required: true,
      check: 'accepted',
      description: 'The filterable values, each with its label and count.',
    },
    {
      name: 'selected',
      type: 'string[]',
      required: true,
      check: 'accepted',
      description: 'The already-selected values; the count is shown on the trigger.',
    },
    {
      name: 'onChange',
      type: '(next: string[]) => void',
      required: true,
      check: 'accepted',
      description: 'The selection callback: the full list of selected values.',
    },
    {
      name: 'clearLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: "The label of the entry that clears the selection (the core has no i18n).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged onto the trigger.",
    },
  ],
  usages: [
    {
      when: 'filter a list by one of its dimensions',
      use: '<FacetFilter label="repository" options={…} selected={…} onChange={…} clearLabel={…} />',
      avoid: 'hardcoding a product facet into the core: the options are app data',
    },
    {
      when: 'filter something other than a table (a card, a list)',
      use: 'the same atom, with the options from the source',
      avoid: 'coupling it to a query param: the selection state belongs to the caller',
    },
  ],
}
