import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du libellé (ADR 0005, ADR 0015). */
export const labelManifest: ComponentManifest = {
  name: 'label',
  title: 'Label',
  summary:
    "A field label, associated with the control via `htmlFor`. The text comes from the caller " +
    "(the core has no i18n); the typography comes from the tokens.",
  level: 'primitive',
  example: { children: 'Label' },
  variants: [],
  props: [
    {
      name: 'htmlFor',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "The associated control's `id`: clicking the label focuses the field (rendered as the `for` attribute).",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "The label text, injected by the app.",
    },
  ],
  usages: [
    {
      when: 'naming a field and associating it with its control',
      use: '<Label htmlFor="email">Address</Label>',
      avoid: 'a label without `htmlFor`: clicking does not focus the field',
    },
    {
      when: 'placing a label outside a `Field`',
      use: 'the same atom, with your own spacing',
      avoid: 'hand-coding a styled `<label>`: you lose the token typography',
    },
  ],
}
