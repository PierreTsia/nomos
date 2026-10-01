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
    'Une barre de déclencheurs et les panneaux correspondants, un seul visible à la fois. ' +
    'Livré en parts importables séparément ; les libellés et le contenu viennent de l’app.',
  level: 'primitive',
  example: {
    defaultValue: 'a',
    children: createElement(
      Fragment,
      null,
      createElement(
        TabsList,
        null,
        createElement(TabsTrigger, { value: 'a' }, 'Onglet A'),
        createElement(TabsTrigger, { value: 'b' }, 'Onglet B'),
      ),
      createElement(TabsContent, { value: 'a' }, 'Le panneau A.'),
      createElement(TabsContent, { value: 'b' }, 'Le panneau B.'),
    ),
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'Les parts : une barre (`TabsList`), des déclencheurs, des panneaux.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'L’onglet actif au départ, quand l’app ne contrôle pas l’état.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'L’onglet actif, contrôlé par l’app.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Rappelé quand l’utilisateur change d’onglet.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      required: false,
      check: 'accepted',
      description: 'L’axe de la barre, qui décide des flèches du clavier. Défaut horizontal.',
    },
  ],
  usages: [
    {
      when: 'basculer entre des vues sœurs sans quitter la page',
      use: '<Tabs defaultValue="…"><TabsList><TabsTrigger value="…">…</TabsTrigger></TabsList><TabsContent value="…">…</TabsContent></Tabs>',
      avoid: 'des onglets pour une navigation : ce sont des vues sœurs, pas des routes',
    },
  ],
}
