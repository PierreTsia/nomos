import { Fragment, useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  flexRender,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type FilterFn,
  type RowData,
  type SortingState,
  type Updater,
} from '@tanstack/react-table'

import { DataTablePagination } from '@nomos/components/data-table-pagination/data-table-pagination'
import { DataTableToolbar } from '@nomos/components/data-table-toolbar/data-table-toolbar'
import type { Facet, FacetOption } from '@nomos/components/facet-filter/facet-filter'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nomos/components/table/table'
import { Button } from '@nomos/components/button/button'
import { dataTableFeatures, type DataTableFeatures } from '@nomos/features/data-table-features'
import { Sheet, SheetContent } from '@nomos/components/sheet/sheet'

/**
 * La coquille de table à facettes : barre d'outils, corps trié/paginé, sélection
 * optionnelle, détail de ligne optionnel. C'est une **feature** (ADR 0010), pas un
 * atome : elle porte le comportement — dont le fait qu'une ligne ouvre un détail, et son
 * placement (surcouche ou en ligne) — quand l'app fournit les colonnes, les facettes et
 * le **contenu** (du détail comme des actions de masse).
 *
 * **Contrôlable** (ADR 0014) : sans `state`, elle garde son état interne ; avec `state` +
 * `onStateChange`, l'app est la source de vérité — c'est par là que la synchro URL passe,
 * sans que le cœur connaisse react-router.
 */
export type FacetDef = { id: string; label: string; options: FacetOption[] }

export type DataTableLabels = {
  search: string
  reset: string
  clear: string
  empty: string
  unit: string
  shown: (shown: number, total: number, unit: string) => string
  rows: string
  pageOf: (page: number, total: number) => string
  previous: string
  next: string
}

/**
 * L'état d'une table, tel qu'on peut le contrôler de l'extérieur. `openedKey` est la clé
 * (fournie par `rowKey`) de la ligne dont le détail est ouvert, ou `null` ; `selection`
 * est la liste des clés sélectionnées.
 */
export type TableState = {
  sorting: SortingState
  globalFilter: string
  columnFilters: ColumnFiltersState
  pagination: { pageIndex: number; pageSize: number }
  openedKey: string | null
  selection: string[]
  columnVisibility: ColumnVisibilityState
  columnOrder: string[]
}

/** La clé stable d'une ligne (pour l'URL, le détail partageable, la sélection). */
export type RowKey<T> = (row: T) => string

/**
 * Le détail d'une ligne : la coquille possède le placement, l'app le contenu. `overlay`
 * ouvre une surcouche (défaut), `inline` déplie la ligne.
 */
export type RowDetail<T> = {
  placement?: 'overlay' | 'inline'
  render: (row: T) => ReactNode
}

/**
 * La sélection de lignes : la coquille possède les cases et la barre, l'app fournit le
 * **contenu** de la barre d'actions de masse et ses libellés.
 */
export type RowSelection<T> = {
  bulkActions?: (selected: T[]) => ReactNode
  selectAllLabel: string
  selectRowLabel: (row: T) => string
  selectedLabel: (count: number) => string
  clearLabel: string
}

/**
 * La gestion des colonnes : la coquille possède le menu et l'état de visibilité, l'app
 * fournit la liste des colonnes masquables et leurs libellés.
 */
export type ColumnManager = {
  label: string
  clearLabel: string
  columns: { id: string; label: string }[]
  moveUpLabel: (label: string) => string
  moveDownLabel: (label: string) => string
}

function resolve<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(previous) : updater
}

