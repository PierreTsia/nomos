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
 * `z-index` tokenisé (ADR 0027), jamais une valeur d’empilement en dur.
 */
export const dropdownMenuManifest: ComponentManifest = {
  name: 'dropdown-menu',
  title: 'DropdownMenu',
  summary:
    'A floating menu opened by a trigger: simple items, checkbox, radio, or ' +
    'a submenu, separated by separators. Shipped as parts importable separately; the app ' +
    'provides the labels and the actions.',
  level: 'primitive',
  example: {
    defaultOpen: true,
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
        createElement(DropdownMenuLabel, null, 'Columns'),
        createElement(DropdownMenuItem, null, 'Name'),
        createElement(DropdownMenuItem, null, 'Status'),
        createElement(DropdownMenuSeparator, null),
        createElement(DropdownMenuItem, null, 'Reset'),
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
      description: 'The parts of the menu: a trigger, a surface, items.',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The controlled open state: it lives in the app.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The initial open state, when the app does not control it.',
    },
    {
      name: 'modal',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description:
        'Blocks the rest of the page and traps focus. Default `true` (modal menu).',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user asks to open or close.',
    },
  ],
  usages: [
    {
      when: 'grouping actions behind a compact trigger',
      use: '<DropdownMenu><DropdownMenuTrigger>…</DropdownMenuTrigger><DropdownMenuContent>…</DropdownMenuContent></DropdownMenu>',
      avoid: 'a `DropdownMenu` for choosing a form value: that is a `Select`',
    },
    {
      when: 'options that check independently',
      use: '`DropdownMenuCheckboxItem`s in a `DropdownMenuContent`',
      avoid: 'a `DropdownMenuItem` that holds state: the item does not carry it, the app does',
    },
    {
      when: 'a single choice among a few options',
      use: 'a `DropdownMenuRadioGroup` of `DropdownMenuRadioItem`s',
      avoid: 'mixing simple items and radios in the same group without separating them',
    },
  ],
}
