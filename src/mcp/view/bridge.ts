import {
  LOG_MESSAGE,
  UI_HOST_CONTEXT_CHANGED,
  UI_INITIALIZE,
  UI_INITIALIZED,
  UI_MESSAGE,
  UI_PROTOCOL_VERSION,
  UI_SIZE_CHANGED,
  UI_TOOL_INPUT,
  UI_TOOL_RESULT,
  type HostContext,
  type JsonRpcMessage,
  type JsonRpcResponse,
  type ToolResult,
} from '@nomos/mcp/view-contract'

/**
 * Le pont d'une vue (ADR 0033, aligné sur MCP Apps) : il parle le dialecte JSON-RPC 2.0
 * sur `postMessage` — poignée de main, données de l'outil en entrée, intentions en sortie.
 * Il est pur côté DOM — on lui passe la fenêtre et la racine — donc testable sans iframe.
 * Il ne mute jamais l'hôte : une interaction devient un `ui/message` que l'hôte arbitre.
 */
export type Emit = (action: string, detail?: unknown) => void

let nextId = 0
const newId = (): string => `nomos-${++nextId}`

function send(win: Window, message: JsonRpcMessage): void {
  win.parent.postMessage(message, '*')
}

/** Une intention atteint l'hôte comme un message (SEP-1865, `ui/message`) ; un échec de
 *  rendu est un log, pas un message de conversation (logging MCP standard). */
export function emitIntent(win: Window, action: string, detail: unknown = null): void {
  if (action === 'error') {
    send(win, { jsonrpc: '2.0', method: LOG_MESSAGE, params: { level: 'error', data: detail } })
    return
  }
  send(win, {
    jsonrpc: '2.0',
    id: newId(),
    method: UI_MESSAGE,
    params: { role: 'user', content: [{ type: 'text', text: JSON.stringify({ action, detail }) }] },
  })
}

function isRpc(message: unknown): message is JsonRpcMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as JsonRpcMessage).jsonrpc === '2.0'
  )
}

/** Le contexte de l'hôte pose l'apparence de la vue : le thème sur sa racine, jamais ses tokens (ADR 0022). */
function applyContext(root: HTMLElement, context: HostContext | undefined): void {
  if (context?.theme) root.setAttribute('data-theme', context.theme)
  if (context?.density) root.setAttribute('data-density', context.density)
}

/** Les props d'un résultat d'outil : `structuredContent.props` d'abord, sinon le bloc texte JSON (ADR 0023). */
function toolResultProps(result: ToolResult | undefined): Record<string, unknown> | null {
  if (!result) return null
  const structured = result.structuredContent
  if (structured && typeof structured === 'object') {
    const props = (structured as Record<string, unknown>).props
    return props && typeof props === 'object' ? (props as Record<string, unknown>) : null
  }
  const text = result.content?.find((block) => block.type === 'text')?.text
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>
      if (parsed && typeof parsed === 'object') {
        return (parsed.props as Record<string, unknown>) ?? parsed
      }
    } catch {
      // Le markup pré-rendu tient lieu de repli : un résultat non-JSON ne porte pas de props.
    }
  }
  return null
}

/** La taille que la vue rapporte : la **racine de montage**, pas le document — un hôte
 *  inline veut la hauteur du contenu (SEP-1865, `ui/notifications/size-changed`). Le pont
 *  est injectable : jsdom n'a pas de `ResizeObserver`, et un test veut un observer factice. */
type SizeObserver = { observe(target: Element): void; disconnect(): void }
type SizeObserverCtor = new (callback: () => void) => SizeObserver

export function reportSize(win: Window, root: HTMLElement): void {
  const rect = root.getBoundingClientRect()
  send(win, {
    jsonrpc: '2.0',
    method: UI_SIZE_CHANGED,
    params: { width: Math.ceil(rect.width), height: Math.ceil(rect.height) },
  })
}

/** Rapporte la taille, puis à chaque redimensionnement. Sans `ResizeObserver` (vieux hôte,
 *  jsdom), seule la mesure initiale compte et l'arrêt est un no-op. */
export function observeSize(
  win: Window,
  root: HTMLElement,
  Observer: SizeObserverCtor | undefined = (
    globalThis as { ResizeObserver?: SizeObserverCtor }
  ).ResizeObserver,
): () => void {
  if (typeof Observer !== 'function') return () => {}
  const observer = new Observer(() => reportSize(win, root))
  observer.observe(root)
  return () => observer.disconnect()
}

export function installViewBridge(
  win: Window,
  root: HTMLElement,
  emit: Emit,
  onData?: (data: Record<string, unknown>) => void,
): void {
  root.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement | null)?.closest?.('[data-intent]')
    emit(target ? (target.getAttribute('data-intent') ?? 'select') : 'select')
  })

  const initialize = newId()
  let initialized = false

  win.addEventListener('message', (event: MessageEvent) => {
    const message = event.data as unknown
    if (!isRpc(message)) return

    // L'hôte répond à la poignée de main : on adopte son contexte, puis on se déclare prêt.
    if ('id' in message && message.id === initialize && !('method' in message)) {
      const response = message as JsonRpcResponse
      applyContext(root, (response.result as { hostContext?: HostContext } | undefined)?.hostContext)
      if (!initialized) {
        initialized = true
        send(win, { jsonrpc: '2.0', method: UI_INITIALIZED, params: {} })
        // La vue connaît sa taille une fois prête : l'hôte ajuste sa frame (SEP-1865).
        reportSize(win, root)
        observeSize(win, root)
      }
      return
    }

    if ('method' in message) {
      const { method, params } = message as { method: string; params?: unknown }
      if (method === UI_HOST_CONTEXT_CHANGED) {
        applyContext(root, params as HostContext)
        return
      }
      // L'outil pousse les données de la vue : elle re-rend, elle ne mute rien de l'hôte (ADR 0023).
      if (method === UI_TOOL_INPUT) {
        const props = (params as { arguments?: { props?: unknown } } | undefined)?.arguments?.props
        if (props && typeof props === 'object') onData?.(props as Record<string, unknown>)
        return
      }
      if (method === UI_TOOL_RESULT) {
        const props = toolResultProps(params as ToolResult)
        if (props) onData?.(props)
      }
    }
  })

  // Poignée de main (SEP-1865) : la vue annonce ses capacités, l'hôte répond par son contexte.
  send(win, {
    jsonrpc: '2.0',
    id: initialize,
    method: UI_INITIALIZE,
    params: {
      protocolVersion: UI_PROTOCOL_VERSION,
      appCapabilities: { availableDisplayModes: ['inline'] },
      appInfo: { name: 'nomos-view', version: '0.0.0' },
    },
  })
}
