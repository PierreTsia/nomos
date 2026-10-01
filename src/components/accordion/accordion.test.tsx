import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@nomos/components/accordion/accordion'

/** L'accordéon est un atome du cœur : il se rend seul, sans provider d'app. */
describe('Accordion', () => {
  it('opens a section from its trigger, without any application provider', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Le contenu de la section A.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.queryByText('Le contenu de la section A.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Section A' }))

    expect(await screen.findByText('Le contenu de la section A.')).toBeInTheDocument()
  })

  it('opens several sections at once with type="multiple"', () => {
    render(
      <Accordion type="multiple" defaultValue={['a', 'b']}>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Contenu A.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Contenu B.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )

    expect(screen.getByText('Contenu A.')).toBeInTheDocument()
    expect(screen.getByText('Contenu B.')).toBeInTheDocument()
  })
})
