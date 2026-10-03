import { createElement } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la barre supérieure (ADR 0005, 0030). Slots injectés, aucun routing. */
export const navbarManifest: ComponentManifest = {
  name: 'navbar',
  title: 'Navbar',
  summary:
    "A site's top bar: a brand, navigation slots, and an actions group at the end. Sticky at " +
    'the top, bottom border, core background. Slots are injected — the core carries neither ' +
    'routing nor product words (ADR 0002, 0030).',
  level: 'bloc',
  example: {
    brand: 'Nomos',
    nav: createElement('a', { href: '#', key: 'docs' }, 'Docs'),
    actions: createElement('button', { type: 'button', key: 'action' }, 'Action'),
  },
  variants: [],
  props: [
    {
      name: 'brand',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The brand: a wordmark, a logo, a version badge.',
    },
    {
      name: 'nav',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The navigation slots, provided by the caller.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The end actions group: buttons, menu, avatar.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
  ],
  usages: [
    {
      when: 'placing a site header: brand, navigation, actions',
      use: '<Navbar brand={<Wordmark/>} nav={<AppNav/>} actions={<Button…/>} />',
      avoid: 'a `<header>` styled ad hoc: you lose the border and background tokens',
    },
    {
      when: 'navigation links and labels',
      use: 'slots injected by the app (ADR 0015)',
      avoid: 'a hardcoded `href` or product word in the core: routing belongs to the app',
    },
  ],
}
