import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du message (ADR 0005, 0032). Le cœur possède le placement et le ton ;
 * le contenu arrive en **parts**, et `renderPart` laisse l'app décider du rendu.
 */
export const messageManifest: ComponentManifest = {
  name: 'message',
  title: 'Message',
  summary:
    'One message of a conversation: a role, an ordered list of parts, and injected slots ' +
    '(avatar, actions, timestamp). The core owns the alignment and the tone; the app owns ' +
    'the content, part by part.',
  level: 'bloc',
  example: { role: 'assistant', parts: [{ type: 'text', text: 'Here is your plan.' }] },
  variants: [],
  props: [
    {
      name: 'role',
      type: 'ChatRole',
      required: true,
      check: 'rendered',
      description: 'Who speaks: decides the alignment and the tone. `user` aligns right.',
    },
    {
      name: 'parts',
      type: 'ChatPart[]',
      required: true,
      check: 'accepted',
      description: 'The content fragments, in order: text, reasoning, tool or data.',
    },
    {
      name: 'renderPart',
      type: '(part: ChatPart) => ReactNode',
      required: false,
      check: 'accepted',
      description: 'The app rendering of a part; absent, the core renders a neutral default.',
    },
    {
      name: 'avatar',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The speaker avatar, injected by the app.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The message actions (copy, retry), injected by the app.',
    },
    {
      name: 'timestamp',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: 'The already-formatted timestamp, injected by the app.',
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
      when: 'rendering a turn of a conversation',
      use: 'Message role={message.role} parts={message.parts}',
      avoid: 'splitting a message into several bubbles: the parts belong to one message',
    },
    {
      when: 'the app owns markdown, syntax colouring or a domain artifact',
      use: 'renderPart for every part',
      avoid: 'parsing assistant prose for a sentinel: make it a tool or data part instead',
    },
  ],
}
