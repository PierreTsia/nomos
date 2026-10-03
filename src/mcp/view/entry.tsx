import { createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import { findComponent } from '@nomos/catalogue/registry'
import { findComposite } from '@nomos/composites'
import { emitIntent, installViewBridge } from '@nomos/mcp/view/bridge'
import { VIEW_DATA_ID, VIEW_ROOT_ID } from '@nomos/mcp/view-contract'

/**
 * L'entrée de la vue MCP App (ADR 0023, 0033). Elle est **bundlée** (`npm run build:view`)
 * et servie dans l'iframe : elle monte le composant — ou la scène —, installe le pont, et
 * **re-rend** quand l'hôte pousse le résultat de l'outil (`ui/notifications/tool-result`).
 * Elle ne mute jamais l'état de l'hôte : les interactions deviennent des **intentions**.
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
        // Une scène (ADR 0023) : sa `render` prend les données de la scène.
        viewRoot.render(findComposite(data.name.slice(COMPOSITE_PREFIX.length)).render(props))
        return
      }
      const { component } = findComponent(data.name)
      // Le pont (delegation `[data-intent]` sur la racine) porte le `select` ; le composant
      // ne reçoit que de quoi remonter ses changements de valeur — sinon un clic émet deux fois.
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

  // Le pont : intentions vers l'hôte, et données reçues (ADR 0023).
  installViewBridge(window, rootElement, emit, (incoming) => render(incoming))

  if (data.client) render(data.props ?? {})
}
