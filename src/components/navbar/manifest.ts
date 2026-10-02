import { createElement } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la barre supérieure (ADR 0005, 0030). Slots injectés, aucun routing. */
export const navbarManifest: ComponentManifest = {
  name: 'navbar',
  title: 'Navbar',
  summary:
    "La barre supérieure d'un site : une marque, des emplacements de navigation et un " +
    "groupe d'actions en fin. Sticky en haut, bordure basse, fond du cœur. Les slots sont " +
    'injectés — le cœur ne porte ni routing ni mot produit (ADR 0002, 0030).',
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
      description: 'La marque : un wordmark, un logo, un badge de version.',
    },
    {
      name: 'nav',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Les emplacements de navigation, fournis par l’appelant.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Le groupe d’actions de fin : boutons, menu, avatar.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
  ],
  usages: [
    {
      when: 'poser l’en-tête d’un site : marque, navigation, actions',
      use: '<Navbar brand={<Wordmark/>} nav={<AppNav/>} actions={<Button…/>} />',
      avoid: 'un `<header>` stylé au coup par coup : on perd les tokens de bordure et de fond',
    },
    {
      when: 'les liens et les libellés de navigation',
      use: 'des slots injectés par l’app (ADR 0015)',
      avoid: 'un `href` ou un mot produit en dur dans le cœur : le routing appartient à l’app',
    },
  ],
}
