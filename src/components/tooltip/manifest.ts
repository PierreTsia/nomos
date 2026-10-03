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
    'A help text attached to a trigger, on hover and focus. The family composes ' +
    '— Provider (shared delay), Root, Trigger, Content; the texts come from the app.',
  level: 'primitive',
  example: {
    delayDuration: 200,
    children: createElement(
      Fragment,
      null,
      createElement(
        Tooltip,
        { defaultOpen: true },
        createElement(TooltipTrigger, null, 'Help'),
        createElement(TooltipContent, null, 'Help text'),
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
      description: 'The family: `Tooltip`s (roots), to place inside the provider.',
    },
    {
      name: 'delayDuration',
      type: 'number',
      required: false,
      check: 'accepted',
      description: 'The opening delay on hover, in milliseconds. Default 700.',
    },
    {
      name: 'skipDelayDuration',
      type: 'number',
      required: false,
      check: 'accepted',
      description: 'The window during which a second tooltip opens without waiting.',
    },
    {
      name: 'disableHoverableContent',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Prevents hovering the open content from closing it.',
    },
  ],
  usages: [
    {
      when: 'naming an icon-only control, or slipping in a short help',
      use: '<TooltipProvider><Tooltip><TooltipTrigger>…</TooltipTrigger><TooltipContent>…</TooltipContent></Tooltip></TooltipProvider>',
      avoid: 'a `Tooltip` for essential information: it is neither keyboard-only nor touch accessible',
    },
    {
      when: 'several tooltips in the same view',
      use: 'a single `TooltipProvider` around their `Tooltip`s',
      avoid: 'one provider per `Tooltip`: the shared delay loses its meaning',
    },
  ],
}
