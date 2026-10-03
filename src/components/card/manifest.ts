import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nomos/components/card/card'

/** Le manifeste de la carte (ADR 0005). Le catalogue enregistre la coquille `Card`. */
export const cardManifest: ComponentManifest = {
  name: 'card',
  title: 'Card',
  summary:
    'A surface that groups related content: a header (title, description), a ' +
    'body and a footer. Shipped as parts importable separately, with no label of its own in the core.',
  level: 'primitive',
  example: {
    className: 'max-w-sm',
    children: createElement(
      Fragment,
      null,
      createElement(
        CardHeader,
        null,
        createElement(CardTitle, null, 'Title'),
        createElement(CardDescription, null, 'A short description.'),
      ),
      createElement(CardContent, null, 'The content of the card.'),
    ),
  },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core ones.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "The card parts: a header, a body, a footer.",
    },
  ],
  usages: [
    {
      when: 'group a title, a body and a footer in a surface',
      use: '<Card><CardHeader><CardTitle>…</CardTitle></CardHeader><CardContent>…</CardContent></Card>',
      avoid: 'a one-off styled `<div>`: you lose the border and background tokens',
    },
    {
      when: 'summary cards side by side in a grid',
      use: 'several `Card`s at the same level',
      avoid: 'nest `Card`s deeply: a card is not a layout',
    },
  ],
}
