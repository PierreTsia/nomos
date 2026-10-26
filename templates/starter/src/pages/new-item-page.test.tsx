import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ToastProvider } from '@nomosui/react'

import { NewItemPage } from './new-item-page'

describe('NewItemPage', () => {
  it('shows a toast when the form is submitted', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <NewItemPage />
      </ToastProvider>,
    )

    await user.type(screen.getByLabelText('Name'), 'Shipping plan')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('"Shipping plan" created')).toBeInTheDocument()
  })
})
