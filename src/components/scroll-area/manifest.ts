import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de la zone défilante (ADR 0005). Purement cosmétique : le défilement reste
 * natif, le cœur ne le remplace pas.
 */
export const scrollAreaManifest: ComponentManifest = {
  name: 'scroll-area',
  title: 'ScrollArea',
  summary:
    'A bounded surface whose larger content scrolls, with a styled bar. ' +
    'Cosmetic — scrolling stays native; the content comes from the app.',
  level: 'primitive',
  example: {
    className: 'h-24 w-48 rounded-md border',
    children: 'Content larger than the surface.',
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The scrolling content.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: 'The caller’s classes, merged after the core’s (here height and width).',
    },
    {
      name: 'type',
      type: "'auto' | 'always' | 'scroll' | 'hover'",
      required: false,
      check: 'accepted',
      description: 'When the bar appears. Default `hover`.',
    },
  ],
  usages: [
    {
      when: 'bounding a dense subview (log, file list) to a fixed height',
      use: '<ScrollArea className="h-64">…</ScrollArea>',
      avoid: 'a `ScrollArea` that fills the whole page: the scrolling is the document’s',
    },
  ],
}
