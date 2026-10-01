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
    'Une pile de sections repliables, ouvertes une à une (ou plusieurs). Livré en parts ' +
    'importables séparément ; les libellés et le contenu viennent de l’app.',
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
        createElement(AccordionContent, null, 'Le contenu de la section A.'),
      ),
      createElement(
        AccordionItem,
        { value: 'b' },
        createElement(AccordionTrigger, null, 'Section B'),
        createElement(AccordionContent, null, 'Le contenu de la section B.'),
      ),
    ),
  },
  variants: [
    {
      name: 'type',
      values: ['single', 'multiple'],
      default: 'single',
      description:
        'Combien de sections peuvent être ouvertes — `single` pour une à la fois, `multiple` pour plusieurs.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Les sections : des `AccordionItem` avec leur déclencheur et leur contenu.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      required: false,
      check: 'accepted',
      description: 'La ou les sections ouvertes au départ, quand l’app ne contrôle pas l’état.',
    },
    {
      name: 'value',
      type: 'string | string[]',
      required: false,
      check: 'accepted',
      description: 'La ou les sections ouvertes, contrôlées par l’app.',
    },
    {
      name: 'onValueChange',
      type: '(value: string | string[]) => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur ouvre ou ferme une section.',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'En `type="single"`, permet de refermer la section ouverte.',
    },
  ],
  usages: [
    {
      when: 'des sections repliables dont une seule est ouverte à la fois',
      use: '<Accordion type="single"><AccordionItem value="…">…</AccordionItem></Accordion>',
      avoid: 'un `Accordion` pour un seul repli : c’est un `Collapsible`',
    },
    {
      when: 'comparer plusieurs sections ouvertes',
      use: 'type="multiple"',
      avoid: 'ouvrir tout par défaut : l’accordéon sert à réduire la hauteur',
    },
  ],
}
