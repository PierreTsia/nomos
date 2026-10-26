import { createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import { findComponent } from '@nomos/catalogue/registry'
import { findComposite } from '@nomos/composites'
import { emitIntent, installViewBridge } from '@nomos/mcp/view/bridge'
import { VIEW_DATA_ID, VIEW_ROOT_ID } from '@nomos/mcp/view-contract'

/**
 * The MCP App view entry (ADR 0023, 0033). It is **bundled** (`npm run build:view`) and
 * served inside the iframe: it mounts the component — or the scene —, installs the bridge,
 * and **re-renders** when the host pushes the tool result (`ui/notifications/tool-result`).
 * It never mutates the host's state: interactions become **intents**.
 */
type ViewData = { name?: string; props?: Record<string, unknown>; client?: boolean }

const COMPOSITE_PREFIX = 'composite:'

const rootElement = document.getElementById(VIEW_ROOT_ID)
const dataElement = document.getElementById(VIEW_DATA_ID)

if (rootElement && dataElement) {
  const data = JSON.parse(dataElement.textContent ?? '{}') as ViewData
  const emit = (action: string, detail?: unknown) => emitIntent(window, action, detail)
  const viewRoot = createRoot(rootElement)

  ;(window as unknown as { __nomosViewMounted?: string | null }).__nomosViewMounted =
    data.name ?? null

  const render = (props: Record<string, unknown>): void => {
    if (!data.name) return
    try {
      if (data.name.startsWith(COMPOSITE_PREFIX)) {
        // A scene (ADR 0023): its `render` takes the scene data.
        viewRoot.render(findComposite(data.name.slice(COMPOSITE_PREFIX.length)).render(props))
        return
      }
      const { component } = findComponent(data.name)
      // The bridge (delegating `[data-intent]` on the root) carries `select`; the component
      // only receives what it needs to report its value changes — otherwise a click fires twice.
      const handlers = {
        onChange: (value: unknown) => emit('change', value),
      }
      const children = (props.children ?? undefined) as ReactNode
      viewRoot.render(
        createElement(component as never, { ...props, ...handlers } as never, children),
      )
    } catch (error) {
      emit('error', String(error))
    }
  }

  // The bridge: intents to the host, and incoming data (ADR 0023). A `client:false` view is
  // a **pre-rendered** artefact: incoming props cannot rebuild it (its example does not
  // serialize), and a host pushing `{}` would wipe it. So re-render only what a view can mount.
  installViewBridge(window, rootElement, emit, (incoming) => {
    if (data.client) render(incoming)
  })

  if (data.client) render(data.props ?? {})
}
