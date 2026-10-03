/**
 * Dev-only preview of the conversation surface (not part of the routed site, and not
 * type-checked against the published package — it uses unreleased local bricks).
 *
 *   NOMOS_LOCAL=1 npm --prefix site run dev -- --port 5177
 *   open http://localhost:5177/chat.html
 */
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import {
  Button,
  Composer,
  Conversation,
  Heading,
  Message,
  Text,
  TypingIndicator,
  useChatThread,
} from '@nomosui/react'
import type { ChatPart, ChatTransport } from '@nomosui/react'

import './styles.css'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** A mock transport: streams a canned reply token by token, then a structured part. */
const transport: ChatTransport = {
  send: ({ text }) =>
    (async function* () {
      const reply = `Understood — building around "${text}". Here is what I would do:`
      for (const word of reply.split(' ')) {
        await sleep(70)
        yield { kind: 'text-delta' as const, text: `${word} ` }
      }
      await sleep(400)
      yield {
        kind: 'part' as const,
        part: {
          type: 'reasoning',
          text: 'Three full-body days, one rest day between each.',
          state: 'done',
        } satisfies ChatPart,
      }
      await sleep(500)
      yield {
        kind: 'part' as const,
        part: { type: 'data', name: 'draft_ready', payload: { days: 3 } } satisfies ChatPart,
      }
    })(),
}

function renderPart(part: ChatPart) {
  if (part.type === 'text') {
    return <p className="whitespace-pre-wrap text-body">{part.text}</p>
  }
  if (part.type === 'reasoning') {
    return <p className="whitespace-pre-wrap text-caption italic text-muted-foreground">{part.text}</p>
  }
  if (part.type === 'data' && part.name === 'draft_ready') {
    return (
      <Button type="button" size="sm" onClick={() => window.alert('Draft committed (demo)')}>
        Generate program
      </Button>
    )
  }
  return null
}

export function Demo() {
  const [input, setInput] = useState('')
  const thread = useChatThread({ transport })
  const busy = thread.status === 'submitted' || thread.status === 'streaming'
  const showTyping = busy && (thread.messages.at(-1)?.parts.length ?? 0) === 0

  function submit() {
    if (input.trim() === '') return
    thread.send(input)
    setInput('')
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col gap-3 p-6">
      <div className="flex flex-col gap-1">
        <Heading level={3}>Conversation surface</Heading>
        <Text size="caption" className="text-muted-foreground">
          Local Nomos preview — mock transport, token streaming, a data part as the call to action.
        </Text>
      </div>

      <Conversation
        className="min-h-0 flex-1 rounded-lg border border-border bg-card"
        label="Conversation"
        scrollToBottomLabel="Scroll to bottom"
        empty={
          <Text size="caption" className="text-muted-foreground">
            Say hello to start.
          </Text>
        }
      >
        <div className="flex flex-col gap-4 p-4">
          {thread.messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              parts={message.parts}
              renderPart={renderPart}
            />
          ))}
          {showTyping ? (
            <div className="flex items-center gap-2 px-1">
              <TypingIndicator label="Assistant is typing" />
            </div>
          ) : null}
        </div>
      </Conversation>

      <Composer
        value={input}
        onChange={setInput}
        onSubmit={submit}
        onStop={thread.stop}
        busy={busy}
        placeholder="Write a message…"
        sendLabel="Send"
        stopLabel="Stop"
      />
    </div>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(<Demo />)
