import { catalogue } from '@nomosui/react'
import { describe, expect, it } from 'vitest'

import { bricks, findBrick } from './catalogue'

describe('catalogue coverage', () => {
  it('renders one page per catalogue entry', () => {
    expect(bricks).toHaveLength(catalogue.length)
  })

  it('maps every entry by its manifest name', () => {
    for (const entry of catalogue) {
      expect(findBrick(entry.manifest.name)).toBeDefined()
    }
  })

  it('invents no brick outside the catalogue', () => {
    const names = new Set(catalogue.map((entry) => entry.manifest.name))
    for (const brick of bricks) expect(names.has(brick.name)).toBe(true)
  })
})
