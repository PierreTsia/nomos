import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nomos/components/tooltip/tooltip'

/**
 * Le manifeste de l'infobulle (ADR 0005). Le catalogue enregistre la famille sur sa
 * racine obligatoire, `TooltipProvider` ; `Tooltip`, `TooltipTrigger` et `TooltipContent`
 * se composent dans l'exemple. La bulle lit le `z-index` tokenisé (ADR 0027).
 */
export const tooltipManifest: ComponentManifest = {
  name: 'tooltip',
  title: 'Tooltip',
  summary:
    'Un texte d’aide attaché à un déclencheur, au survol et au focus. La famille se ' +
    'compose — Provider (délai partagé), Root, Trigger, Content ; les textes viennent de l’app.',
  level: 'primitive',
  example: {
    delayDuration: 200,
    children: createElement(
      Fragment,
      null,
      createElement(
        Tooltip,
        { defaultOpen: true },
        createElement(TooltipTrigger, null, 'Aide'),
        createElement(TooltipContent, null, 'Texte d’aide'),
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
      description: 'La famille : des `Tooltip` (racine), à poser dans le provider.',
    },
    {
      name: 'delayDuration',
      type: 'number',
      required: false,
      check: 'accepted',
      description: 'Le délai d’ouverture au survol, en millisecondes. Défaut 700.',
    },
    {
      name: 'skipDelayDuration',
      type: 'number',
      required: false,
      check: 'accepted',
      description: 'La fenêtre pendant laquelle une seconde bulle s’ouvre sans attendre.',
    },
    {
      name: 'disableHoverableContent',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Empêche de survoler le contenu ouvert sans qu’il se referme.',
    },
  ],
  usages: [
    {
      when: 'nommer un contrôle iconique, ou glisser une aide courte',
      use: '<TooltipProvider><Tooltip><TooltipTrigger>…</TooltipTrigger><TooltipContent>…</TooltipContent></Tooltip></TooltipProvider>',
      avoid: 'une `Tooltip` pour une information essentielle : elle n’est ni au clavier seul ni au tactile',
    },
    {
      when: 'plusieurs bulles dans la même vue',
      use: 'un seul `TooltipProvider` autour de leurs `Tooltip`',
      avoid: 'un provider par `Tooltip` : le délai partagé perd son sens',
    },
  ],
}
