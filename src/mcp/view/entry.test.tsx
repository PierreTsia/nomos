import { act } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Badge } from '@nomos/components/badge/badge'
import { Conversation } from '@nomos/components/conversation/conversation'
import { Message } from '@nomos/components/message/message'
import { VIEW_DATA_ID, VIEW_ROOT_ID } from '@nomos/mcp/view-contract'

/**
 * The view entry (ADR 0023): a `client:false` view is a **pre-rendered** artefact — its
 * example does not serialize. When the host pushes props, it must not re-render — otherwise
 * an incoming `{}` wipes the pre-rendered markup (the bug this test pins). A `client:true`
 * view does re-render. React renders asynchronously: flush it with `act` before reading the DOM.
 */
const ENTRY = '@nomos/mcp/view/entry'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function mount({ name, client, markup }: { name: string; client: boolean; markup: string }) {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  root.id = VIEW_ROOT_ID
  root.innerHTML = markup
  const data = document.createElement('script')
  data.id = VIEW_DATA_ID
  data.type = 'application/json'
  data.textContent = JSON.stringify({ name, props: {}, client })
  document.body.append(root, data)
  return root
}

async function pushToolResult(props: Record<string, unknown>) {
  await act(async () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          method: 'ui/notifications/tool-result',
          params: { structuredContent: { props } },
        },
      }),
    )
  })
}

describe('the view entry and the host data', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('keeps the pre-rendered markup of a client:false view when the host pushes empty props', async () => {
    const markup = renderToStaticMarkup(
      <Conversation label="Conversation" className="h-64">
        <Message role="user" parts={[{ type: 'text', text: 'Hello there' }]} />
      </Conversation>,
    )
    const root = mount({ name: 'conversation', client: false, markup })

    await import(ENTRY)
    await pushToolResult({})

    expect(root.textContent).toContain('Hello there')
  })

  it('re-renders a client:true view when the host pushes props', async () => {
    const root = mount({
      name: 'badge',
      client: true,
      markup: renderToStaticMarkup(<Badge>draft</Badge>),
    })

    await import(ENTRY)
    await pushToolResult({ children: 'live' })

    expect(root.textContent).toContain('live')
  })
})
