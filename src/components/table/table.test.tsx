import { render, screen } from '@testing-library/react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nomos/components/table/table'

/**
 * La table dense est un atome du cœur : elle se rend à partir de ses seules parts,
 * sans aucun provider d'app autour d'elle, et l'appelant peut fusionner ses classes.
 */
describe('Table', () => {
  it('renders a table from its parts, without any application provider', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>nom</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>spec</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText('nom')).toBeInTheDocument()
    expect(screen.getByText('spec')).toBeInTheDocument()
  })

  it('lets the application merge its own classes on a cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-right">2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText('2')).toHaveClass('text-right')
  })
})
