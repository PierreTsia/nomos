import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { bricks } from '../catalogue'
import { en } from '../i18n/en'
import { CataloguePage } from './catalogue'

afterEach(cleanup)

describe('catalogue page', () => {
  it('links every brick on its own route, with no hand edit', () => {
    const { container } = render(<CataloguePage />)

    for (const brick of bricks) {
      expect(
        container.querySelector(`a[href="#/brick/${brick.name}"]`),
        `${brick.name} missing from the catalogue page`,
      ).toBeTruthy()
    }
  })

  it('shows the catalogue heading and lead', () => {
    render(<CataloguePage />)

    expect(screen.getByRole('heading', { name: en.catalogue.title })).toBeTruthy()
    expect(screen.getByText(en.catalogue.lead(bricks.length))).toBeTruthy()
  })
})
