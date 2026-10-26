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
  it('renders a text child and props as attributes', () => {
    expect(snippetFromExample('Button', { variant: 'outline', children: 'Save' })).toBe(
      '<Button variant="outline">Save</Button>',
    )
  })

  it('renders a self-closing element with no child', () => {
    expect(snippetFromExample('Input', { placeholder: 'search' })).toBe(
      '<Input placeholder="search" />',
    )
  })

  it('renders numbers in braces and true booleans bare', () => {
    expect(snippetFromExample('Counter', { value: 128, suffix: 'issues' })).toBe(
      '<Counter value={128} suffix="issues" />',
    )
    expect(snippetFromExample('Checkbox', { checked: true })).toBe('<Checkbox checked />')
  })

  it('renders a function as `() => {}`', () => {
    expect(snippetFromExample('Switch', { checked: true, onCheckedChange: () => {} })).toBe(
      '<Switch checked onCheckedChange={() => {}} />',
    )
  })

  it('renders element children on several lines, with no Fragment tag', () => {
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

  it('names the brick from its component, even without a JSX title', () => {
    expect(snippetFromExample('ProgressBar', { value: 60 })).toBe('<ProgressBar value={60} />')
  })

  it('generates a valid snippet for every catalogue example', () => {
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

  it('names the nested tags of createElement examples', () => {
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
