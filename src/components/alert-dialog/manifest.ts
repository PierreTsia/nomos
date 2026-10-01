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
    'Une modale de confirmation bloquante : un titre, une description, et deux issues — ' +
    'agir ou annuler. Livrée en parts importables séparément ; tous les libellés viennent ' +
    'de l’app.',
  level: 'bloc',
  example: {
    open: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        AlertDialogTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Supprimer',
      ),
      createElement(
        AlertDialogContent,
        null,
        createElement(
          AlertDialogHeader,
          null,
          createElement(AlertDialogTitle, null, 'Supprimer ?'),
          createElement(AlertDialogDescription, null, 'Cette action est définitive.'),
        ),
        createElement(
          AlertDialogFooter,
          null,
          createElement(AlertDialogCancel, null, 'Annuler'),
          createElement(AlertDialogAction, null, 'Supprimer'),
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
      description: 'Les parts : un déclencheur, une surface, un en-tête, un pied.',
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
  ],
  usages: [
    {
      when: 'confirmer une action destructive ou irréversible',
      use: '<AlertDialog><AlertDialogTrigger>…</AlertDialogTrigger><AlertDialogContent>…</AlertDialogContent></AlertDialog>',
      avoid: 'un `Dialog` pour une décision bloquante : l’`AlertDialog` ne se ferme pas au clic hors surface',
    },
    {
      when: 'deux issues explicites',
      use: 'un `AlertDialogCancel` (annuler) et un `AlertDialogAction` (agir) dans le pied',
      avoid: 'un seul bouton : une confirmation sans issue neutre piège l’utilisateur',
    },
  ],
}
