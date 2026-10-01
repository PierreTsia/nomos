import { render, screen } from '@testing-library/react'

import { Label } from '@nomos/components/label/label'

/** Le libellé se rend seul, sans provider d'app. */
describe('Label', () => {
  it('renders its text and associates a control by htmlFor', () => {
    render(
      <>
        <Label htmlFor="champ">Adresse</Label>
        <input id="champ" />
      </>,
    )

    expect(screen.getByText('Adresse')).toHaveAttribute('for', 'champ')
  })

  it('lets the application merge its own classes', () => {
    render(<Label className="mb-1">x</Label>)

    expect(screen.getByText('x')).toHaveClass('mb-1')
  })
})
