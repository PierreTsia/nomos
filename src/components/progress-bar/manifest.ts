import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste de la ProgressBar (ADR 0005). */
export const progressBarManifest: ComponentManifest = {
  name: 'progress-bar',
  title: 'Progress bar',
  summary:
    "A task's progress against a total, ARIA `progressbar` semantics. Prefer over the " +
    '`Meter` when there is neither scale nor threshold, just a completed share.',
  level: 'primitive',
  example: { value: 60, max: 100, label: 'sync', showValue: true },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: "The progress, clamped to `0..max`: it fills the bar.",
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      check: 'rendered',
      description: 'The total (100 by default).',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "The name of what is progressing; serves as the accessible name for the progressbar role.",
    },
    {
      name: 'showValue',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'Displays the computed percentage on the right.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after those of the component.",
    },
  ],
  usages: [
    {
      when: 'a task progressing toward a total (import, sync)',
      use: '<ProgressBar value={60} max={100} label="import" showValue />',
      avoid: 'Meter, reserved for a positioned value with a threshold',
    },
    {
      when: 'a completed share without scale or threshold',
      use: '<ProgressBar value={3} max={10} />',
      avoid: 'a hardcoded label in the core: the text comes from the app',
    },
  ],
}
