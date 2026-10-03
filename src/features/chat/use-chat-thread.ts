import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type {
  ChatDelta,
  ChatMessage,
  ChatPart,
  ChatStatus,
  ChatTransport,
} from '@nomos/features/chat/types'

/**
 * Le contrôleur d'un fil de conversation : l'analogue de `FacetedDataTable` pour le chat
 * (ADR 0032). Il possède la **machine à états** — ajout optimiste du tour utilisateur,
 * assemblage des deltas, annulation, réessai, erreur — et **rien du transport** : l'app
 * injecte un `ChatTransport`, le cœur l'ignore (ADR 0018).
 *
 * Sans dépendance, testable seul : le transport d'un test est une fonction asynchrone.
 */
export type UseChatThreadOptions = {
  transport: ChatTransport
  /** Les messages déjà connus (reprise d'un fil côté serveur, par exemple). */
  initialMessages?: ChatMessage[]
}

export type ChatThread = {
  messages: ChatMessage[]
  status: ChatStatus
  error: string | null
  /** Envoie le tour de l'utilisateur et assemble la réponse. Ignore un texte vide. */
  send: (text: string) => void
  /** Annule la réponse en cours ; la part déjà reçue reste. */
  stop: () => void
  /** Relance le dernier tour de l'utilisateur (après une erreur). */
  retry: () => void
  /** Relance le dernier tour de l'utilisateur en écartant la réponse précédente. */
  regenerate: () => void
  /** Remplace le fil entier (reprise, navigation entre conversations). */
  replace: (messages: ChatMessage[]) => void
}

function textOf(message: ChatMessage): string {
  return message.parts
    .filter((part): part is Extract<ChatPart, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

/** Applique un delta au message assistant en cours d'assemblage. */
function applyDelta(message: ChatMessage, delta: ChatDelta): ChatMessage {
  switch (delta.kind) {
    case 'text-delta': {
      const parts = [...message.parts]
      const last = parts[parts.length - 1]
      if (last?.type === 'text') {
        parts[parts.length - 1] = { ...last, text: last.text + delta.text }
      } else {
        parts.push({ type: 'text', text: delta.text })
      }
      return { ...message, parts, status: 'streaming' }
    }
    case 'part':
      return { ...message, parts: [...message.parts, delta.part], status: 'streaming' }
    case 'message':
      // On garde notre identifiant stable : la suite du flux continue d'indexer le bon message.
      return { ...delta.message, id: message.id, status: delta.message.status ?? 'done' }
    case 'error':
      return { ...message, status: 'error' }
  }
}

/** Normalise un transport : un flux de deltas, ou un message complet emballé en un delta. */
async function* toDeltas(
  result: AsyncIterable<ChatDelta> | Promise<ChatMessage>,
): AsyncGenerator<ChatDelta> {
  if (typeof (result as AsyncIterable<ChatDelta>)[Symbol.asyncIterator] === 'function') {
    yield* result as AsyncIterable<ChatDelta>
    return
  }
  yield { kind: 'message', message: await (result as Promise<ChatMessage>) }
}

export function useChatThread({
  transport,
  initialMessages,
}: UseChatThreadOptions): ChatThread {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? [])
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  // Le transport peut changer d'un rendu à l'autre ; on lit toujours le dernier.
  const transportRef = useRef(transport)
  const idRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    transportRef.current = transport
  }, [transport])

  const nextId = useCallback((role: ChatMessage['role']) => {
    idRef.current += 1
    return `${role}-${idRef.current}`
  }, [])

  useEffect(() => () => abortRef.current?.abort(), [])

  /** Le corps d'un envoi : ajoute le tour, streame la réponse, referme l'état. */
  const run = useCallback(
    async (text: string) => {
      const assistantId = nextId('assistant')
      const controller = new AbortController()
      abortRef.current = controller
      setError(null)
      setStatus('submitted')
      setMessages((previous) => [
        ...previous,
        { id: assistantId, role: 'assistant', parts: [], status: 'streaming' },
      ])

      let failure: string | null = null
      try {
        const stream = toDeltas(
          transportRef.current.send({ text, signal: controller.signal }),
        )
        for await (const delta of stream) {
          if (controller.signal.aborted) break
          if (delta.kind === 'error') {
            failure = delta.error
            break
          }
          setStatus('streaming')
          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId ? applyDelta(message, delta) : message,
            ),
          )
        }
      } catch (cause) {
        failure = cause instanceof Error ? cause.message : String(cause)
      }

      const aborted = controller.signal.aborted
      abortRef.current = null

      // Un tour interrompu ou en erreur sans contenu ne laisse pas de bulle vide.
      if (aborted || failure) {
        setMessages((previous) =>
          previous
            .filter((message) => message.id !== assistantId || message.parts.length > 0)
            .map((message) =>
              message.id === assistantId ? { ...message, status: 'done' as const } : message,
            ),
        )
        if (failure) {
          setError(failure)
          setStatus('error')
        } else {
          setStatus('idle')
        }
        return
      }

      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantId ? { ...message, status: 'done' as const } : message,
        ),
      )
      setStatus('idle')
    },
    [nextId],
  )

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || status === 'submitted' || status === 'streaming') return
      setMessages((previous) => [
        ...previous,
        { id: nextId('user'), role: 'user', parts: [{ type: 'text', text: trimmed }] },
      ])
      void run(trimmed)
    },
    [nextId, run, status],
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const resend = useCallback(() => {
    if (status === 'submitted' || status === 'streaming') return
    const lastUser = [...messages].reverse().find((message) => message.role === 'user')
    if (!lastUser) return
    const text = textOf(lastUser)
    setMessages((previous) => {
      const index = previous.findIndex((message) => message.id === lastUser.id)
      return index === -1 ? previous : previous.slice(0, index + 1)
    })
    void run(text)
  }, [messages, run, status])

  const replace = useCallback((next: ChatMessage[]) => {
    abortRef.current?.abort()
    abortRef.current = null
    setMessages(next)
    setStatus('idle')
    setError(null)
  }, [])

  return useMemo(
    () => ({ messages, status, error, send, stop, retry: resend, regenerate: resend, replace }),
    [messages, status, error, send, stop, resend, replace],
  )
}
