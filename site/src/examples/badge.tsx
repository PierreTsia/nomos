import { Badge } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>available</Badge>
      <Badge variant="secondary">draft</Badge>
      <Badge variant="outline">archived</Badge>
      <Badge variant="subtle">new</Badge>
      <Badge variant="destructive">failed</Badge>
    </div>
  )
}
