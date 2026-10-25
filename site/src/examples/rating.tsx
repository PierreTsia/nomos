import { Rating } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex items-center gap-6">
      <Rating value={3} max={5} ariaLabel="Rating" />
      <Rating value={4} max={5} ariaLabel="Average rating" readOnly />
    </div>
  )
}
