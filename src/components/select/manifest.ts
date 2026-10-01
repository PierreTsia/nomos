import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nomos/components/select/select'

/**
 * Le manifeste du sélecteur (ADR 0005). Le catalogue enregistre la racine `Select` ; les
 * parts se composent dans l'exemple. La liste flottante lit le `z-index` tokenisé
 * (ADR 0027), jamais un `z-50` en dur.
 */
export const selectManifest: ComponentManifest = {
  name: 'select',
  title: 'Select',
  summary:
    'Un sélecteur à choix unique : un déclencheur et une liste flottante d’options. Livré ' +
    'en parts importables séparément ; les libellés et les valeurs viennent de l’app.',
  level: 'primitive',
  example: {
    defaultValue: 'open',
    children: createElement(
      Fragment,
      null,
      createElement(
        SelectTrigger,
        { className: 'w-48' },
        createElement(SelectValue, { placeholder: 'Statut' }),
      ),
      createElement(
        SelectContent,
        null,
        createElement(SelectItem, { value: 'open' }, 'Ouverte'),
        createElement(SelectItem, { value: 'closed' }, 'Fermée'),
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
      description: 'Les parts du sélecteur : un déclencheur, une valeur, une liste d’items.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'La valeur sélectionnée, contrôlée par l’app.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'La valeur initiale, quand l’app ne la contrôle pas.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur choisit une option.',
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
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur demande à ouvrir ou fermer.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive le sélecteur : ni ouverture, ni changement.',
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'Le nom du champ, pour la soumission d’un formulaire.',
    },
  ],
  usages: [
    {
      when: 'choisir une valeur unique parmi une liste d’options',
      use: '<Select><SelectTrigger><SelectValue placeholder="…" /></SelectTrigger><SelectContent>…</SelectContent></Select>',
      avoid: 'un `DropdownMenu` pour une valeur de formulaire : un menu porte des actions, pas une valeur',
    },
    {
      when: 'quelques options seulement, toutes visibles',
      use: 'un `RadioGroup` : les options restent à l’écran',
      avoid: 'un `Select` pour deux ou trois options qu’on veut comparer d’un regard',
    },
  ],
}
