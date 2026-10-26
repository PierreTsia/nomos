import { useState } from 'react'

import { Button, Field, Input, Textarea, useToast } from '@nomosui/react'

import { Page } from '../components/page'
import { navigate } from '../router'

export function NewItemPage() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <Page title="New item" description="A form wired to a toast on submit.">
      <form
        className="flex max-w-lg flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          toast.show({ tone: 'success', message: `"${name}" created` })
          setName('')
          setNotes('')
          navigate('/items')
        }}
      >
        <Field label="Name" htmlFor="name" hint="What the item is called.">
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>

        <Field label="Notes" htmlFor="notes">
          <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>

        <div className="flex gap-2">
          <Button type="submit">Create</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/items')}>
            Cancel
          </Button>
        </div>
      </form>
    </Page>
  )
}
