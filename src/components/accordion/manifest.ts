import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@nomos/components/accordion/accordion'

/**
 * Le manifeste de l'accordéon (ADR 0005). Le catalogue enregistre la racine `Accordion` ;
 * les parts se composent dans l'exemple. `type` (single/multiple) est une variante
 * documentée ; le repli de hauteur lit le mouvement tokenisé (ADR 0027).
 */
export const accordionManifest: ComponentManifest = {
  name: 'accordion',
  title: 'Accordion',
  summary:
    'A stack of collapsible sections, opened one at a time (or several). Shipped as parts ' +
    'importable separately; labels and content come from the app.',
  level: 'primitive',
  example: {
    type: 'single',
    defaultValue: 'a',
    children: createElement(
      Fragment,
      null,
      createElement(
        AccordionItem,
        { value: 'a' },
        createElement(AccordionTrigger, null, 'Section A'),
        createElement(AccordionContent, null, 'The content of section A.'),
      ),
      createElement(
        AccordionItem,
        { value: 'b' },
        createElement(AccordionTrigger, null, 'Section B'),
        createElement(AccordionContent, null, 'The content of section B.'),
      ),
    ),
  },
  variants: [
    {
      name: 'type',
      values: ['single', 'multiple'],
      default: 'single',
      description:
        'How many sections can be open — `single` for one at a time, `multiple` for several.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The sections: `AccordionItem`s with their trigger and content.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      required: false,
      check: 'accepted',
      description: 'The section(s) open initially, when the app does not control the state.',
    },
    {
      name: 'value',
      type: 'string | string[]',
      required: false,
      check: 'accepted',
      description: 'The section(s) open, controlled by the app.',
    },
    {
      name: 'onValueChange',
      type: '(value: string | string[]) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user opens or closes a section.',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'In `type="single"`, allows closing the open section.',
    },
  ],
  usages: [
    {
      when: 'collapsible sections where only one is open at a time',
      use: '<Accordion type="single"><AccordionItem value="…">…</AccordionItem></Accordion>',
      avoid: 'an `Accordion` for a single fold: that is a `Collapsible`',
    },
    {
      when: 'compare several open sections',
      use: 'type="multiple"',
      avoid: 'open everything by default: the accordion exists to reduce height',
    },
  ],
}
