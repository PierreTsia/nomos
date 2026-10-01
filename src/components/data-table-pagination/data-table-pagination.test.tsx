import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  DataTablePagination,
  type DataTablePaginationProps,
} from '@nomos/components/data-table-pagination/data-table-pagination'

function renderPagination(over: Partial<DataTablePaginationProps> = {}) {
  const props: DataTablePaginationProps = {
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
    ...over,
  }
  return render(<DataTablePagination {...props} />)
}

/** La pagination se rend seule, sans table et sans provider d'app. */
describe('DataTablePagination', () => {
  it('renders the page, the size and the bounds, without any application provider', () => {
    renderPagination()

    expect(screen.getByText('Lignes')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page précédente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Page suivante' })).toBeEnabled()
  })

  it('fires onNext', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    renderPagination({ onNext })

    await user.click(screen.getByRole('button', { name: 'Page suivante' }))

    expect(onNext).toHaveBeenCalled()
  })
})
