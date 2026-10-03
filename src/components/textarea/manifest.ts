import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du champ multiligne (ADR 0005, ADR 0015). */
export const textareaManifest: ComponentManifest = {
  name: 'textarea',
  title: 'Textarea',
  summary:
    "A multiline input. It carries the token styles and forwards every HTML " +
    "attribute of `<textarea>`; the value and the change stay with the caller.",
  level: 'primitive',
  example: { placeholder: 'your message' },
  variants: [],
  props: [
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "The hint text, shown while the field is empty.",
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
      when: 'entering text over several lines',
      use: '<Textarea rows={4} placeholder={…} />',
      avoid: 'an `<Input>` for long text: the keyboard and the height do not suit it',
    },
    {
      when: 'a controlled field inside a `Field`',
      use: '<Field label={…}><Textarea value={v} onChange={…} /></Field>',
      avoid: 'expecting internal state from the core: it has none',
    },
  ],
}
