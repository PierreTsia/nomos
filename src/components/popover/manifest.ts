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
    'A floating surface of rich content, opened on a trigger click. Shipped as separately ' +
    'importable parts; the content and its labels come from the app.',
  level: 'primitive',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        PopoverTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Filters',
      ),
      createElement(
        PopoverContent,
        { align: 'start' },
        'The popover content.',
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
      description: 'The popover parts: a trigger, a surface, an anchor.',
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
        'Blocks the rest of the page and traps focus. Defaults to `false` (non-modal popover).',
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
      when: 'rich or interactive content in a floating surface on click',
      use: '<Popover><PopoverTrigger>…</PopoverTrigger><PopoverContent>…</PopoverContent></Popover>',
      avoid: 'a `Popover` for short text on hover: that is a `Tooltip`',
    },
    {
      when: 'anchoring the surface to an element other than the trigger',
      use: 'a `PopoverAnchor` around the target',
      avoid: "moving the surface with margins: anchoring is the `Anchor`'s role",
    },
    {
      when: 'grouping actions rather than content',
      use: '`DropdownMenuItem`s in a `PopoverContent`, or a `DropdownMenu`',
      avoid: 'a `Popover` to choose a form value: that is a `Select`',
    },
  ],
}
