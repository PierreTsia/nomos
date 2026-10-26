import { Freshness } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex items-center gap-6 text-sm">
      <Freshness label="2 minutes ago" title="2026-10-25 10:00" />
      <Freshness label="1 hour ago" />
      <Freshness label="3 days ago" stale />
    </div>
  )
}
