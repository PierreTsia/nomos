import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du composeur (ADR 0005, 0032). Contrôlé par props, sans état : l'app
 * possède la valeur, le cœur la mise en forme et la garde clavier.
 */
export const composerManifest: ComponentManifest = {
  name: 'composer',
  title: 'Composer',
  summary:
    'A message composer: a growing textarea where Enter sends and Shift+Enter breaks the ' +
    'line, with the IME guard. Controlled by props (value + onChange), it owns no state; ' +
    'the labels come from the app.',
  level: 'bloc',
  example: {
    value: '',
    placeholder: 'Write a message',
    sendLabel: 'Send',
    stopLabel: 'Stop',
  },
  variants: [],
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The current value, owned by the app.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Called on each keystroke with the new value.',
    },
    {
      name: 'onSubmit',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Called on Enter or on the send action.',
    },
    {
      name: 'onStop',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Called on the stop action while a reply is in flight.',
    },
    {
      name: 'busy',
      type: 'boolean',
      required: false,
      check: 'rendered',
      description: 'A reply is in flight: the action becomes stop.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The hint text of the textarea.',
    },
    {
      name: 'sendLabel',
      type: 'string',
      required: true,
      check: 'rendered',
      description: 'The accessible label of the send action.',
    },
    {
      name: 'stopLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The accessible label of the stop action.',
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
      when: 'collecting the next user turn',
      use: 'Composer value + onChange + onSubmit',
      avoid: 'a composer that owns its value: the app must be able to clear or prefill it',
    },
    {
      when: 'a reply is streaming and the user wants to interrupt',
      use: 'busy + onStop',
      avoid: 'disabling the field without an escape: stopping is how the user regains control',
    },
  ],
}
