import { Timeline } from '@nomosui/react'

export default function Example() {
  return (
    <Timeline
      ariaLabel="Recent events"
      items={[
        { id: '1', at: '2 minutes ago', label: 'Build passed' },
        { id: '2', at: '1 hour ago', label: 'Deploy started', detail: 'version 0.14.0' },
        { id: '3', at: 'Yesterday', label: 'Token updated', state: 'past', stateLabel: 'past' },
      ]}
    />
  )
}
