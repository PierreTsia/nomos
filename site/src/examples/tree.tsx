import { useState } from 'react'
import { Tree } from '@nomosui/react'

export default function Example() {
  const [selected, setSelected] = useState('button')
  return (
    <Tree
      ariaLabel="Files"
      selectedId={selected}
      onSelect={(id) => setSelected(id)}
      nodes={[
        {
          id: 'src',
          label: 'src',
          children: [
            { id: 'button', label: 'button.tsx' },
            { id: 'card', label: 'card.tsx' },
          ],
        },
        { id: 'readme', label: 'README.md' },
      ]}
    />
  )
}
