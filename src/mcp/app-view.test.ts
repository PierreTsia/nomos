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
import { installViewBridge } from '@nomos/mcp/view/bridge'
import { VIEW_CSS } from '@nomos/mcp/view-css.generated'
import { VIEW_SOURCE } from '@nomos/mcp/view-contract'

/**
 * Les vues MCP Apps (ADR 0013) : un document auto-suffisant, un pont qui n'émet que des
 * intentions, un hôte qui sandboxe. Aucune couche composant ne connaît l'extension.
 */
describe('les vues MCP Apps', () => {
  it('pré-rend le markup d’un composant du catalogue', () => {
    expect(renderComponentMarkup('freshness')).toContain('il y a 2 heures')
  })

  it('embarque tokens, markup, props et bundle, thème et densité sur sa propre racine', () => {
    const view = appViewFor('freshness')

    expect(view).toContain('--nomos-color-background')
    expect(view).toContain('il y a 2 heures')
    expect(view).toContain(
      'id="nomos-view" data-component="freshness" data-theme="dark" data-density="comfortable"',
    )
    expect(view).toContain('id="nomos-view-data"')
    expect(view).toContain('"client":true')
    expect(APP_VIEW_MIME).toBe('text/html;profile=mcp-app')
    expect(appViewUri('freshness')).toBe('ui://nomos/freshness')
  })

  it('porte la couche utilitaires du cœur, sinon les composants ne sont pas stylés (ADR 0022)', () => {
    const view = appViewFor('badge')

    expect(view).toContain('.bg-primary')
    expect(view).toContain('.inline-flex')
    expect(view).toContain('var(--nomos-color-primary)')
  })

  it('sert un overlay stylé et animé : voile, empilement et mouvement des tokens (ADR 0027)', () => {
    // Le scan des vues couvre `../internal`, sinon le panneau sortirait non stylé.
    expect(VIEW_CSS).toContain('.bg-scrim')
    expect(VIEW_CSS).toContain('var(--nomos-z-overlay)')
    expect(VIEW_CSS).toContain('@keyframes nomos-fade-in')
    expect(VIEW_CSS).toContain('@keyframes nomos-slide-in-right')

    expect(compositeViewFor('overlay')).toContain('data-component="composite:overlay"')
  })

  it('laisse un élément React pré-rendu seul (pas de vue client)', () => {
    const view = appViewFor('table')

    expect(view).toContain('"client":false')
  })

  it('pré-rend une scène composite et la monte client pour recevoir des données (ADR 0023)', () => {
    expect(renderCompositeMarkup('form')).toContain('Enregistrer')

    const view = compositeViewFor('form')
    expect(view).toContain('data-component="composite:form"')
    expect(view).toContain('"client":true')
    expect(compositeViewUri('form')).toBe('ui://nomos/composite/form')
  })

  it('le pont émet des intentions, et `set-view` ne fait que poser des attributs', () => {
    document.body.innerHTML = '<div id="nomos-view"></div>'
    const root = document.getElementById('nomos-view') as HTMLElement
    const posted: unknown[] = []

    installViewBridge(window, root, (action, detail) => {
      posted.push({ source: VIEW_SOURCE, type: 'intent', action, detail: detail ?? null })
    })

    expect(posted[0]).toMatchObject({ type: 'intent', action: 'ready' })

    root.click()
    expect(posted[1]).toMatchObject({ type: 'intent', action: 'select' })

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: VIEW_SOURCE, type: 'set-view', theme: 'light', density: 'compact' },
      }),
    )
    expect(root.getAttribute('data-theme')).toBe('light')
    expect(root.getAttribute('data-density')).toBe('compact')
  })

  it('le pont relaie les données poussées par l’hôte (ADR 0023)', () => {
    document.body.innerHTML = '<div id="nomos-view"></div>'
    const root = document.getElementById('nomos-view') as HTMLElement
    const received: Record<string, unknown>[] = []

    installViewBridge(window, root, () => {}, (data) => received.push(data))

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: VIEW_SOURCE, type: 'set-data', data: { children: 'GL' } },
      }),
    )

    expect(received).toEqual([{ children: 'GL' }])
  })

  it('l’hôte de référence sandboxe la vue et lui pousse son apparence', () => {
    const host = buildReferenceHost({
      viewUri: appViewUri('freshness'),
      viewHtml: '<div id="nomos-view">vue</div>',
      theme: 'light',
      density: 'compact',
    })

    expect(host).toContain('sandbox="allow-scripts"')
    expect(host).not.toContain('allow-same-origin')
    expect(host).toContain('&lt;div id=&quot;nomos-view&quot;&gt;')
    expect(host).toContain("theme: 'light'")
    expect(host).toContain("density: 'compact'")
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
