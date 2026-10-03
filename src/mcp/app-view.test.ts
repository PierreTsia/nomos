import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

import {
  APP_VIEW_MIME,
  appViewFor,
  appViewUri,
  compositeViewFor,
  compositeViewUri,
  renderComponentMarkup,
  renderCompositeMarkup,
} from '@nomos/mcp/app-view'
import { buildReferenceHost } from '@nomos/mcp/reference-host'
import { loadDefaultTokens } from '@nomos/mcp/default-tokens'
import { emitIntent, installViewBridge } from '@nomos/mcp/view/bridge'
import {
  UI_HOST_CONTEXT_CHANGED,
  UI_INITIALIZE,
  UI_INITIALIZED,
  UI_MESSAGE,
  UI_TOOL_INPUT,
  UI_TOOL_RESULT,
  type JsonRpcMessage,
} from '@nomos/mcp/view-contract'
import { VIEW_CSS } from '@nomos/mcp/view-css.generated'

/** Le défaut du cœur, lu une fois : le builder prend un document de tokens déjà résolu. */
const tokens = loadDefaultTokens()

/** Une fenêtre factice : on lit ce que la vue poste et on lui pousse des messages d'hôte. */
function fakeWindow() {
  const listeners: Array<(event: MessageEvent) => void> = []
  const posted: JsonRpcMessage[] = []
  const win = {
    parent: { postMessage: (message: JsonRpcMessage) => posted.push(message) },
    addEventListener: (_type: string, listener: (event: MessageEvent) => void) =>
      listeners.push(listener),
  } as unknown as Window
  const dispatch = (data: unknown) =>
    listeners.forEach((listener) => listener(new MessageEvent('message', { data })))
  return { win, posted, dispatch }
}

function viewRoot(): HTMLElement {
  document.body.innerHTML = '<div id="nomos-view"></div>'
  return document.getElementById('nomos-view') as HTMLElement
}

/**
 * Les vues MCP Apps (ADR 0013) : un document auto-suffisant, un pont qui n'émet que des
 * intentions, un hôte qui sandboxe. Aucune couche composant ne connaît l'extension.
 */
