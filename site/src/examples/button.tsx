import { Button } from '@nomosui/react'

/** `Button`'s beat 2: the brick in context, several tones side by side. */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Learn more</Button>
    </div>
  )
}
