import { Button, Dialog } from '@nomosui/react'

export default function Example() {
  return (
    <Dialog
      trigger="Open dialog"
      title="Publish these changes?"
      description="The version becomes immutable once published."
      body="Everyone on the project will see the new version."
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button>Publish</Button>
        </>
      }
      closeLabel="Close"
    />
  )
}
