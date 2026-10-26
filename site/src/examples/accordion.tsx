import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nomosui/react'

export default function Example() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="what">
        <AccordionTrigger>What is Nomos?</AccordionTrigger>
        <AccordionContent>An app-agnostic design system: tokens, primitives, a catalogue.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="typed">
        <AccordionTrigger>Is it typed?</AccordionTrigger>
        <AccordionContent>Yes — the package ships its own declarations.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
