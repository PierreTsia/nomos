import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de la modale (ADR 0005, 0019). Le cœur fournit la structure et la couche
 * flottante issue des tokens (ADR 0027) ; tous les textes — déclencheur, fermeture,
 * actions — viennent de l'app.
 */
export const dialogManifest: ComponentManifest = {
  name: 'dialog',
  title: 'Dialog',
  summary:
    'A modal centered on a scrim: a trigger, a title, a description, a body ' +
    'and a footer. Stacking, the scrim and motion come from the tokens; no text ' +
    'is specific to the core.',
  level: 'bloc',
  example: {
    trigger: 'Open',
    title: 'Confirm',
    description: 'An action that is hard to undo.',
    body: 'The content of the modal.',
    footer: 'Actions',
    closeLabel: 'Close',
    defaultOpen: true,
  },
  variants: [],
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The trigger content: a word or a short label, never a sentence.',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The modal title; it names the action or the decision.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'A subtitle under the title, to explain without weighing down the body.',
    },
    {
      name: 'body',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The modal body: the content to read or to decide on.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The actions, right-aligned on large screens.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      required: true,
      check: 'accepted',
      description: 'The accessible label of the close button (the core has no i18n).',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The controlled open state: it lives in the app.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The initial open state, when the app does not control it.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user asks to open or close.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: 'The caller’s classes, merged after those of the core.',
    },
  ],
  usages: [
    {
      when: 'asking for a decision or an input in a centered surface that blocks the view',
      use: '<Dialog trigger="Delete" title="Delete?" closeLabel="Close">…</Dialog>',
      avoid: 'a `Dialog` for non-blocking information: an `Alert` is enough',
    },
    {
      when: 'controlling the opening from the app (state, navigation)',
      use: '`open` + `onOpenChange`',
      avoid: 'mixing `open` and `defaultOpen`: one is controlled, the other is not',
    },
    {
      when: 'a destructive action in the footer',
      use: 'a `Button` `variant="destructive"` in `footer`',
      avoid: 'an action text written by the core: labels come from the app',
    },
  ],
}
