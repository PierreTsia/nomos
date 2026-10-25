import { createElement, Fragment } from 'react'
import { describe, expect, it } from 'vitest'

import { catalogue } from '@nomosui/react'

import { snippetFromExample } from './snippet'

/**
 * Le snippet est **généré** depuis `manifest.example` (choix : pas de seconde source). Ce
 * test le prouve sur **tout** le catalogue : chaque exemple produit un JSX non vide qui
 * nomme la brique. C'est la garde qui remplace le « pas de snippet mort » d'un fichier écrit
 * à la main.
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

  it('rend des enfants en éléments, sur plusieurs lignes', () => {
    const snippet = snippetFromExample('Card', {
      children: createElement(Fragment, null, createElement('span', null, 'x')),
    })
    expect(snippet).toContain('<Card>')
    expect(snippet).toContain('<span>x</span>')
  })

  it('nomme la brique à partir de son composant, même sans titre JSX', () => {
    expect(snippetFromExample('ProgressBar', { value: 60 })).toBe('<ProgressBar value={60} />')
  })

  it('génère un snippet pour chaque exemple du catalogue', () => {
    for (const { manifest, component } of catalogue) {
      const example = manifest.example
      if (!example) continue
      const name =
        (component as { displayName?: string }).displayName ?? component.name ?? manifest.title
      const snippet = snippetFromExample(name, example as Record<string, unknown>)
      expect(snippet, manifest.name).toMatch(/^<[A-Z]/)
      expect(snippet, manifest.name).toContain(`<${name}`)
    }
  })
})
