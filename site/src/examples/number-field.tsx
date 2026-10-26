import { Label, NumberField } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="scene-number">Quantity</Label>
      <NumberField id="scene-number" min={0} max={10} step={1} placeholder="0" />
    </div>
  )
}
