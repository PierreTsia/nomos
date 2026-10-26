import { Badge, FacetedDataTable } from '@nomosui/react'
import type { DataTableFeatures, DataTableLabels, FacetDef } from '@nomosui/react'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

import { Page } from '../components/page'
import { items, type Item, type ItemStatus } from '../data'

const labels: DataTableLabels = {
  search: 'Search items…',
  reset: 'Reset',
  clear: 'Clear',
  empty: 'No items match.',
  unit: 'items',
  shown: (shown, total, unit) => `${shown} of ${total} ${unit}`,
  rows: 'Rows',
  pageOf: (page, total) => `Page ${page} of ${total}`,
  previous: 'Previous',
  next: 'Next',
}

const statusVariant: Record<ItemStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  archived: 'outline',
}

const renderColumns = (): ColumnDef<DataTableFeatures, Item>[] => [
  {
    id: 'name',
    accessorFn: (row) => row.name,
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: 'status',
    accessorFn: (row) => row.status,
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
    filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id)),
  },
  { id: 'updated', accessorFn: (row) => row.updated, header: 'Updated' },
]

const globalFilterFn: FilterFn<DataTableFeatures, Item> = (row, _id, value) =>
  row.original.name.toLowerCase().includes(String(value).toLowerCase())

const statuses: ItemStatus[] = ['active', 'draft', 'archived']

const facets: FacetDef[] = [
  {
    id: 'status',
    label: 'Status',
    options: statuses.map((status) => ({
      value: status,
      label: status,
      count: items.filter((item) => item.status === status).length,
    })),
  },
]

export function ItemsPage() {
  return (
    <Page title="Items" description="Filter, sort and page a faceted table.">
      <FacetedDataTable
        data={items}
        renderColumns={renderColumns}
        facets={facets}
        globalFilterFn={globalFilterFn}
        labels={labels}
        rowKey={(row) => row.id}
      />
    </Page>
  )
}
