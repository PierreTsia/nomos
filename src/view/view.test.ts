import { describe, expect, it } from 'vitest'

import { APP_VIEW_MIME, appViewUri, compositeViewUri, renderView, viewCss } from '@nomos/view'

/**
 * L'entrée publique du builder de vues (ADR 0034) : un document auto-suffisant, dans le
 * skin du consommateur, sans Tailwind au runtime. Le smoke (`smoke:consumer`) prouve le
 * paquet installé ; ce test tient la même promesse dans le dépôt.
 */
describe('le builder de vues public', () => {
  const skin = {
    semantic: {
      color: { background: { $value: { dark: '174 100% 39%', light: '174 100% 39%' } } },
    },
  }

  it('rend une brique dans le skin du consommateur, avec les utilitaires du cœur', () => {
    const html = renderView({ name: 'badge', skin })

    expect(html).toContain('--nomos-color-background: 174 100% 39%;')
    expect(html).toContain('.bg-primary')
    expect(html).toContain('nomos-view')
    expect(APP_VIEW_MIME).toBe('text/html;profile=mcp-app')
    expect(appViewUri('badge')).toBe('ui://nomos/badge')
  })

  it('rend une scène composite', () => {
    const html = renderView({ composite: 'form' })

    expect(html).toContain('data-component="composite:form"')
    expect(compositeViewUri('form')).toBe('ui://nomos/composite/form')
  })

  it('exige un nom ou une scène, et pas les deux', () => {
    expect(() => renderView({})).toThrow(/pass `name`/)
    expect(() => renderView({ name: 'badge', composite: 'form' })).toThrow(/not both/)
  })

  it('expose la couche utilitaires compilée', () => {
    expect(viewCss).toContain('.bg-primary')
  })
})
