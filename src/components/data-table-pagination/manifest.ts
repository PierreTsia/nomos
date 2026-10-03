import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la pagination (ADR 0005). Elle ne connaît pas TanStack, seulement des nombres. */
export const dataTablePaginationManifest: ComponentManifest = {
  name: 'data-table-pagination',
  title: 'DataTablePagination',
  summary:
    'The page size choice and the navigation bounds. It does not depend on ' +
    "the table: page, bounds and callbacks are enough, so it renders outside a table.",
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
    rowsLabel: 'Rows',
    pageOf: (page: number, total: number) => `${page} / ${total}`,
    previousLabel: 'Previous page',
    nextLabel: 'Next page',
  },
  variants: [],
  props: [
    {
      name: 'rowsLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The label in front of the page size selector.',
    },
    {
      name: 'pageOf',
      type: '(page: number, total: number) => string',
      required: true,
      check: 'rendered',
      description: 'The "page of total" formatter, injected by the caller.',
    },
    {
      name: 'previousLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The accessibility label of the previous button.',
    },
    {
      name: 'nextLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The accessibility label of the next button.',
    },
    {
      name: 'page',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'The current page, starting at 1.',
    },
    {
      name: 'pageCount',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'The total number of pages.',
    },
    {
      name: 'pageSize',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'The number of rows per page.',
    },
    {
      name: 'canPrevious',
      type: 'boolean',
      required: true,
      check: 'rendered',
      description: 'True if a previous page exists.',
    },
    {
      name: 'canNext',
      type: 'boolean',
      required: true,
      check: 'rendered',
      description: 'True if a next page exists.',
    },
    {
      name: 'onPageSizeChange',
      type: '(size: number) => void',
      required: true,
      check: 'accepted',
      description: 'The page size change callback.',
    },
    {
      name: 'onPrevious',
      type: '() => void',
      required: true,
      check: 'accepted',
      description: 'The callback to navigate to the previous page.',
    },
    {
      name: 'onNext',
      type: '() => void',
      required: true,
      check: 'accepted',
      description: 'The callback to navigate to the next page.',
    },
  ],
  usages: [
    {
      when: 'navigating a paginated list',
      use: '<DataTablePagination page={…} pageCount={…} onNext={…} … />',
      avoid: 'passing it a table: it only needs the numbers and the callbacks',
    },
  ],
}
