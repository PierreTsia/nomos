import { Field, Input } from '@nomosui/react'

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Name" htmlFor="fd-name">
        <Input id="fd-name" placeholder="Item 42" />
      </Field>
      <Field label="Slug" htmlFor="fd-slug" hint="lowercase, no spaces">
        <Input id="fd-slug" placeholder="item-42" />
      </Field>
    </div>
  )
}
