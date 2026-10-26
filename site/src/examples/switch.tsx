import { useState } from 'react'
import { Label, Switch } from '@nomosui/react'

export default function Example() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-2">
      <Switch id="scene-switch" checked={on} onCheckedChange={setOn} />
      <Label htmlFor="scene-switch">Dark mode</Label>
    </div>
  )
}
