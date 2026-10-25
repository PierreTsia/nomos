import { Counter } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex items-center gap-6">
      <Counter value={128} label="open" />
      <Counter value={3} label="blocked" />
    </div>
  )
}
