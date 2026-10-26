import { Button, Field, Form, Input } from '@nomosui/react'

export default function Example() {
  return (
    <Form
      columns={2}
      actions={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </>
      }
    >
      <Field label="Name" htmlFor="fm-name">
        <Input id="fm-name" placeholder="Item 42" />
      </Field>
      <Field label="Reference" htmlFor="fm-ref">
        <Input id="fm-ref" placeholder="REF-42" />
      </Field>
    </Form>
  )
}
