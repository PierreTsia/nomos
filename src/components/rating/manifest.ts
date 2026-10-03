import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du Rating (ADR 0005). */
export const ratingManifest: ComponentManifest = {
  name: 'rating',
  title: 'Rating',
  summary:
    'A rating out of `max` stars, **controlled**. Interactive only if the app provides ' +
    '`onValueChange`; otherwise a display. A11y `radiogroup` (arrows, Home/End).',
  level: 'primitive',
  example: { value: 3, max: 5, ariaLabel: 'Rating', onValueChange: () => {} },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'The current rating, from 0 to `max`.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      check: 'rendered',
      description: 'The number of stars (5 by default).',
    },
    {
      name: 'onValueChange',
      type: '(value: number) => void',
      required: false,
      check: 'accepted',
      description: 'Makes the rating interactive when provided; the app decides what follows.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Forces display only, even if `onValueChange` is provided.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'The accessible name of the group: the core has no i18n.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the component's.",
    },
  ],
  usages: [
    {
      when: 'collecting a rating from the user',
      use: '<Rating value={note} onValueChange={setNote} ariaLabel={t.rating.label} />',
      avoid: 'letting the Rating own the value: the data belongs to the app',
    },
    {
      when: 'showing an existing rating',
      use: '<Rating value={4} readOnly ariaLabel={t.rating.label} />',
      avoid: 'an `onValueChange` with no intent to consume it',
    },
  ],
}
