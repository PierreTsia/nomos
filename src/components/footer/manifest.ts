import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du pied de page (ADR 0005, ADR 0015). Un bloc du cœur : la mise en page
 * est au cœur, les emplacements (marque, liens, ligne légale) sont injectés par l'app.
 */
export const footerManifest: ComponentManifest = {
  name: 'footer',
  title: 'Footer',
  summary:
    'Le pied de page : une marque, une rangée de liens et une ligne légale. Des ' +
    'emplacements injectés, sans routing ni libellé propre au cœur (ADR 0002).',
  level: 'bloc',
  example: {
    brand: 'Nomos',
    links: 'Documentation · GitHub',
    legal: '© 2026 Nomos',
  },
  variants: [],
  props: [
    {
      name: 'brand',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'Le wordmark ou le logo, fourni par l’appelant.',
    },
    {
      name: 'links',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'La rangée de liens, fournie par l’appelant (des `Link`, par exemple).',
    },
    {
      name: 'legal',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'La ligne légale (copyright, mentions), fournie par l’appelant.',
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
      when: 'poser un pied de page sous le contenu d’une vue',
      use: '<Footer brand={<Wordmark/>} links={<><Link…/><Link…/></>} legal={t(\'legal\')} />',
      avoid: 'un `<footer>` stylé au coup par coup : on perd les tokens de bordure et de fond',
    },
    {
      when: 'un pied minimal, sans ligne légale',
      use: 'omettre `legal` : le bloc se réduit à la marque et aux liens',
      avoid: 'un emplacement vide rendu pour rien — un slot absent ne rend rien',
    },
  ],
}
