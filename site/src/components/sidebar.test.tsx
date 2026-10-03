import { cleanup, render, screen } from '@testing-library/react'
import { catalogue } from '@nomosui/react'
import { afterEach, describe, expect, it } from 'vitest'

import { bricks, levels } from '../catalogue'
import { en } from '../i18n/en'
import { docsSlugs } from '../router'
import { PrevNext } from './prev-next'
import { SidebarNav } from './sidebar'

afterEach(cleanup)

describe('catalogue sidebar', () => {
  it('lists every catalogue brick with no hand edit', () => {
    render(<SidebarNav route={{ kind: 'home' }} />)

    for (const entry of catalogue) {
      const link = screen.getByRole('link', { name: entry.manifest.title })
      expect(link.getAttribute('href'), `${entry.manifest.name} missing from the sidebar`).toBe(
        `#/brick/${entry.manifest.name}`,
      )
    }

    // Catalogue + Tokens + every brick + every docs page, and nothing invented.
    expect(screen.getAllByRole('link')).toHaveLength(catalogue.length + 2 + docsSlugs.length)
  })

  it('groups bricks by level', () => {
    render(<SidebarNav route={{ kind: 'home' }} />)

    for (const level of levels) {
      if (bricks.some((brick) => brick.level === level)) {
        expect(screen.getByText(en.levels[level])).toBeTruthy()
      }
    }
  })

  it('marks the current entry active', () => {
    const brick = bricks[0]
    render(<SidebarNav route={{ kind: 'brick', name: brick.name }} />)

    expect(screen.getByRole('link', { name: brick.title }).getAttribute('aria-current')).toBe('page')
  })
})

describe('prev/next', () => {
  it('follows the catalogue order', () => {
    const middle = bricks[1]
    render(<PrevNext name={middle.name} />)

    expect(screen.getByLabelText('Previous brick').getAttribute('href')).toBe(
      `#/brick/${bricks[0].name}`,
    )
    expect(screen.getByLabelText('Next brick').getAttribute('href')).toBe(
      `#/brick/${bricks[2].name}`,
    )
  })

  it('disappears at the ends', () => {
    render(<PrevNext name={bricks[0].name} />)
    expect(screen.queryByLabelText('Previous brick')).toBeNull()
    expect(screen.getByLabelText('Next brick')).toBeTruthy()
    cleanup()

    render(<PrevNext name={bricks[bricks.length - 1].name} />)
    expect(screen.getByLabelText('Previous brick')).toBeTruthy()
    expect(screen.queryByLabelText('Next brick')).toBeNull()
  })
})
