import { Field, Fieldset, Input } from '@nomosui/react'

export default function Example() {
  return (
    <Fieldset className="flex w-full max-w-sm flex-col gap-4">
      <legend className="text-sm font-medium">Details</legend>
      <Field label="Name" htmlFor="fs-name">
        <Input id="fs-name" placeholder="Item 42" />
      </Field>
      <Field label="Reference" htmlFor="fs-ref">
        <Input id="fs-ref" placeholder="REF-42" />
      </Field>
    </Fieldset>
  )
}
