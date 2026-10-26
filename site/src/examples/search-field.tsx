import { useState } from 'react'
import { SearchField } from '@nomosui/react'

export default function Example() {
  const [value, setValue] = useState('')
  return (
    <SearchField
      value={value}
      onChange={setValue}
      clearLabel="Clear search"
      placeholder="Search bricks"
    />
  )
}
