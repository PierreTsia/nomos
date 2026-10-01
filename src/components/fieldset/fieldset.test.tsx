import { render, screen } from '@testing-library/react'

import { Fieldset } from '@nomos/components/fieldset/fieldset'

/** Le regroupement se rend seul, sans provider d'app. */
describe('Fieldset', () => {
  it('renders a semantic group, without any application provider', () => {
    render(
      <Fieldset>
        <legend>Identité</legend>
        <input />
      </Fieldset>,
    )

    expect(screen.getByRole('group', { name: 'Identité' })).toBeInTheDocument()
  })

  it('lets the application merge its own classes', () => {
    render(<Fieldset className="gap-8">x</Fieldset>)

    expect(screen.getByText('x')).toHaveClass('gap-8')
  })
})
