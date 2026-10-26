import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { en } from '../i18n/en'
import { DocsPage } from './docs'

describe('DocsPage — start from the starter', () => {
  it('renders every step of the recipe', () => {
    render(<DocsPage slug="starter" />)
    for (const title of [
      en.docs.starter.scaffoldTitle,
      en.docs.starter.renameTitle,
      en.docs.starter.fillTitle,
      en.docs.starter.skinTitle,
      en.docs.starter.runTitle,
    ]) {
      expect(screen.getByText(title)).toBeTruthy()
    }
  })
})
