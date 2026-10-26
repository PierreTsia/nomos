import { Label, Textarea } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="scene-textarea">Notes</Label>
      <Textarea id="scene-textarea" placeholder="Write a note…" />
    </div>
  )
}