describe('les vues MCP Apps', () => {
  it('pré-rend le markup d’un composant du catalogue', () => {
    expect(renderComponentMarkup('freshness')).toContain('2 hours ago')
  })

  it('embarque tokens, markup, props et bundle, thème et densité sur sa propre racine', () => {
    const view = appViewFor('freshness', tokens)

    expect(view).toContain('--nomos-color-background')
    expect(view).toContain('2 hours ago')
    expect(view).toContain(
      'id="nomos-view" data-component="freshness" data-theme="dark" data-density="comfortable"',
    )
    expect(view).toContain('id="nomos-view-data"')
    expect(view).toContain('"client":true')
    expect(APP_VIEW_MIME).toBe('text/html;profile=mcp-app')
    expect(appViewUri('freshness')).toBe('ui://nomos/freshness')
  })

  it('porte la couche utilitaires du cœur, sinon les composants ne sont pas stylés (ADR 0022)', () => {
    const view = appViewFor('badge', tokens)

    expect(view).toContain('.bg-primary')
    expect(view).toContain('.inline-flex')
    expect(view).toContain('var(--nomos-color-primary)')
  })

  it('sert un overlay stylé et animé : voile, empilement et mouvement des tokens (ADR 0027)', () => {
    // Le scan des vues couvre `../components`, sinon le panneau sortirait non stylé.
    expect(VIEW_CSS).toContain('.bg-scrim')
    expect(VIEW_CSS).toContain('var(--nomos-z-overlay)')
    expect(VIEW_CSS).toContain('@keyframes nomos-fade-in')
    expect(VIEW_CSS).toContain('@keyframes nomos-slide-in-right')

    expect(compositeViewFor('overlay', tokens)).toContain('data-component="composite:overlay"')
  })

  it('laisse un élément React pré-rendu seul (pas de vue client)', () => {
    const view = appViewFor('table', tokens)

    expect(view).toContain('"client":false')
  })

  it('pré-rend une scène composite et la monte client pour recevoir des données (ADR 0023)', () => {
    expect(renderCompositeMarkup('form')).toContain('Save')

    const view = compositeViewFor('form', tokens)
    expect(view).toContain('data-component="composite:form"')
    expect(view).toContain('"client":true')
    expect(compositeViewUri('form')).toBe('ui://nomos/composite/form')
  })

  it('le pont ouvre la poignée de main MCP Apps et pose le contexte de l’hôte', () => {
    const root = viewRoot()
    const { win, posted, dispatch } = fakeWindow()

    installViewBridge(win, root, () => {})

    expect(posted[0]).toMatchObject({ jsonrpc: '2.0', method: UI_INITIALIZE })

    dispatch({
      jsonrpc: '2.0',
      id: (posted[0] as { id: string }).id,
      result: { hostContext: { theme: 'light', density: 'compact' } },
    })

    expect(root.getAttribute('data-theme')).toBe('light')
    expect(root.getAttribute('data-density')).toBe('compact')
    expect(posted[1]).toMatchObject({ jsonrpc: '2.0', method: UI_INITIALIZED })
  })

  it('le pont re-rend la vue sur le résultat de l’outil, sans muter l’hôte (ADR 0023)', () => {
    const root = viewRoot()
    const { win, dispatch } = fakeWindow()
    const received: Record<string, unknown>[] = []

    installViewBridge(win, root, () => {}, (data) => received.push(data))

    dispatch({
      jsonrpc: '2.0',
      method: UI_TOOL_INPUT,
      params: { arguments: { props: { children: 'A' } } },
    })
    dispatch({
      jsonrpc: '2.0',
      method: UI_TOOL_RESULT,
      params: { structuredContent: { props: { children: 'GL' } } },
    })

    expect(received).toEqual([{ children: 'A' }, { children: 'GL' }])
  })

  it('un changement de contexte de l’hôte repose le thème (SEP-1865)', () => {
    const root = viewRoot()
    const { win, dispatch } = fakeWindow()

    installViewBridge(win, root, () => {})
    dispatch({ jsonrpc: '2.0', method: UI_HOST_CONTEXT_CHANGED, params: { theme: 'light' } })

    expect(root.getAttribute('data-theme')).toBe('light')
  })

  it('une intention devient un message pour l’hôte (SEP-1865)', () => {
    const { win, posted } = fakeWindow()

    emitIntent(win, 'select', null)

    expect(posted[0]).toMatchObject({
      jsonrpc: '2.0',
      method: UI_MESSAGE,
      params: { role: 'user', content: { type: 'text' } },
    })
    const text = (posted[0] as { params: { content: { text: string } } }).params.content.text
    expect(JSON.parse(text)).toEqual({ action: 'select', detail: null })
  })

  it('un échec de rendu part en log, pas en message de conversation', () => {
    const { win, posted } = fakeWindow()

    emitIntent(win, 'error', 'boom')

    expect(posted[0]).toMatchObject({
      jsonrpc: '2.0',
      method: 'notifications/message',
      params: { level: 'error', data: 'boom' },
    })
  })

  it('le pont recueille toutes les intentions, piloté par les clics', () => {
    const root = viewRoot()
    const { win } = fakeWindow()
    const intents: string[] = []

    installViewBridge(win, root, (action) => intents.push(action))
    root.click()

    expect(intents).toEqual(['select'])
  })

  it('l’hôte de référence sandboxe la vue et parle le dialecte MCP Apps', () => {
    const host = buildReferenceHost({
      viewUri: appViewUri('freshness'),
      viewHtml: '<div id="nomos-view">vue</div>',
      theme: 'light',
      density: 'compact',
    })

    expect(host).toContain('sandbox="allow-scripts"')
    expect(host).not.toContain('allow-same-origin')
    expect(host).toContain('&lt;div id=&quot;nomos-view&quot;&gt;')
    expect(host).toContain("method === 'ui/initialize'")
    expect(host).toContain("method: 'ui/notifications/tool-result'")
    expect(host).toContain("theme: THEME")
    expect(host).toContain("density: DENSITY")
  })

  it('aucun composant du cœur ne touche une API d’extension', () => {
    const components = path.resolve(import.meta.dirname, '..', 'components')
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((entry) => {
        const full = path.join(dir, entry)
        return statSync(full).isDirectory() ? walk(full) : [full]
      })
    const offenders = walk(components)
      .filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\./.test(file))
      .filter((file) => /postMessage|window\.parent|ui:\/\//.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(components, file))

    expect(offenders).toEqual([])
  })
})
