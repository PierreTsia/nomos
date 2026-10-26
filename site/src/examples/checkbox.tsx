import { useState } from 'react'
import { Checkbox, Label } from '@nomosui/react'

export default function Example() {
  const [checked, setChecked] = useState(true)
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="scene-checkbox" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
      <Label htmlFor="scene-checkbox">Notify me on completion</Label>
    </div>
  )
}
