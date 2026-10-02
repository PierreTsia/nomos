import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { buttonVariants } from '@nomos/components/button/button'
import {
  PopoverContent,
  PopoverTrigger,
} from '@nomos/components/popover/popover'

/**
 * Le manifeste de la bulle contextuelle (ADR 0005). Le catalogue enregistre la racine
 * `Popover` ; les parts se composent dans l'exemple. La surface flottante lit le
 * `z-index` tokenisé (ADR 0027), jamais une valeur d’empilement en dur.
 */
export const popoverManifest: ComponentManifest = {
  name: 'popover',
  title: 'Popover',
  summary:
    'Une surface flottante de contenu riche, ouverte au clic d’un déclencheur. Livrée en ' +
    'parts importables séparément ; le contenu et ses libellés viennent de l’app.',
  level: 'primitive',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        PopoverTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Filtres',
      ),
      createElement(
        PopoverContent,
        { align: 'start' },
        'Le contenu de la bulle.',
      ),
    ),
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Les parts de la bulle : un déclencheur, une surface, un ancrage.',
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
      name: 'modal',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description:
        'Blocage du reste de la page et piégeage du focus. Défaut `false` (bulle non modale).',
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
      when: 'un contenu riche ou interactif dans une surface flottante au clic',
      use: '<Popover><PopoverTrigger>…</PopoverTrigger><PopoverContent>…</PopoverContent></Popover>',
      avoid: 'un `Popover` pour un texte court au survol : c’est une `Tooltip`',
    },
    {
      when: 'ancrer la surface sur un autre élément que le déclencheur',
      use: 'un `PopoverAnchor` autour de la cible',
      avoid: 'déplacer la surface par des marges : l’ancrage est le rôle de l’`Anchor`',
    },
    {
      when: 'regrouper des actions plutôt qu’un contenu',
      use: 'des `DropdownMenuItem` dans un `PopoverContent`, ou un `DropdownMenu`',
      avoid: 'un `Popover` pour choisir une valeur de formulaire : c’est un `Select`',
    },
  ],
}
