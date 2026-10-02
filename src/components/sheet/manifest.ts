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
    'Un panneau ancré à un bord de l’écran, sur un voile : un déclencheur, un en-tête ' +
    '(titre, description), un corps et un pied. Livré en parts importables séparément ; ' +
    '`side="bottom"` est le drawer.',
  level: 'bloc',
  example: {
    defaultOpen: true,
    children: createElement(
      Fragment,
      null,
      createElement(
        SheetTrigger,
        { className: buttonVariants({ variant: 'outline' }) },
        'Ouvrir',
      ),
      createElement(
        SheetContent,
        { side: 'right' },
        createElement(
          SheetHeader,
          null,
          createElement(SheetTitle, null, 'Panneau'),
          createElement(SheetDescription, null, 'Une description courte.'),
        ),
        'Le contenu du panneau.',
      ),
    ),
  },
  variants: [
    {
      name: 'side',
      values: ['top', 'right', 'bottom', 'left'],
      default: 'right',
      description:
        'Le bord auquel le panneau s’ancre — `bottom` est le drawer ; c’est l’usage qui décide, pas le goût.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Les parts du panneau : un déclencheur, une surface, un en-tête, un pied.',
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
        'Blocage du reste de la page et piégeage du focus. Défaut `true` ; `false` pour un panneau non bloquant.',
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
      when: 'montrer un contenu ancré à un bord sans quitter la vue',
      use: '<Sheet><SheetTrigger>…</SheetTrigger><SheetContent side="right">…</SheetContent></Sheet>',
      avoid: 'un `Sheet` pour une décision centrée : c’est un `Dialog`',
    },
    {
      when: 'un drawer (panneau bas, geste mobile)',
      use: 'side="bottom" sur `SheetContent`',
      avoid: 'un composant `Drawer` à part : c’est le même panneau, un côté différent',
    },
    {
      when: 'un panneau non bloquant (inspecteur, aide)',
      use: 'modal={false}',
      avoid: 'un overlay cliquable sur un panneau non modal : l’app décide de la fermeture',
    },
  ],
}
