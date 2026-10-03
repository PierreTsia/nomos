import { act, renderHook, waitFor } from '@testing-library/react'

import { useChatThread } from '@nomos/features/chat/use-chat-thread'
import type { ChatDelta, ChatMessage, ChatPart, ChatTransport } from '@nomos/features/chat/types'

function fromDeltas(deltas: ChatDelta[]): AsyncIterable<ChatDelta> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const delta of deltas) {
        await Promise.resolve()
        yield delta
      }
    },
  }
}

function textOf(message: ChatMessage | undefined): string {
  return (message?.parts ?? [])
    .filter((part): part is Extract<ChatPart, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

describe('useChatThread', () => {
  it('ajoute le tour utilisateur puis le message complet d’un transport par requête/réponse', async () => {
    const transport: ChatTransport = {
      send: async () => ({
        id: 'serveur-1',
        role: 'assistant',
        parts: [{ type: 'text', text: 'bonjour' }],
      }),
    }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('salut'))

    await waitFor(() => expect(result.current.status).toBe('idle'))
    expect(result.current.messages.map((message) => message.role)).toEqual(['user', 'assistant'])
    expect(result.current.messages[0].parts).toEqual([{ type: 'text', text: 'salut' }])
    expect(result.current.messages[1].parts).toEqual([{ type: 'text', text: 'bonjour' }])
    expect(result.current.messages[1].status).toBe('done')
  })

  it('assemble des deltas de texte et des parts structurées', async () => {
    const transport: ChatTransport = {
      send: () =>
        fromDeltas([
          { kind: 'text-delta', text: 'Hel' },
          { kind: 'text-delta', text: 'lo' },
          { kind: 'part', part: { type: 'data', name: 'ready', payload: { ok: true } } },
        ]),
    }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('salut'))

    await waitFor(() => expect(result.current.status).toBe('idle'))
    expect(result.current.messages[1].parts).toEqual([
      { type: 'text', text: 'Hello' },
      { type: 'data', name: 'ready', payload: { ok: true } },
    ])
  })

  it('garde l’identifiant stable même quand le transport renvoie son propre message', async () => {
    const transport: ChatTransport = {
      send: () =>
        fromDeltas([
          { kind: 'text-delta', text: 'a' },
          {
            kind: 'message',
            message: { id: 'autre-id', role: 'assistant', parts: [{ type: 'text', text: 'b' }] },
          },
          { kind: 'text-delta', text: 'c' },
        ]),
    }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('salut'))

    await waitFor(() => expect(result.current.status).toBe('idle'))
    expect(result.current.messages).toHaveLength(2)
    // Un delta « message » remplace les parts ; le text-delta suivant s'y ajoute encore.
    expect(textOf(result.current.messages[1])).toBe('bc')
  })

  it('sur erreur, ne laisse pas de bulle assistant vide et expose le message', async () => {
    const transport: ChatTransport = {
      send: async () => {
        throw new Error('boum')
      },
    }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('salut'))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBe('boum')
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('user')
  })

  it('relance le dernier tour sans dupliquer le message utilisateur', async () => {
    let calls = 0
    const transport: ChatTransport = {
      send: async () => {
        calls += 1
        if (calls === 1) throw new Error('boum')
        return { id: 'a', role: 'assistant', parts: [{ type: 'text', text: 'ok' }] }
      },
    }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('salut'))
    await waitFor(() => expect(result.current.status).toBe('error'))

    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('idle'))

    expect(result.current.messages.filter((message) => message.role === 'user')).toHaveLength(1)
    expect(result.current.messages.at(-1)?.parts).toEqual([{ type: 'text', text: 'ok' }])
  })

  it('arrête la réponse en cours et garde la part déjà reçue', async () => {
    const transport: ChatTransport = {
      send: ({ signal }) => ({
        async *[Symbol.asyncIterator]() {
          yield { kind: 'text-delta' as const, text: 'partiel' }
          await new Promise<void>((resolve) => {
            signal.addEventListener('abort', () => resolve(), { once: true })
          })
        },
      }),
    }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('salut'))
    await waitFor(() => expect(textOf(result.current.messages[1])).toBe('partiel'))

    act(() => result.current.stop())

    await waitFor(() => expect(result.current.status).toBe('idle'))
    expect(result.current.messages[1].parts).toEqual([{ type: 'text', text: 'partiel' }])
  })

  it('remplace le fil entier et ignore un envoi vide', () => {
    const transport: ChatTransport = { send: () => fromDeltas([]) }
    const { result } = renderHook(() => useChatThread({ transport }))

    act(() => result.current.send('   '))
    expect(result.current.messages).toHaveLength(0)

    act(() =>
      result.current.replace([
        { id: 'x', role: 'user', parts: [{ type: 'text', text: 'repris' }] },
      ]),
    )
    expect(result.current.messages).toEqual([
      { id: 'x', role: 'user', parts: [{ type: 'text', text: 'repris' }] },
    ])
  })
})
