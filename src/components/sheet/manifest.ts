import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { buttonVariants } from '@nomos/components/button/button'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@nomos/components/sheet/sheet'

/**
 * Le manifeste du panneau latéral (ADR 0005). Le catalogue enregistre la racine `Sheet` ;
 * les parts se composent dans l'exemple. `side="bottom"` est le **drawer** — une variante
 * documentée, pas un atome à part.
 */
export const sheetManifest: ComponentManifest = {
  name: 'sheet',
  title: 'Sheet',
  summary:
    'A panel anchored to an edge of the screen, over a scrim: a trigger, a header ' +
    '(title, description), a body and a footer. Shipped as separately importable parts; ' +
    '`side="bottom"` is the drawer.',
  level: 'bloc',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        SheetTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Open',
      ),
      createElement(
        SheetContent,
        { side: 'right' },
        createElement(
          SheetHeader,
          null,
          createElement(SheetTitle, null, 'Panel'),
          createElement(SheetDescription, null, 'A short description.'),
        ),
        'The panel content.',
      ),
    ),
  },
  variants: [
    {
      name: 'side',
      values: ['top', 'right', 'bottom', 'left'],
      default: 'right',
      description:
        'The edge the panel anchors to — `bottom` is the drawer; usage decides, not taste.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The panel parts: a trigger, a surface, a header, a footer.',
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
        'Blocking the rest of the page and trapping focus. Default `true`; `false` for a non-blocking panel.',
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
      when: 'showing content anchored to an edge without leaving the view',
      use: '<Sheet><SheetTrigger>…</SheetTrigger><SheetContent side="right">…</SheetContent></Sheet>',
      avoid: 'a `Sheet` for a centered decision: that is a `Dialog`',
    },
    {
      when: 'a drawer (bottom panel, mobile gesture)',
      use: 'side="bottom" on `SheetContent`',
      avoid: 'a separate `Drawer` component: it is the same panel, a different side',
    },
    {
      when: 'a non-blocking panel (inspector, help)',
      use: 'modal={false}',
      avoid: 'a clickable overlay on a non-modal panel: the app decides about closing',
    },
  ],
}
