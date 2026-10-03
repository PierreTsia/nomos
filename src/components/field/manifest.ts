import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de l'emplacement de champ (ADR 0005, ADR 0015). */
export const fieldManifest: ComponentManifest = {
  name: 'field',
  title: 'Field',
  summary:
    "A field's slot: label, control (provided by the app), then hint or error " +
    "message. No engine: the app owns the state, validation and text.",
  level: 'primitive',
  example: { label: 'Label', hint: 'Hint', children: 'field' },
  variants: [],
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      check: 'rendered',
      description: "The field label; when absent, no label is rendered.",
    },
    {
      name: 'hint',
      type: 'ReactNode',
      required: false,
      check: 'rendered',
      description: "The hint below the field, shown when there is no error.",
    },
    {
      name: 'error',
      type: 'string | null',
      required: false,
      check: 'rendered',
      description: "The error message, **already formatted** by the app: it replaces the hint.",
    },
    {
      name: 'htmlFor',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "The control's `id`, passed to the label as the `for` attribute.",
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
      description: 'The control (Input, Select, …), provided by the caller.',
    },
  ],
  usages: [
    {
      when: 'lay out a label, a control and a hint',
      use: '<Field label="Adresse" hint="…"><Input … /></Field>',
      avoid: 'expecting validation from the core: the error message is injected, not computed',
    },
    {
      when: 'show a validation error',
      use: '<Field label="Adresse" error={message}>…</Field>',
      avoid: 'passing the rule or the offending field: the core only knows the final text',
    },
  ],
}
