import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nomos/components/tabs/tabs'

/** Les onglets sont un atome du cœur : ils se rendent seuls, sans provider d'app. */
describe('Tabs', () => {
  it('shows the default panel, then switches on click, without any application provider', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Onglet A</TabsTrigger>
          <TabsTrigger value="b">Onglet B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Le panneau A.</TabsContent>
        <TabsContent value="b">Le panneau B.</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText('Le panneau A.')).toBeInTheDocument()
    expect(screen.queryByText('Le panneau B.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Onglet B' }))

    expect(await screen.findByText('Le panneau B.')).toBeInTheDocument()
  })
})
