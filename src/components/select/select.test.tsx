import { render, screen } from '@testing-library/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nomos/components/select/select'

/** Le sélecteur est un atome du cœur : il se rend seul, sans provider d'app. */
describe('Select', () => {
  it('renders its trigger and the selected value, without any application provider', () => {
    render(
      <Select defaultValue="open">
        <SelectTrigger>
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Ouverte</SelectItem>
          <SelectItem value="closed">Fermée</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Ouverte')).toBeInTheDocument()
  })

  it('disables the trigger when the select is disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Ouverte</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
