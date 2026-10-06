import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de l'avatar (ADR 0005). Natif `<img>` + repli — **aucune dépendance**
 * (ADR 0002, 0019) : le repli et le texte alternatif viennent de l'app.
 */
export const avatarManifest: ComponentManifest = {
  name: 'avatar',
  title: 'Avatar',
  summary:
    'A round image with a fallback when it is missing or fails. No dependency: the ' +
    'native `<img>` and its `onError` are enough; the fallback and the alternative text come from the app.',
  level: 'primitive',
  example: {
    alt: 'Profile photo',
    fallback: 'PT',
  },
  variants: [],
  props: [
    {
      name: 'src',
      type: 'string',
      required: false,
      check: 'attribute',
      description: 'The image URL; when absent, the fallback shows directly.',
    },
    {
      name: 'alt',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The alternative text: it names the person (provided by the app).',
    },
    {
      name: 'fallback',
      type: 'ReactNode',
      required: true,
      check: 'rendered',
      description: 'The fallback when there is no image, or it fails: initials, an icon.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: 'The caller\'s classes, merged after the core ones.',
    },
    {
      name: 'imgProps',
      type: 'ImgHTMLAttributes<HTMLImageElement>',
      required: false,
      check: 'accepted',
      description:
        'Extra native `<img>` attributes forwarded to the internal image (referrerPolicy, loading, …).',
    },
  ],
  usages: [
    {
      when: 'represent a person or an entity by their image',
      use: 'a `src` and a `fallback` (initials) provided by the app',
      avoid: 'wait for an image that can fail: always a `fallback`',
    },
    {
      when: 'a decorative image with no person behind it',
      use: 'a plain `<img>` from the app',
      avoid: 'an `Avatar` without `alt`: it names a person, it does not decorate',
    },
  ],
}
