import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du champ numérique (ADR 0005, ADR 0015). Le natif porte pas et bornes. */
export const numberFieldManifest: ComponentManifest = {
  name: 'number-field',
  title: 'NumberField',
  summary:
    "A number field (`<input type=\"number\">`): the step and bounds come from the " +
    "native control (`step`, `min`, `max`). The value and callback remain with the caller. " +
    "It forwards `Input`'s `size`, `variant` and `icon` variants.",
  level: 'primitive',
  example: { placeholder: '0', step: 1, min: 0, max: 10 },
  variants: [],
  props: [
    {
      name: 'step',
      type: 'number',
      required: false,
      check: 'attribute',
      description: 'The native spinner step.',
    },
    {
      name: 'min',
      type: 'number',
      required: false,
      check: 'attribute',
      description: 'The lower bound.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      check: 'attribute',
      description: 'The upper bound.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "The placeholder text, displayed while the field is empty.",
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The current value, controlled by the caller.',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement>',
      required: false,
      check: 'accepted',
      description: 'The input callback.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the field.',
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
      when: 'placing a bounded number with a step',
      use: '<NumberField min={0} max={100} step={5} value={v} onChange={…} />',
      avoid: 'expecting validation or formatting from the core: they belong to the app',
    },
    {
      when: 'a controlled field',
      use: '<NumberField value={v} onChange={…} /> (the state stays in the app)',
      avoid: 'internal state: the core has none',
    },
  ],
}
