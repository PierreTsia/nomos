import { VIEW_SOURCE, type HostMessage, type ViewIntent } from '@nomos/mcp/view-contract'

/**
 * Le pont d'une vue (ADR 0013) : il émet des intentions vers le parent et ne reçoit
 * qu'un ordre d'apparence. Il est pur côté DOM — on lui passe la racine — donc testable
 * sans iframe.
 */
export type Emit = (action: string, detail?: unknown) => void

export function emitIntent(win: Window, action: string, detail: unknown = null): void {
  const intent: ViewIntent = { source: VIEW_SOURCE, type: 'intent', action, detail }
  win.parent.postMessage(intent, '*')
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

  win.addEventListener('message', (event: MessageEvent) => {
    const data = event.data as HostMessage | undefined
    if (!data || data.source !== VIEW_SOURCE) return
    if (data.type === 'set-view') {
      if (data.theme) root.setAttribute('data-theme', data.theme)
      if (data.density) root.setAttribute('data-density', data.density)
    }
    // Les données de la vue (ADR 0023) : la vue re-rend, elle ne mute rien de l'hôte.
    if (data.type === 'set-data') onData?.(data.data)
  })

  emit('ready')
}