function SelectionCheckbox({
  checked,
  indeterminate = false,
  label,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      ref={(node) => {
        if (node) node.indeterminate = indeterminate
      }}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}

export function FacetedDataTable<T extends RowData>({
  data,
  renderColumns,
  facets,
  globalFilterFn,
  labels,
  detail,
  selection,
  columnManager,
  rowKey,
  state,
  onStateChange,
  actions,
}: {
  data: T[]
  renderColumns: (openDetail: (row: T) => void) => ColumnDef<DataTableFeatures, T>[]
  facets: FacetDef[]
  globalFilterFn: FilterFn<DataTableFeatures, T>
  labels: DataTableLabels
  detail?: RowDetail<T>
  selection?: RowSelection<T>
  columnManager?: ColumnManager
  rowKey?: RowKey<T>
  state?: TableState
  onStateChange?: (next: TableState) => void
  actions?: ReactNode
}) {
  const placement = detail?.placement ?? 'overlay'
  const controlled = state !== undefined

  const keyOf = useCallback(
    (row: T) => (rowKey ? rowKey(row) : String(data.indexOf(row))),
    [rowKey, data],
  )

  const [internal, setInternal] = useState<TableState>(() => ({
    sorting: [],
    globalFilter: '',
    columnFilters: [],
    pagination: { pageIndex: 0, pageSize: 25 },
    openedKey: null,
    selection: [],
    columnVisibility: {},
    columnOrder: [],
  }))
  const current = state ?? internal
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const update = useCallback(
    (patch: Partial<TableState>) => {
      const next = { ...current, ...patch }
      if (controlled) onStateChange?.(next)
      else setInternal(next)
    },
    [controlled, current, onStateChange],
  )

  const resetPerPage = (patch: Partial<TableState>) =>
    update({ ...patch, pagination: { ...current.pagination, pageIndex: 0 } })

  const openDetail = useCallback(
    (row: T) => {
      const key = keyOf(row)
      if (placement === 'inline') {
        update({ openedKey: current.openedKey === key ? null : key })
      } else {
        update({ openedKey: key })
      }
    },
    [current.openedKey, keyOf, placement, update],
  )

  const baseColumns = useMemo(() => renderColumns(openDetail), [renderColumns, openDetail])

  const toggleRow = (key: string) =>
    update({
      selection: current.selection.includes(key)
        ? current.selection.filter((selected) => selected !== key)
        : [...current.selection, key],
    })

  const selectedRows = data.filter((row) => current.selection.includes(keyOf(row)))

  const selectionColumn = useMemo<ColumnDef<DataTableFeatures, T>>(
    () => ({
      id: '__select__',
      enableSorting: false,
      enableGlobalFilter: false,
      header: () => null,
      cell: ({ row }) => (
        <SelectionCheckbox
          checked={current.selection.includes(keyOf(row.original))}
          label={selection?.selectRowLabel(row.original) ?? ''}
          onChange={() => toggleRow(keyOf(row.original))}
        />
      ),
    }),
    // `toggleRow`/`keyOf` sont utilisés dans les rendus ; la colonne se recalcule avec l'état.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selection, current.selection, keyOf],
  )

  const orderedBase = useMemo(() => {
    const order = current.columnOrder
    return [...baseColumns].sort((a, b) => {
      const ai = order.indexOf(String(a.id))
      const bi = order.indexOf(String(b.id))
      const rankA = ai === -1 ? Number.POSITIVE_INFINITY : ai
      const rankB = bi === -1 ? Number.POSITIVE_INFINITY : bi
      return rankA - rankB
    })
  }, [baseColumns, current.columnOrder])

  const orderedIds = orderedBase.map((column) => String(column.id))

  const moveColumn = (id: string, direction: -1 | 1) => {
    const from = orderedIds.indexOf(id)
    const to = from + direction
    if (from === -1 || to < 0 || to >= orderedIds.length) return
    const next = [...orderedIds]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved as string)
    update({ columnOrder: next })
  }

  const moveColumnBefore = (draggedId: string, targetId: string) => {
    const from = orderedIds.indexOf(draggedId)
    const to = orderedIds.indexOf(targetId)
    if (from === -1 || to === -1 || from === to) return
    const next = [...orderedIds]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved as string)
    update({ columnOrder: next })
  }

  const columns = useMemo(
    () => (selection ? [selectionColumn, ...orderedBase] : orderedBase),
    [selection, selectionColumn, orderedBase],
  )

  // Le tri par défaut est porté par la colonne (`meta.defaultSort`), jamais par le cœur ;
  // il sert de repli quand l'appelant ne fournit aucun tri (URL sans `sort`).
  const defaultSorting = useMemo<SortingState>(
    () =>
      columns.flatMap((column) =>
        column.id && column.meta?.defaultSort
          ? [{ id: column.id, desc: column.meta.defaultSort === 'desc' }]
          : [],
      ),
    [columns],
  )
  const sorting = current.sorting.length ? current.sorting : defaultSorting

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: {
      sorting,
      globalFilter: current.globalFilter,
      columnFilters: current.columnFilters,
      pagination: current.pagination,
      columnVisibility: current.columnVisibility,
    },
    onSortingChange: (updater) => resetPerPage({ sorting: resolve(updater, current.sorting) }),
    onGlobalFilterChange: (updater) =>
      resetPerPage({ globalFilter: resolve(updater, current.globalFilter) }),
    onColumnFiltersChange: (updater) =>
      resetPerPage({ columnFilters: resolve(updater, current.columnFilters) }),
    onPaginationChange: (updater) => update({ pagination: resolve(updater, current.pagination) }),
    onColumnVisibilityChange: (updater) =>
      update({ columnVisibility: resolve(updater, current.columnVisibility) }),
    globalFilterFn,
  })

  const selectedFor = (id: string) =>
    (current.columnFilters.find((filter) => filter.id === id)?.value as string[] | undefined) ?? []

  const setFacet = (id: string, values: string[]) =>
    resetPerPage({
      columnFilters: [
        ...current.columnFilters.filter((filter) => filter.id !== id),
        ...(values.length ? [{ id, value: values }] : []),
      ],
    })

  const boundFacets: Facet[] = facets.map(({ id, label, options }) => ({
    id,
    label,
    options,
    selected: selectedFor(id),
    onChange: (next) => setFacet(id, next),
  }))

  const rows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length
  const columnCount = columns.length
  const canReset = current.globalFilter.length > 0 || current.columnFilters.length > 0
  const rowClick = detail ? (row: T) => openDetail(row) : undefined
  const openedRow =
    current.openedKey == null ? null : data.find((row) => keyOf(row) === current.openedKey) ?? null

  const filteredKeys = table
    .getFilteredRowModel()
    .rows.map((row) => keyOf(row.original))
  const allSelected = filteredKeys.length > 0 && filteredKeys.every((key) => current.selection.includes(key))
  const someSelected = filteredKeys.some((key) => current.selection.includes(key))
  const toggleAll = () =>
    update({
      selection: allSelected
        ? current.selection.filter((key) => !filteredKeys.includes(key))
        : [...new Set([...current.selection, ...filteredKeys])],
    })

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        globalFilter={current.globalFilter}
        onGlobalFilterChange={(value) => resetPerPage({ globalFilter: value })}
        placeholder={labels.search}
        facets={boundFacets}
        shownLabel={labels.shown(filteredCount, data.length, labels.unit)}
        canReset={canReset}
        resetLabel={labels.reset}
        clearFacetLabel={labels.clear}
        onReset={() => resetPerPage({ globalFilter: '', columnFilters: [] })}
        columns={
          columnManager
            ? {
                label: columnManager.label,
                clearLabel: columnManager.clearLabel,
                options: [...columnManager.columns]
                  .sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
                  .map((column) => ({
                    ...column,
                    visible: current.columnVisibility[column.id] !== false,
                  })),
                onToggle: (id, visible) =>
                  update({ columnVisibility: { ...current.columnVisibility, [id]: visible } }),
                onMove: moveColumn,
                moveUpLabel: columnManager.moveUpLabel,
                moveDownLabel: columnManager.moveDownLabel,
              }
            : undefined
        }
        actions={actions}
      />

      {selection && selectedRows.length ? (
        <div className="flex flex-wrap items-center gap-3 rounded-md border bg-muted/30 px-3 py-2 text-xs">
          <span className="font-medium">{selection.selectedLabel(selectedRows.length)}</span>
          <div className="flex flex-wrap items-center gap-2">
            {selection.bulkActions?.(selectedRows)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8"
            onClick={() => update({ selection: [] })}
          >
            {selection.clearLabel}
          </Button>
        </div>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap"
                    draggable={Boolean(columnManager) && header.column.id !== '__select__'}
                    onDragStart={
                      columnManager
                        ? () => setDraggingId(String(header.column.id))
                        : undefined
                    }
                    onDragOver={columnManager ? (event) => event.preventDefault() : undefined}
                    onDrop={
                      columnManager
                        ? () => {
                            if (draggingId) moveColumnBefore(draggingId, String(header.column.id))
                            setDraggingId(null)
                          }
                        : undefined
                    }
                  >
                    {header.column.id === '__select__' ? (
                      <SelectionCheckbox
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        label={selection?.selectAllLabel ?? ''}
                        onChange={toggleAll}
                      />
                    ) : header.isPlaceholder ? null : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    onClick={rowClick ? () => rowClick(row.original) : undefined}
                    className={rowClick ? 'cursor-pointer' : undefined}
                    data-selected={current.selection.includes(keyOf(row.original)) || undefined}
                  >
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {placement === 'inline' && current.openedKey === keyOf(row.original) && detail ? (
                    <TableRow>
                      <TableCell colSpan={columnCount} className="bg-muted/30">
                        {detail.render(row.original)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {labels.empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={table.getPageCount() === 0 ? 0 : current.pagination.pageIndex + 1}
        pageCount={table.getPageCount()}
        pageSize={current.pagination.pageSize}
        onPageSizeChange={(size) => update({ pagination: { pageIndex: 0, pageSize: size } })}
        onPrevious={() =>
          update({
            pagination: {
              ...current.pagination,
              pageIndex: Math.max(0, current.pagination.pageIndex - 1),
            },
          })
        }
        onNext={() =>
          update({
            pagination: {
              ...current.pagination,
              pageIndex: Math.min(table.getPageCount() - 1, current.pagination.pageIndex + 1),
            },
          })
        }
        canPrevious={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        rowsLabel={labels.rows}
        pageOf={labels.pageOf}
        previousLabel={labels.previous}
        nextLabel={labels.next}
      />

      {placement === 'overlay' && detail ? (
        <Sheet
          open={current.openedKey != null}
          onOpenChange={(open) => update({ openedKey: open ? current.openedKey : null })}
        >
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
            {openedRow ? detail.render(openedRow) : null}
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  )
}
