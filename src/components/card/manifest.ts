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
    'Une surface qui regroupe un contenu apparenté : un en-tête (titre, description), un ' +
    'corps et un pied. Livrée en parts importables séparément, sans libellé propre au cœur.',
  level: 'primitive',
  example: {
    className: 'max-w-sm',
    children: createElement(
      Fragment,
      null,
      createElement(
        CardHeader,
        null,
        createElement(CardTitle, null, 'Titre'),
        createElement(CardDescription, null, 'Une description courte.'),
      ),
      createElement(CardContent, null, 'Le contenu de la carte.'),
    ),
  },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "Les parts de la carte : un en-tête, un corps, un pied.",
    },
  ],
  usages: [
    {
      when: 'regrouper un titre, un corps et un pied dans une surface',
      use: '<Card><CardHeader><CardTitle>…</CardTitle></CardHeader><CardContent>…</CardContent></Card>',
      avoid: 'un `<div>` stylé au coup par coup : on perd les tokens de bordure et de fond',
    },
    {
      when: 'des cartes de résumé côte à côte dans une grille',
      use: 'plusieurs `Card` de même niveau',
      avoid: 'imbriquer des `Card` profondément : une carte n’est pas un layout',
    },
  ],
}
