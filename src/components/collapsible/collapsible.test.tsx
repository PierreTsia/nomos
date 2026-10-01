import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nomos/components/collapsible/collapsible'

/** Le repli est un atome du cœur : il se rend seul, sans provider d'app. */
describe('Collapsible', () => {
  it('reveals its content from the trigger, without any application provider', async () => {
    const user = userEvent.setup()
    render(
      <Collapsible>
        <CollapsibleTrigger>Détails</CollapsibleTrigger>
        <CollapsibleContent>Le contenu replié.</CollapsibleContent>
      </Collapsible>,
    )

    expect(screen.queryByText('Le contenu replié.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Détails' }))

    expect(await screen.findByText('Le contenu replié.')).toBeInTheDocument()
  })

  it('lets the application merge its own classes on the content', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Détails</CollapsibleTrigger>
        <CollapsibleContent className="pb-2">Contenu</CollapsibleContent>
      </Collapsible>,
    )

    expect(screen.getByText('Contenu')).toHaveClass('pb-2')
  })
})
