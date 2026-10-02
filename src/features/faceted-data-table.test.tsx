import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

import type { DataTableFeatures } from '@nomos/features/data-table-features'
import {
  FacetedDataTable,
  type DataTableLabels,
  type TableState,
} from '@nomos/features/faceted-data-table'

type Row = { id: string; name: string }

const data: Row[] = [
  { id: 'a', name: 'alpha' },
  { id: 'b', name: 'beta' },
]

const renderColumns = (): ColumnDef<DataTableFeatures, Row>[] => [
  { id: 'name', accessorFn: (row) => row.name, header: 'nom', cell: ({ row }) => row.original.name },
]

const globalFilterFn: FilterFn<DataTableFeatures, Row> = (row, _id, value) =>
  row.original.name.includes(String(value))

const labels: DataTableLabels = {
  search: 'rechercher',
  reset: 'Réinitialiser',
  clear: 'Effacer',
  empty: 'vide',
  unit: 'lignes',
  shown: (shown, total, unit) => `${shown}/${total} ${unit}`,
  rows: 'Lignes',
  pageOf: (page, total) => `${page}/${total}`,
  previous: 'Précédent',
  next: 'Suivant',
}

function renderTable(
  detail?: { placement?: 'overlay' | 'inline'; render: (row: Row) => React.ReactNode },
) {
  return render(
    <FacetedDataTable
      data={data}
      renderColumns={renderColumns}
      facets={[]}
      globalFilterFn={globalFilterFn}
      labels={labels}
      detail={detail}
    />,
  )
}

/**
 * La coquille possède le placement du détail (ADR 0010) : l'app ne fournit que le
 * contenu. Elle doit donc savoir faire les deux, sans aucun provider d'app.
 */
