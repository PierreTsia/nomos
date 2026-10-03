import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la bascule (ADR 0005, ADR 0015). Deux états, contrôlés par props. */
export const toggleManifest: ComponentManifest = {
  name: 'toggle',
  title: 'Toggle',
  summary:
    'A two-state button: pressed or not. A momentary toggle (mode, filter), not a ' +
    'setting that persists like `Switch`. Controlled by props, a11y by Radix.',
  level: 'primitive',
  example: { children: 'compact', defaultPressed: true },
  variants: [
    {
      name: 'variant',
      values: ['default', 'outline'],
      default: 'default',
      description: 'The button’s tone — a discreet solid, or outlined for a toolbar.',
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg'],
      default: 'default',
      description: 'The size of the control, from the most discreet to the widest.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'The toggle’s label or icon.',
    },
    {
      name: 'pressed',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The pressed state, controlled by the caller.',
    },
    {
      name: 'onPressedChange',
      type: '(pressed: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'The toggle callback.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the toggle.',
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
      when: 'a mode or a filter that is enabled momentarily',
      use: '<Toggle pressed={v} onPressedChange={set}>compact</Toggle>',
      avoid: 'a `Toggle` for a setting that persists: that is a `Switch`',
    },
    {
      when: 'letting the toggle own its state',
      use: 'defaultPressed (uncontrolled)',
      avoid: 'mixing `pressed` and `defaultPressed`: one cancels the other',
    },
  ],
}
