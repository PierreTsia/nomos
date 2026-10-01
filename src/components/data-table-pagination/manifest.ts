import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la pagination (ADR 0005). Elle ne connaît pas TanStack, seulement des nombres. */
export const dataTablePaginationManifest: ComponentManifest = {
  name: 'data-table-pagination',
  title: 'DataTablePagination',
  summary:
    'Le choix de la taille de page et les bornes de navigation. Elle ne dépend pas de ' +
    "la table : page, bornes et rappels suffisent, donc elle se rend hors d'une table.",
  level: 'bloc',
  example: {
    page: 1,
    pageCount: 3,
    pageSize: 25,
    onPageSizeChange: () => {},
    onPrevious: () => {},
    onNext: () => {},
    canPrevious: false,
    canNext: true,
    rowsLabel: 'Lignes',
    pageOf: (page: number, total: number) => `${page} / ${total}`,
    previousLabel: 'Page précédente',
    nextLabel: 'Page suivante',
  },
  variants: [],
  props: [
    {
      name: 'rowsLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le libellé devant le sélecteur de taille de page.',
    },
    {
      name: 'pageOf',
      type: '(page: number, total: number) => string',
      required: true,
      check: 'rendered',
      description: 'Le formateur « page sur total », injecté par l’appelant.',
    },
    {
      name: 'previousLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le libellé d’accessibilité du bouton précédent.',
    },
    {
      name: 'nextLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'Le libellé d’accessibilité du bouton suivant.',
    },
    {
      name: 'page',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'La page courante, à partir de 1.',
    },
    {
      name: 'pageCount',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'Le nombre total de pages.',
    },
    {
      name: 'pageSize',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'Le nombre de lignes par page.',
    },
    {
      name: 'canPrevious',
      type: 'boolean',
      required: true,
      check: 'rendered',
      description: 'Vrai si une page précédente existe.',
    },
    {
      name: 'canNext',
      type: 'boolean',
      required: true,
      check: 'rendered',
      description: 'Vrai si une page suivante existe.',
    },
    {
      name: 'onPageSizeChange',
      type: '(size: number) => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel de changement de taille de page.',
    },
    {
      name: 'onPrevious',
      type: '() => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel de navigation vers la page précédente.',
    },
    {
      name: 'onNext',
      type: '() => void',
      required: true,
      check: 'accepted',
      description: 'Le rappel de navigation vers la page suivante.',
    },
  ],
  usages: [
    {
      when: 'naviguer dans une liste paginée',
      use: '<DataTablePagination page={…} pageCount={…} onNext={…} … />',
      avoid: 'lui passer une table : elle n’a besoin que des nombres et des rappels',
    },
  ],
}
