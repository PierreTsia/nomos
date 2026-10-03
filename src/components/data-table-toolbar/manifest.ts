import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la barre d'outils de table (ADR 0005). Aucun libellé propre au cœur. */
export const dataTableToolbarManifest: ComponentManifest = {
  name: 'data-table-toolbar',
  title: 'DataTableToolbar',
  summary:
    'The search, the facets, the column management and the displayed count of a table. ' +
    "It knows neither the app's i18n nor its query-params: state and labels are injected.",
  level: 'bloc',
  example: {
    globalFilter: '',
    onGlobalFilterChange: () => {},
    placeholder: 'search',
    facets: [],
    shownLabel: '0 / 0',
    canReset: true,
    resetLabel: 'Reset',
    clearFacetLabel: 'Clear',
    onReset: () => {},
    columns: {
      label: 'Columns',
      clearLabel: 'Show all',
      options: [{ id: 'name', label: 'name', visible: true }],
      onToggle: () => {},
    },
  },
  variants: [],
  props: [
    {
      name: 'placeholder',
      type: 'string',
      required: true,
      check: 'attribute',
      description: "The search field's placeholder text.",
    },
    {
      name: 'shownLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The displayed count, already formatted by the caller.',
    },
    {
      name: 'resetLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The label of the button that clears filters and search.',
    },
    {
      name: 'canReset',
      type: 'boolean',
      required: true,
      check: 'rendered',
      description: 'True when there is a filter to clear: the button then appears.',
    },
    {
      name: 'facets',
      type: 'Facet[]',
      required: true,
      check: 'accepted',
      description: 'The bound facets (value, options, selection, callback).',
    },
    {
      name: 'globalFilter',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The current search term, controlled by the caller.',
    },
    {
      name: 'onGlobalFilterChange',
      type: '(value: string) => void',
      required: true,
      check: 'accepted',
      description: 'The search field input callback.',
    },
    {
      name: 'clearFacetLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: "The clear label passed to each facet filter.",
    },
    {
      name: 'onReset',
      type: '() => void',
      required: true,
      check: 'accepted',
      description: 'The reset button callback.',
    },
    {
      name: 'columns',
      type: '{ label: string; clearLabel: string; options: DataTableColumnOption[]; onToggle(id: string, visible: boolean): void; onMove?(id: string, direction: number): void; moveUpLabel?(label: string): string; moveDownLabel?(label: string): string }',
      required: false,
      check: 'accepted',
      description:
        "The column management: menu label, hideable columns, visibility toggle and (provided) up/down movement. Absent, no menu.",
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Additional actions placed to the right of the toolbar.',
    },
  ],
  usages: [
    {
      when: "placing a table's search and facets",
      use: '<DataTableToolbar … labels injected />',
      avoid: 'reading a query-param in the core: the state belongs to the caller',
    },
    {
      when: 'letting columns be hidden/shown again',
      use: 'the `columns` prop (list + callback); when absent, no menu',
      avoid: 'deciding in the core which columns are hideable: the list comes from the app',
    },
  ],
}
