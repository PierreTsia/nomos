import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du Counter (ADR 0005). */
export const counterManifest: ComponentManifest = {
  name: 'counter',
  title: 'Counter',
  summary:
    'A number put forward, with a suffix and a label provided by the app. No ' +
    'formatting or unit in the core: the text and the number come from the caller.',
  level: 'primitive',
  example: { value: 128, suffix: 'issues', label: 'open' },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'number',
      required: true,
      check: 'rendered',
      description: 'The number put forward.',
    },
    {
      name: 'suffix',
      type: 'string',
      required: false,
      check: 'rendered',
      description: "The unit or sign that follows the number, provided by the caller.",
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'The name of what is being counted.',
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
      when: 'a total to read at a glance (open issues, pending PRs)',
      use: '<Counter value={128} suffix="issues" label="open" />',
      avoid: 'a number buried in a sentence: the counter is meant to be seen alone',
    },
    {
      when: 'a figure without a unit',
      use: '<Counter value={7} />',
      avoid: 'inventing a unit in the core: it belongs to the app',
    },
  ],
}
