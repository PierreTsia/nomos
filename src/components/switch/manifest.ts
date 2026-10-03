import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de l'interrupteur (ADR 0005, ADR 0015). */
export const switchManifest: ComponentManifest = {
  name: 'switch',
  title: 'Switch',
  summary:
    'A switch that toggles a state right away, controlled by props ' +
    "(`checked` + `onCheckedChange`). The core owns neither the state nor the action.",
  level: 'primitive',
  example: { checked: true, onCheckedChange: () => {} },
  variants: [],
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'On or off; the value lives with the caller.',
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
      description: 'Disables the switch.',
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
      when: 'turning on/off an option that takes effect immediately',
      use: '<Switch checked={v} onCheckedChange={set} aria-label={…} />',
      avoid: 'a `Switch` for a choice that needs a “Save” button: prefer a `Checkbox`',
    },
  ],
}
