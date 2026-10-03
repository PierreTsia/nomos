import { describe, expect, it } from 'vitest'

import { parseHash } from './router'

describe('hash router', () => {
  it('maps the marketing home', () => {
    expect(parseHash('#/')).toEqual({ kind: 'home' })
  })

  it('maps the catalogue to its own route', () => {
    expect(parseHash('#/catalogue')).toEqual({ kind: 'catalogue' })
  })

  it('maps the tokens page', () => {
    expect(parseHash('#/tokens')).toEqual({ kind: 'tokens' })
  })

  it('maps a brick', () => {
    expect(parseHash('#/brick/button')).toEqual({ kind: 'brick', name: 'button' })
  })

  it('maps a docs slug', () => {
    expect(parseHash('#/docs/boundary')).toEqual({ kind: 'docs', slug: 'boundary' })
  })

  it('falls back to the home on an unknown path', () => {
    expect(parseHash('#/nope')).toEqual({ kind: 'home' })
  })
})
