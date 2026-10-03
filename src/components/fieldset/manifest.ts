import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du regroupement de champs (ADR 0005, ADR 0015). */
export const fieldsetManifest: ComponentManifest = {
  name: 'fieldset',
  title: 'Fieldset',
  summary:
    'A grouping of related fields. Semantics (`fieldset`) and token spacing; ' +
    "the group title (`legend`) comes from the app.",
  level: 'primitive',
  example: { children: 'field group' },
  variants: [],
  props: [
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
      description: 'The grouped fields (and their `legend`).',
    },
  ],
  usages: [
    {
      when: 'group related fields of a form',
      use: '<Fieldset><legend>…</legend> …fields… </Fieldset>',
      avoid: 'a `<div>`: the form-group semantics are lost',
    },
  ],
}
