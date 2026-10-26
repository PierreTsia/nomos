import { Chip } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip tone="neutral" onRemove={() => {}} removeLabel="Remove open">
        open
      </Chip>
      <Chip tone="info">mine</Chip>
    </div>
  )
}
