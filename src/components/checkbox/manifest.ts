import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la case à cocher (ADR 0005, ADR 0015). */
export const checkboxManifest: ComponentManifest = {
  name: 'checkbox',
  title: 'Checkbox',
  summary:
    "A checkbox, controlled by props (`checked` + `onCheckedChange`). The core owns " +
    "neither the state nor the validation; a11y comes from Radix.",
  level: 'primitive',
  example: { checked: true, onCheckedChange: () => {} },
  variants: [],
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Checked or not; the value lives in the caller.',
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'The toggle callback.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the checkbox.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core ones.",
    },
  ],
  usages: [
    {
      when: 'check an independent option',
      use: '<Checkbox checked={v} onCheckedChange={set} />',
      avoid: 'expect internal state: the value stays in the app',
    },
    {
      when: 'name the checkbox',
      use: 'a `Label htmlFor` or an `aria-label`',
      avoid: 'a checkbox without a label: it becomes mute for a screen reader',
    },
  ],
}
