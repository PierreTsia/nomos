import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { buttonVariants } from '@nomos/components/button/button'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@nomos/components/alert-dialog/alert-dialog'

/**
 * Le manifeste de la modale de confirmation (ADR 0005). Le catalogue enregistre la racine
 * `AlertDialog` ; les parts se composent dans l'exemple. Le voile et l'empilement lisent
 * les tokens (ADR 0027).
 */
export const alertDialogManifest: ComponentManifest = {
  name: 'alert-dialog',
  title: 'AlertDialog',
  summary:
    'A blocking confirmation modal: a title, a description, and two outcomes — ' +
    'act or cancel. Shipped as parts importable separately; all labels come ' +
    'from the app.',
  level: 'bloc',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        AlertDialogTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Delete',
      ),
      createElement(
        AlertDialogContent,
        null,
        createElement(
          AlertDialogHeader,
          null,
          createElement(AlertDialogTitle, null, 'Delete?'),
          createElement(AlertDialogDescription, null, 'This action is permanent.'),
        ),
        createElement(
          AlertDialogFooter,
          null,
          createElement(AlertDialogCancel, null, 'Cancel'),
          createElement(AlertDialogAction, null, 'Delete'),
        ),
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
      description: 'The parts: a trigger, a surface, a header, a footer.',
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
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user asks to open or close.',
    },
  ],
  usages: [
    {
      when: 'confirm a destructive or irreversible action',
      use: '<AlertDialog><AlertDialogTrigger>…</AlertDialogTrigger><AlertDialogContent>…</AlertDialogContent></AlertDialog>',
      avoid: 'a `Dialog` for a blocking decision: the `AlertDialog` does not close on outside click',
    },
    {
      when: 'two explicit outcomes',
      use: 'an `AlertDialogCancel` (cancel) and an `AlertDialogAction` (act) in the footer',
      avoid: 'a single button: a confirmation with no neutral outcome traps the user',
    },
  ],
}
