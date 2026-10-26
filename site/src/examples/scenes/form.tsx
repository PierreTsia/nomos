import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Form,
  Input,
  NumberField,
} from '@nomosui/react'

export const title = 'A form in a card'
export const summary = 'Fields, a grouped layout and actions — assembled from the core bricks.'

/** A whole-screen scene: a complete form inside a card. */
export default function Example() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>New item</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          columns={2}
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </>
          }
        >
          <Field label="Name" htmlFor="scene-form-name">
            <Input id="scene-form-name" defaultValue="Item 42" />
          </Field>
          <Field label="Score" htmlFor="scene-form-score" hint="from 1 to 5">
            <NumberField id="scene-form-score" min={1} max={5} defaultValue="3" aria-label="Score" />
          </Field>
        </Form>
      </CardContent>
    </Card>
  )
}
