import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { buttonVariants } from '@nomos/components/button/button'
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@nomos/components/collapsible/collapsible'

/**
 * Le manifeste du repli (ADR 0005). Le catalogue enregistre la racine `Collapsible` ; les
 * parts se composent dans l'exemple. Le repli de hauteur lit le mouvement tokenisé
 * (ADR 0027).
 */
export const collapsibleManifest: ComponentManifest = {
  name: 'collapsible',
  title: 'Collapsible',
  summary:
    'Une zone de contenu qu’on ouvre et referme derrière un déclencheur. Livré en parts ' +
    'importables séparément ; le libellé du déclencheur et le contenu viennent de l’app.',
  level: 'primitive',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        CollapsibleTrigger,
        { className: buttonVariants({ variant: 'ghost' }) },
        'Détails',
      ),
      createElement(CollapsibleContent, null, 'Le contenu replié.'),
    ),
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Les parts du repli : un déclencheur, une zone de contenu.',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'L’état d’ouverture contrôlé : il vit dans l’app.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'L’état d’ouverture initial, quand l’app ne le contrôle pas.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive le repli : ni ouverture, ni fermeture.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur demande à ouvrir ou fermer.',
    },
  ],
  usages: [
    {
      when: 'révéler un détail à la demande sous un déclencheur',
      use: '<Collapsible><CollapsibleTrigger>…</CollapsibleTrigger><CollapsibleContent>…</CollapsibleContent></Collapsible>',
      avoid: 'un `Collapsible` pour des sections mutuellement exclusives : c’est un `Accordion`',
    },
    {
      when: 'un filtre secondaire dans une barre dense',
      use: 'un `Collapsible` discret, fermé par défaut',
      avoid: 'ouvrir par défaut un contenu secondaire : il pousse le reste de la vue',
    },
  ],
}
