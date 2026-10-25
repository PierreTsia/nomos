import { ProgressBar } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <ProgressBar value={60} max={100} label="Sync" showValue />
      <ProgressBar value={3} max={8} label="Upload" />
    </div>
  )
}
