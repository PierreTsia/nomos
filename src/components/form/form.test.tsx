import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from '@nomos/components/button/button'
import { Field } from '@nomos/components/field/field'
import { Fieldset } from '@nomos/components/fieldset/fieldset'
import { Form } from '@nomos/components/form/form'
import { Input } from '@nomos/components/input/input'

/** Un formulaire de démonstration, monté avec les briques du cœur et l'état dans l'app. */
function DemoForm() {
  const [name, setName] = useState('')
  return (
    <Form
      aria-label="profil"
      onSubmit={(event) => event.preventDefault()}
      actions={<Button type="submit">Enregistrer</Button>}
    >
      <Fieldset>
        <legend>Profil</legend>
        <Field label="Nom" htmlFor="demo-name">
          <Input id="demo-name" value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
      </Fieldset>
    </Form>
  )
}

/** Le bloc se rend seul, sans provider d'app, et laisse l'état à l'app. */
describe('Form', () => {
  it('renders fields and actions, without any application provider', () => {
    render(<DemoForm />)

    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText('Nom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument()
  })

  it('leaves the field state to the application', async () => {
    const user = userEvent.setup()
    render(<DemoForm />)

    await user.type(screen.getByLabelText('Nom'), 'Ada')

    expect(screen.getByLabelText('Nom')).toHaveValue('Ada')
  })

  it('lets the application merge its own classes', () => {
    render(<Form aria-label="bloc" className="max-w-md" />)

    expect(screen.getByLabelText('bloc')).toHaveClass('max-w-md')
  })
})
