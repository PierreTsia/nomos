import { Input, Label } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="scene-input">Search</Label>
      <Input id="scene-input" placeholder="Type to filter…" />
    </div>
  )
}
