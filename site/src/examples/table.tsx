import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nomosui/react'

export default function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>alpha</TableCell>
          <TableCell>
            <Badge variant="secondary">open</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>beta</TableCell>
          <TableCell>
            <Badge>closed</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