describe('FacetedDataTable — le détail de ligne', () => {
  it('ouvre une surcouche par défaut', async () => {
    const user = userEvent.setup()
    renderTable({ render: (row) => <p>détail de {row.name}</p> })

    await user.click(screen.getByText('alpha'))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('détail de alpha')).toBeInTheDocument()
  })

  it('déplie la ligne en placement « en ligne », sans surcouche', async () => {
    const user = userEvent.setup()
    renderTable({ placement: 'inline', render: (row) => <p>détail de {row.name}</p> })

    expect(screen.queryByText('détail de alpha')).not.toBeInTheDocument()

    await user.click(screen.getByText('alpha'))

    expect(screen.getByText('détail de alpha')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

const emptyState: TableState = {
  sorting: [],
  globalFilter: '',
  columnFilters: [],
  pagination: { pageIndex: 0, pageSize: 25 },
  openedKey: null,
  selection: [],
  columnVisibility: {},
  columnOrder: [],
}

function ControlledTable({ initial }: { initial?: Partial<TableState> }) {
  const [state, setState] = useState<TableState>({ ...emptyState, ...initial })
  return (
    <FacetedDataTable
      data={data}
      renderColumns={renderColumns}
      facets={[]}
      globalFilterFn={globalFilterFn}
      labels={labels}
      rowKey={(row) => row.id}
      state={state}
      onStateChange={setState}
      detail={{ render: (row) => <p>détail de {row.name}</p> }}
    />
  )
}

/**
 * La coquille est **contrôlable** (ADR 0014) : quand l'app fournit `state` +
 * `onStateChange`, c'est elle la source de vérité — c'est par là que la synchro URL
 * passera, sans que le cœur connaisse react-router.
 */
describe('FacetedDataTable — l’état contrôlé', () => {
  it('applique l’état fourni et remonte les changements', async () => {
    const user = userEvent.setup()
    render(<ControlledTable initial={{ globalFilter: 'alpha' }} />)

    // Le filtre fourni est appliqué dès le premier rendu.
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.queryByText('beta')).not.toBeInTheDocument()

    // Effacer la recherche remonte un état vidé.
    await user.click(screen.getByRole('button', { name: /Réinitialiser/ }))

    expect(screen.getByText('beta')).toBeInTheDocument()
  })

  it('ouvre le détail depuis `openedKey`, donc une ligne partageable par URL', async () => {
    render(<ControlledTable initial={{ openedKey: 'b' }} />)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('détail de beta')).toBeInTheDocument()
  })

  it('garde la page quand l’état contrôlé est relu (pas de retour page 1)', async () => {
    const user = userEvent.setup()
    render(<ControlledTable initial={{ pagination: { pageIndex: 0, pageSize: 1 } }} />)

    expect(screen.getByText('1/2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Suivant' }))

    expect(screen.getByText('2/2')).toBeInTheDocument()
  })
})

const selection = {
  selectAllLabel: 'tout',
  selectRowLabel: (row: Row) => `ligne ${row.name}`,
  selectedLabel: (count: number) => `${count} sélectionnée(s)`,
  clearLabel: 'Tout désélectionner',
  bulkActions: (rows: Row[]) => <button type="button">agir {rows.length}</button>,
}

function renderSelectionTable() {
  return render(
    <FacetedDataTable
      data={data}
      renderColumns={renderColumns}
      facets={[]}
      globalFilterFn={globalFilterFn}
      labels={labels}
      rowKey={(row) => row.id}
      selection={selection}
    />,
  )
}

/**
 * La sélection de lignes : la coquille possède les cases et la barre, l'app fournit le
 * contenu des actions de masse et ses libellés.
 */
describe('FacetedDataTable — la sélection de lignes', () => {
  it('sélectionne une ligne et affiche la barre d’actions fournie', async () => {
    const user = userEvent.setup()
    renderSelectionTable()

    await user.click(screen.getByRole('checkbox', { name: 'ligne alpha' }))

    expect(screen.getByText('1 sélectionnée(s)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'agir 1' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tout désélectionner' }))
    expect(screen.queryByText('1 sélectionnée(s)')).not.toBeInTheDocument()
  })

  it('sélectionne tout ce qui est filtré depuis l’en-tête', async () => {
    const user = userEvent.setup()
    renderSelectionTable()

    await user.click(screen.getByRole('checkbox', { name: 'tout' }))

    expect(screen.getByText('2 sélectionnée(s)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'agir 2' })).toBeInTheDocument()
  })
})

/** La gestion des colonnes : la coquille possède le menu et l'état, l'app la liste. */
describe('FacetedDataTable — les colonnes', () => {
  const twoColumns = (): ColumnDef<DataTableFeatures, Row>[] => [
    { id: 'name', accessorFn: (row) => row.name, header: 'nom', cell: ({ row }) => row.original.name },
    { id: 'id', accessorFn: (row) => row.id, header: 'id', cell: ({ row }) => row.original.id },
  ]

  const manager = {
    label: 'Colonnes',
    clearLabel: 'Tout afficher',
    moveUpLabel: (label: string) => `haut ${label}`,
    moveDownLabel: (label: string) => `bas ${label}`,
    columns: [
      { id: 'name', label: 'nom' },
      { id: 'id', label: 'id' },
    ],
  }

  function renderTwoColumns() {
    return render(
      <FacetedDataTable
        data={data}
        renderColumns={twoColumns}
        facets={[]}
        globalFilterFn={globalFilterFn}
        labels={labels}
        columnManager={manager}
      />,
    )
  }

  const headerNames = () =>
    Array.from(document.querySelectorAll('thead th')).map((header) => header.textContent)

  it('masque une colonne depuis le menu', async () => {
    const user = userEvent.setup()
    render(
      <FacetedDataTable
        data={data}
        renderColumns={renderColumns}
        facets={[]}
        globalFilterFn={globalFilterFn}
        labels={labels}
        columnManager={{ ...manager, columns: [{ id: 'name', label: 'nom' }] }}
      />,
    )

    expect(screen.getByText('alpha')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Colonnes/ }))
    await user.click(await screen.findByRole('menuitem', { name: /nom/ }))

    await waitFor(() => expect(screen.queryByRole('columnheader', { name: 'nom' })).not.toBeInTheDocument())
  })

  it('réordonne une colonne au clavier (boutons du menu)', async () => {
    const user = userEvent.setup()
    renderTwoColumns()

    expect(headerNames()).toEqual(['nom', 'id'])

    await user.click(screen.getByRole('button', { name: /Colonnes/ }))
    await user.click(await screen.findByRole('button', { name: 'haut id' }))

    await waitFor(() => expect(headerNames()).toEqual(['id', 'nom']))
  })

  it('réordonne une colonne par glisser', async () => {
    renderTwoColumns()
    const [nom, id] = screen.getAllByRole('columnheader')

    fireEvent.dragStart(id as HTMLElement)
    fireEvent.drop(nom as HTMLElement)

    await waitFor(() => expect(headerNames()).toEqual(['id', 'nom']))
  })
})
