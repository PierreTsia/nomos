import { Label, RadioGroup, RadioGroupItem } from '@nomosui/react'

export default function Example() {
  return (
    <RadioGroup defaultValue="a" className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="scene-radio-a" />
        <Label htmlFor="scene-radio-a">Keep the current version</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="scene-radio-b" />
        <Label htmlFor="scene-radio-b">Publish a new one</Label>
      </div>
    </RadioGroup>
  )
}
