import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la barre d'outils de table (ADR 0005). Aucun libellé propre au cœur. */
export const dataTableToolbarManifest: ComponentManifest = {
  name: 'data-table-toolbar',
  title: 'DataTableToolbar',
  summary:
    'La recherche, les facettes, la gestion des colonnes et le compte affiché d’une table. ' +
    "Elle ne connaît ni l'i18n de l'app ni ses query-params : état et libellés sont injectés.",
  level: 'bloc',
  example: {
    globalFilter: '',
    onGlobalFilterChange: () => {},
    placeholder: 'rechercher',
    facets: [],
    shownLabel: '0 / 0',
    canReset: true,
    resetLabel: 'Réinitialiser',
    clearFacetLabel: 'Effacer',
    onReset: () => {},
    columns: {
      label: 'Colonnes',
      clearLabel: 'Tout afficher',
      options: [{ id: 'name', label: 'nom', visible: true }],
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
      description: "Le texte d'invite du champ de recherche.",
    },
    {
      name: 'shownLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le compte affiché, déjà formaté par l’appelant.',
    },
    {
      name: 'resetLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le libellé du bouton qui efface filtres et recherche.',
    },
    {
      name: 'canReset',
      type: 'boolean',
      required: true,
      check: 'rendered',
      description: 'Vrai quand il y a un filtre à effacer : le bouton apparaît alors.',
    },
    {
      name: 'facets',
      type: 'Facet[]',
      required: true,
      check: 'accepted',
      description: 'Les facettes liées (valeur, options, sélection, rappel).',
    },
    {
      name: 'globalFilter',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'Le terme de recherche courant, contrôlé par l’appelant.',
    },
    {
      name: 'onGlobalFilterChange',
      type: '(value: string) => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel de saisie du champ de recherche.',
    },
    {
      name: 'clearFacetLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: "Le libellé d'effacement transmis à chaque filtre à facettes.",
    },
    {
      name: 'onReset',
      type: '() => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel du bouton de réinitialisation.',
    },
    {
      name: 'columns',
      type: '{ label: string; clearLabel: string; options: DataTableColumnOption[]; onToggle(id: string, visible: boolean): void; onMove?(id: string, direction: number): void; moveUpLabel?(label: string): string; moveDownLabel?(label: string): string }',
      required: false,
      check: 'accepted',
      description:
        "La gestion des colonnes : libellé du menu, colonnes masquables, bascule d'affichage et (fourni) déplacement haut/bas. Absente, aucun menu.",
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Des actions complémentaires posées à droite de la barre.',
    },
  ],
  usages: [
    {
      when: 'poser la recherche et les facettes d’une table',
      use: '<DataTableToolbar … labels injectés />',
      avoid: 'lire un query-param dans le cœur : l’état appartient à l’appelant',
    },
    {
      when: 'laisser masquer/réafficher des colonnes',
      use: 'la prop `columns` (liste + rappel) ; absente, pas de menu',
      avoid: 'décider dans le cœur quelles colonnes sont masquables : la liste vient de l’app',
    },
  ],
}
