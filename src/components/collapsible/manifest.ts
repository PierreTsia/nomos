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
    'A content area that opens and closes behind a trigger. Shipped as parts ' +
    'importable separately; the trigger label and the content come from the app.',
  level: 'primitive',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        CollapsibleTrigger,
        { className: buttonVariants({ variant: 'ghost' }) },
        'Details',
      ),
      createElement(CollapsibleContent, null, 'The collapsed content.'),
    ),
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The parts of the collapsible: a trigger, a content area.',
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
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the collapsible: neither opening nor closing.',
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
      when: 'revealing a detail on demand under a trigger',
      use: '<Collapsible><CollapsibleTrigger>…</CollapsibleTrigger><CollapsibleContent>…</CollapsibleContent></Collapsible>',
      avoid: 'a `Collapsible` for mutually exclusive sections: that is an `Accordion`',
    },
    {
      when: 'a secondary filter in a dense bar',
      use: 'a discreet `Collapsible`, closed by default',
      avoid: 'opening a secondary content by default: it pushes the rest of the view',
    },
  ],
}
