import { Alert } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert tone="info" title="Sync started">
        The catalogue will refresh in the background.
      </Alert>
      <Alert tone="warning" title="Token missing">
        A value is not configured — a gap, not a zero.
      </Alert>
    </div>
  )
}
