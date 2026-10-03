import type { ComponentManifest } from '@nomos/catalogue/contract'
import { TONES } from '@nomos/lib/tone'

/** Le manifeste de la notification (ADR 0005, ADR 0020). Le ton réutilise `toneClasses`. */
export const toastManifest: ComponentManifest = {
  name: 'toast',
  title: 'Toast',
  summary:
    'A floating notification: a message, a detail, an action, a close. The tone ' +
    'comes from the core; the queue and the timers live in `ToastProvider`.',
  level: 'primitive',
  example: { tone: 'success', message: 'reindexed', description: '12 items' },
  variants: [
    {
      name: 'tone',
      values: [...TONES],
      default: 'info',
      description: "The notification's intent — what the caller chooses according to usage.",
    },
  ],
  props: [
    {
      name: 'message',
      type: 'ReactNode',
      required: true,
      check: 'rendered',
      description: 'The main message: one line, never a sentence.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      required: false,
      check: 'rendered',
      description: 'A detail below the message, more discreet.',
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'An action: a button, a link.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "Replaces the tone's default icon.",
    },
    {
      name: 'onClose',
      type: '() => void',
      required: false,
      check: 'accepted',
      description: 'Shows a close button and calls it on click.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: "The accessible label of the close button (required with `onClose`).",
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
      when: 'saying what an action produced, without blocking the view',
      use: 'via `useToast().show({ message })` (the `ToastProvider` manages the queue)',
      avoid: 'a hand-mounted `Toast`: the queue and auto-dismiss live in the provider',
    },
    {
      when: 'reporting a failure that must be seen',
      use: 'tone "danger" and a `description` that names the cause',
      avoid: 'a toast for a page load error: that is an `EmptyState`',
    },
  ],
}