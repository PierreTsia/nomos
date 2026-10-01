import { render, screen } from '@testing-library/react'

import { Field } from '@nomos/components/field/field'

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
})
