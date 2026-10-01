import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { buttonVariants } from '@nomos/components/button/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@nomos/components/dropdown-menu/dropdown-menu'

/**
 * Le manifeste du menu flottant (ADR 0005). Le catalogue enregistre la racine
 * `DropdownMenu` ; les parts se composent dans l'exemple. Le menu flottant lit le
 * `z-index` tokenisé (ADR 0027), jamais un `z-50` en dur.
 */
export const dropdownMenuManifest: ComponentManifest = {
  name: 'dropdown-menu',
  title: 'DropdownMenu',
  summary:
    'Un menu flottant ouvert par un déclencheur : des items simples, à cocher, radio, ou ' +
    'un sous-menu, séparés par des traits. Livré en parts importables séparément ; l’app ' +
    'fournit les libellés et les actions.',
  level: 'primitive',
  example: {
    open: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        DropdownMenuTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Actions',
      ),
      createElement(
        DropdownMenuContent,
        { align: 'start' },
        createElement(DropdownMenuLabel, null, 'Colonnes'),
        createElement(DropdownMenuItem, null, 'Nom'),
        createElement(DropdownMenuItem, null, 'Statut'),
        createElement(DropdownMenuSeparator, null),
        createElement(DropdownMenuItem, null, 'Réinitialiser'),
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
      description: 'Les parts du menu : un déclencheur, une surface, des items.',
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
        'Blocage du reste de la page et piégeage du focus. Défaut `true` (menu modal).',
    },
    {
      name: 'onOpenChange',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur demande à ouvrir ou fermer.',
    },
  ],
  usages: [
    {
      when: 'regrouper des actions derrière un déclencheur compact',
      use: '<DropdownMenu><DropdownMenuTrigger>…</DropdownMenuTrigger><DropdownMenuContent>…</DropdownMenuContent></DropdownMenu>',
      avoid: 'un `DropdownMenu` pour choisir une valeur de formulaire : c’est un `Select`',
    },
    {
      when: 'des options qui se cochent indépendamment',
      use: 'des `DropdownMenuCheckboxItem` dans un `DropdownMenuContent`',
      avoid: 'un `DropdownMenuItem` qui garde l’état : l’item ne le porte pas, l’app si',
    },
    {
      when: 'un choix unique parmi quelques options',
      use: 'un `DropdownMenuRadioGroup` de `DropdownMenuRadioItem`',
      avoid: 'mélanger items simples et radios dans le même groupe sans les séparer',
    },
  ],
}
