import { Avatar } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar alt="Ada Lovelace" fallback="AL" />
      <Avatar alt="Grace Hopper" fallback="GH" />
      <Avatar alt="Alan Turing" fallback="AT" />
    </div>
  )
}
