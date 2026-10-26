import { createElement, Fragment } from 'react'
import { describe, expect, it } from 'vitest'

import { catalogue } from '@nomosui/react'

import { snippetFromExample } from './snippet'

/**
 * The snippet is **generated** from `manifest.example` (a choice: no second source). This test
 * proves it over the **whole** catalogue: every example yields non-empty JSX naming the brick.
 * It is the guard that replaces the "no dead snippet" of a hand-written file.
 */
describe('snippetFromExample', () => {
  it('rend un enfant texte et les props en attributs', () => {
    expect(snippetFromExample('Button', { variant: 'outline', children: 'Save' })).toBe(
      '<Button variant="outline">Save</Button>',
    )
  })

  it('rend un élément auto-fermé sans enfant', () => {
    expect(snippetFromExample('Input', { placeholder: 'search' })).toBe(
      '<Input placeholder="search" />',
    )
  })

  it('rend les nombres en accolades et les booléens vrais nus', () => {
    expect(snippetFromExample('Counter', { value: 128, suffix: 'issues' })).toBe(
      '<Counter value={128} suffix="issues" />',
    )
    expect(snippetFromExample('Checkbox', { checked: true })).toBe('<Checkbox checked />')
  })

  it('rend une fonction en `() => {}`', () => {
    expect(snippetFromExample('Switch', { checked: true, onCheckedChange: () => {} })).toBe(
      '<Switch checked onCheckedChange={() => {}} />',
    )
  })

  it('rend des enfants en éléments, sur plusieurs lignes, sans balise Fragment', () => {
    const snippet = snippetFromExample('Card', {
      children: createElement(
        Fragment,
        null,
        createElement('span', null, 'Title'),
        createElement('p', null, 'Body'),
      ),
    })
    expect(snippet).toContain('<Card>')
    expect(snippet).toContain('<span>Title</span>')
    expect(snippet).toContain('<p>Body</p>')
    expect(snippet).not.toContain('Fragment')
    expect(snippet).not.toContain('<Component')
  })

  it('nomme la brique à partir de son composant, même sans titre JSX', () => {
    expect(snippetFromExample('ProgressBar', { value: 60 })).toBe('<ProgressBar value={60} />')
  })

  it('génère un snippet valide pour chaque exemple du catalogue', () => {
    for (const { manifest, component } of catalogue) {
      const example = manifest.example
      if (!example) continue
      const name =
        (component as { displayName?: string }).displayName ?? component.name ?? manifest.title
      const snippet = snippetFromExample(name, example as Record<string, unknown>)
      expect(snippet, manifest.name).toMatch(/^<[A-Z]/)
      expect(snippet, manifest.name).toContain(`<${name}`)
      // No phantom tag: a `Fragment` must not leak as `<Fragment>`/`<Component>`, and every
      // opening tag must carry a name (no bare `<>` and no broken `<`).
      expect(snippet, manifest.name).not.toContain('<Component')
      expect(snippet, manifest.name).not.toContain('<Fragment')
    }
  })

  it('nomme les balises imbriquées des exemples en createElement', () => {
    const card = catalogue.find((entry) => entry.manifest.name === 'card')!
    const snippet = snippetFromExample(
      'Card',
      card.manifest.example as Record<string, unknown>,
    )
    expect(snippet).toContain('<CardHeader')
    expect(snippet).toContain('<CardTitle')
    expect(snippet).not.toContain('Component')

    const alertDialog = catalogue.find((entry) => entry.manifest.name === 'alert-dialog')!
    const dialogSnippet = snippetFromExample(
      'AlertDialog',
      alertDialog.manifest.example as Record<string, unknown>,
    )
    expect(dialogSnippet).toContain('<AlertDialogTrigger')
    expect(dialogSnippet).not.toContain('Component')
  })
})
