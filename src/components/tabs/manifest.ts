import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@nomos/components/tabs/tabs'

/**
 * Le manifeste des onglets (ADR 0005). Le catalogue enregistre la racine `Tabs` ; les
 * parts se composent dans l'exemple. Aucun libellé n'est propre au cœur.
 */
export const tabsManifest: ComponentManifest = {
  name: 'tabs',
  title: 'Tabs',
  summary:
    'A bar of triggers and their matching panels, only one visible at a time. ' +
    'Shipped as separately importable parts; labels and content come from the app.',
  level: 'primitive',
  example: {
    defaultValue: 'a',
    children: createElement(
      Fragment,
      null,
      createElement(
        TabsList,
        null,
        createElement(TabsTrigger, { value: 'a' }, 'Tab A'),
        createElement(TabsTrigger, { value: 'b' }, 'Tab B'),
      ),
      createElement(TabsContent, { value: 'a' }, 'Panel A.'),
      createElement(TabsContent, { value: 'b' }, 'Panel B.'),
    ),
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The parts: a bar (`TabsList`), triggers, panels.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The tab active at first, when the app does not control state.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The active tab, controlled by the app.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user switches tabs.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      required: false,
      check: 'accepted',
      description: 'The bar axis, which decides the keyboard arrows. Horizontal by default.',
    },
  ],
  usages: [
    {
      when: 'switching between sibling views without leaving the page',
      use: '<Tabs defaultValue="…"><TabsList><TabsTrigger value="…">…</TabsTrigger></TabsList><TabsContent value="…">…</TabsContent></Tabs>',
      avoid: 'tabs for navigation: they are sibling views, not routes',
    },
  ],
}
