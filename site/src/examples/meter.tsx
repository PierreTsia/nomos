import { Meter } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Meter label="coverage" value={82} max={100} threshold={80} />
      <Meter label="latency" value={3} max={5} threshold={2} />
    </div>
  )
}
