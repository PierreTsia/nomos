import { render, screen } from '@testing-library/react'

import { Field } from '@nomos/components/field/field'
import { Input } from '@nomos/components/input/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nomos/components/select/select'
import { Textarea } from '@nomos/components/textarea/textarea'

/** L'emplacement de champ se rend seul, sans provider d'app. */
describe('Field', () => {
  it('renders label, control and hint', () => {
    render(
      <Field label="Adresse" hint="Ton email" htmlFor="email">
        <input id="email" />
      </Field>,
    )

    expect(screen.getByText('Adresse')).toHaveAttribute('for', 'email')
    expect(screen.getByText('Ton email')).toBeInTheDocument()
  })

  it('shows the error instead of the hint', () => {
    render(
      <Field label="Adresse" hint="Ton email" error="Champ requis">
        <input />
      </Field>,
    )

    expect(screen.getByText('Champ requis')).toBeInTheDocument()
    expect(screen.queryByText('Ton email')).not.toBeInTheDocument()
  })

  it('renders without a label', () => {
    render(
      <Field>
        <input aria-label="libre" />
      </Field>,
    )

    expect(screen.getByLabelText('libre')).toBeInTheDocument()
  })

  it('associates the error with the control and marks it invalid', () => {
    render(
      <Field label="Adresse" htmlFor="email" error="Champ requis">
        <Input id="email" />
      </Field>,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Champ requis')
    expect(alert).toHaveAttribute('id')

    const control = screen.getByLabelText('Adresse')
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAttribute('aria-describedby', alert.id)
  })

  it('associates the hint with the control when there is no error', () => {
    render(
      <Field label="Adresse" htmlFor="email" hint="Ton email">
        <Input id="email" />
      </Field>,
    )

    const hint = screen.getByText('Ton email')
    expect(hint).toHaveAttribute('id')
    expect(screen.getByLabelText('Adresse')).toHaveAttribute('aria-describedby', hint.id)
  })

  it('reaches the nested control of a composed Select', () => {
    render(
      <Field label="Statut" error="Champ requis">
        <Select>
          <SelectTrigger aria-label="Statut">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Ouverte</SelectItem>
          </SelectContent>
        </Select>
      </Field>,
    )

    const alert = screen.getByRole('alert')
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveAttribute('aria-describedby', alert.id)
  })

  it('associates the error with a Textarea control and marks it invalid', () => {
    render(
      <Field label="Note" htmlFor="note" error="Champ requis">
        <Textarea id="note" />
      </Field>,
    )

    const alert = screen.getByRole('alert')
    const control = screen.getByLabelText('Note')
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(control).toHaveAttribute('aria-describedby', alert.id)
  })

  it('keeps the caller’s aria-describedby alongside the field’s message on a Textarea', () => {
    render(
      <Field error="Champ requis">
        <Textarea aria-label="Note" aria-describedby="custom" />
      </Field>,
    )

    const alert = screen.getByRole('alert')
    const describedBy = screen.getByLabelText('Note').getAttribute('aria-describedby')
    expect(describedBy).toContain('custom')
    expect(describedBy).toContain(alert.id)
  })

  it('keeps the caller’s aria-describedby alongside the field’s message', () => {
    render(
      <Field error="Champ requis">
        <Input aria-label="Adresse" aria-describedby="custom" />
      </Field>,
    )

    const alert = screen.getByRole('alert')
    const describedBy = screen.getByLabelText('Adresse').getAttribute('aria-describedby')
    expect(describedBy).toContain('custom')
    expect(describedBy).toContain(alert.id)
  })

  it('marks the control invalid on error, whatever the caller asked', () => {
    render(
      <Field error="Champ requis">
        <Input aria-label="Adresse" aria-invalid={false} />
      </Field>,
    )

    expect(screen.getByLabelText('Adresse')).toHaveAttribute('aria-invalid', 'true')
  })
})
