import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste de la fenêtre de conversation (ADR 0005, 0032). Le cœur possède le
 * défilement et la région `log` ; l'app le contenu, l'état vide et la hauteur.
 */
export const conversationManifest: ComponentManifest = {
  name: 'conversation',
  title: 'Conversation',
  summary:
    'The viewport of a conversation: a live `log` region anchored at the bottom. The core ' +
    'owns the scrolling (stay at the bottom when a message arrives, return on demand); the ' +
    'app owns the content, the empty state and the height.',
  level: 'bloc',
  example: { label: 'Conversation' },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'The messages, supplied by the app.',
    },
    {
      name: 'empty',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'What to show while there is nothing, injected by the app.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      check: 'rendered',
      description: 'The accessible name of the conversation region.',
    },
    {
      name: 'scrollToBottomLabel',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The label of the scroll-to-bottom button; absent, the button never shows.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core ones (the height lives here).",
    },
  ],
  usages: [
    {
      when: 'framing a transcript of messages',
      use: 'Conversation with the messages as children and empty for the blank state',
      avoid: 'a fixed height in the core: the app sizes the viewport through className',
    },
    {
      when: 'the user has scrolled up while a reply streams in',
      use: 'scrollToBottomLabel to offer the way back',
      avoid: 'an unlabeled icon button: without the label it is mute to a screen reader',
    },
  ],
}
