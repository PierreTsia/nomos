/**
 * The message contract between a view and its host (ADR 0033, aligning ADR 0013). It lives
 * outside `app-view.ts` — which reads files server-side — because the bridge is also
 * bundled in the view, browser-side. The view speaks **JSON-RPC 2.0 over `postMessage`**,
 * the dialect MCP Apps (SEP-1865) defines.
 */

export const VIEW_ROOT_ID = 'nomos-view'
export const VIEW_DATA_ID = 'nomos-view-data'

/** The MCP Apps protocol revision the view speaks. */
export const UI_PROTOCOL_VERSION = '2026-01-26'

/** Lifecycle: the view announces itself, the host answers with its context (SEP-1865). */
export const UI_INITIALIZE = 'ui/initialize'
export const UI_INITIALIZED = 'ui/notifications/initialized'
/** The host pushes the tool call and its result; the view re-renders (ADR 0023). */
export const UI_TOOL_INPUT = 'ui/notifications/tool-input'
export const UI_TOOL_RESULT = 'ui/notifications/tool-result'
/** The host notifies a context change (theme, display mode). */
export const UI_HOST_CONTEXT_CHANGED = 'ui/notifications/host-context-changed'
/** A view interaction reaches the host as a message (SEP-1865). */
export const UI_MESSAGE = 'ui/message'
/** A failed render is a log, not a conversation message (standard MCP logging). */
export const LOG_MESSAGE = 'notifications/message'

/** Les intentions qu'une vue émet vers l'hôte (ADR 0033) : `select` (choix), `change`
 *  (valeur) et `error` (échec de rendu). La surface publique les fige (ADR 0024). */
export const INTENTS = ['select', 'change', 'error'] as const
export type Intent = (typeof INTENTS)[number]

export type JsonRpcId = string | number

export type JsonRpcRequest = {
  jsonrpc: '2.0'
  id: JsonRpcId
  method: string
  params?: unknown
}

export type JsonRpcNotification = {
  jsonrpc: '2.0'
  method: string
  params?: unknown
}

export type JsonRpcResponse = {
  jsonrpc: '2.0'
  id: JsonRpcId
  result?: unknown
  error?: { code: number; message: string }
}

export type JsonRpcMessage = JsonRpcRequest | JsonRpcNotification | JsonRpcResponse

/** What the host tells the view about itself: at least the theme (ADR 0033). */
export type HostContext = {
  theme?: 'light' | 'dark'
  /** Nomos' density (ADR 0008) rides the host context as an extra field; standard hosts omit it. */
  density?: string
  [key: string]: unknown
}

/** A standard MCP `CallToolResult` — the shape the host pushes on `ui/notifications/tool-result`. */
export type ToolResult = {
  content?: Array<{ type: string; text?: string }>
  structuredContent?: Record<string, unknown>
  isError?: boolean
}
