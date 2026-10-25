import { Button } from '@nomosui/react'

/** Le beat 2 de `Button` : la brique en contexte, plusieurs tons côte à côte. */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Learn more</Button>
    </div>
  )
}
