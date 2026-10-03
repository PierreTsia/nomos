import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du pied de page (ADR 0005, ADR 0015). Un bloc du cœur : la mise en page
 * est au cœur, les emplacements (marque, liens, ligne légale) sont injectés par l'app.
 */
export const footerManifest: ComponentManifest = {
  name: 'footer',
  title: 'Footer',
  summary:
    'The footer: a brand, a row of links and a legal line. Injected ' +
    'slots, with no routing or core-owned text (ADR 0002).',
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
      description: 'The wordmark or logo, provided by the caller.',
    },
    {
      name: 'links',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The row of links, provided by the caller (e.g. `Link`s).',
    },
    {
      name: 'legal',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The legal line (copyright, notices), provided by the caller.',
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
      when: 'place a footer below a view’s content',
      use: '<Footer brand={<Wordmark/>} links={<><Link…/><Link…/></>} legal={t(\'legal\')} />',
      avoid: 'an ad-hoc styled `<footer>`: the border and background tokens are lost',
    },
    {
      when: 'a minimal footer, without the legal line',
      use: 'omit `legal`: the block reduces to the brand and the links',
      avoid: 'an empty slot rendered for nothing — an absent slot renders nothing',
    },
  ],
}
