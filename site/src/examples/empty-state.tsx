import { Button, EmptyState } from '@nomosui/react'

export default function Example() {
  return (
    <EmptyState
      title="No results"
      description="Adjust the filters to see more."
      action={<Button variant="outline">Clear filters</Button>}
    />
  )
}
