import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { en } from '../i18n/en'
import { DocsPage } from './docs'

describe('DocsPage — start from the starter', () => {
  it('renders the scaffold step', () => {
    render(<DocsPage slug="starter" />)
    expect(screen.getByText(en.docs.starter.scaffoldTitle)).toBeTruthy()
    expect(screen.getByText(en.docs.starter.runTitle)).toBeTruthy()
  })
})
